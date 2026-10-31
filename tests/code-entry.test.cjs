const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const code = '1A-2B-3C-4-5-6A-7B-8C-9A-10B-11';

function renderEntry(input, options = {}) {
  const routes = [];
  const module = { exports: {} };
  let stateIndex = 0;
  const updates = [];
  let focusCount = 0;
  const source = ts.transpileModule(fs.readFileSync('src/components/CodeEntry.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const jsx = (type, props) => ({ type, props });
  vm.runInNewContext(source, {
    module, exports: module.exports, URL, URLSearchParams,
    require(name) {
      if (name === 'react') return {
        useId: () => 'code-entry',
        useRef: () => ({ current: { focus() { focusCount++; } } }),
        useState: initial => {
          const index = stateIndex++;
          return [[true, input, options.error ?? '', true][index], value => updates.push([index, value])];
        },
      };
      if (name === 'next/navigation') return { useRouter: () => ({ push: url => routes.push(url) }) };
      if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
      if (name === '@/lib/chapters') {
        const chapters = { exports: {} };
        vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/chapters.ts', 'utf8'), {
          compilerOptions: { module: ts.ModuleKind.CommonJS },
        }).outputText, { module: chapters, exports: chapters.exports, URL, URLSearchParams });
        return chapters.exports;
      }
      throw new Error(name);
    },
  });
  const form = module.exports.default({ defaultOpen: true });
  return { form, routes, updates, focusCount: () => focusCount };
}

function submitEntry(input) {
  const { form, routes } = renderEntry(input);
  form.props.onSubmit({ preventDefault() {} });
  assert.equal(routes.length, 1);
  return new URL(routes[0], 'https://example.com').searchParams;
}

test('pasting personalized results preserves trailing name punctuation, including wrapped links', () => {
  for (const readerName of ['Dr.', 'Alex...', 'Alex,', 'Alex']) {
    const link = `https://example.com/results?${new URLSearchParams({ code, name: readerName })}`;
    for (const input of [link, `<${link}>`, `[My book](${link})`]) {
      const params = submitEntry(input);
      assert.equal(params.get('code'), code);
      assert.equal(params.get('name'), readerName, input);
    }
  }
});

test('pasting an unpersonalized code still opens without a reader name', () => {
  const params = submitEntry(code);
  assert.equal(params.get('code'), code);
  assert.equal(params.has('name'), false);
});

function findElement(node, predicate) {
  if (!node || typeof node !== 'object') return;
  if (predicate(node)) return node;
  const children = node.props?.children;
  for (const child of Array.isArray(children) ? children : [children]) {
    const match = findElement(child, predicate);
    if (match) return match;
  }
}

for (const [label, input, error] of [
  ['a pasted code', code, ''],
  ['an invalid paste', 'bad paste', 'Invalid code'],
  ['an empty field with a validation error', '', 'Invalid code'],
]) {
  test(`Clear returns focus to the code field after clearing ${label}`, () => {
    const entry = renderEntry(input, { error });
    const field = findElement(entry.form, node => node.type === 'input');
    const clear = findElement(entry.form, node => node.type === 'button' && node.props.children === 'Clear');
    assert.ok(field.props.ref, 'input must be connected to the focus ref');
    clear.props.onClick();
    assert.deepEqual(entry.updates, [[1, ''], [2, ''], [3, false]]);
    assert.equal(entry.focusCount(), 1);
    assert.deepEqual(entry.routes, [], 'clearing must not navigate or submit');
  });
}
