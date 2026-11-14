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
  const form = module.exports.default({ defaultOpen: true, initialReaderName: options.initialReaderName });
  return { form, routes, updates, focusCount: () => focusCount };
}

function submitEntry(input, options) {
  const { form, routes } = renderEntry(input, options);
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
    const field = findElement(entry.form, node => node.type === 'textarea');
    const clear = findElement(entry.form, node => node.type === 'button' && node.props.children === 'Clear');
    assert.ok(field.props.ref, 'input must be connected to the focus ref');
    clear.props.onClick();
    assert.deepEqual(entry.updates, [[1, ''], [2, ''], [3, false]]);
    assert.equal(entry.focusCount(), 1);
    assert.deepEqual(entry.routes, [], 'clearing must not navigate or submit');
  });
}


test('chapter text without a personalized URL restores its Reader name line', () => {
  for (const resultsLink of ['', 'Results link: unavailable\n']) {
    const input = `Hyper Reality book code: ${code}\n${resultsLink}Reader name:   Alex   Dr.  \n\nAnswer recap:\n1. Example answer`;
    const params = submitEntry(input);
    assert.equal(params.get('code'), code);
    assert.equal(params.get('name'), 'Alex Dr.');
  }
});

test('an explicit URL reader name wins over an outdated Reader name line', () => {
  const link = `https://example.com/results?${new URLSearchParams({ code, name: 'Sam' })}`;
  const params = submitEntry(`Hyper Reality book code: ${code}\nResults link: ${link}\nReader name: Alex`);
  assert.equal(params.get('name'), 'Sam');
});

test('anonymous pasted results links do not inherit the broken link reader name', () => {
  for (const input of [
    `https://example.com/results?code=${code}`,
    `/results?code=${code}`,
    `https://example.com/#/results?code=${code}`,
    `https://example.com/results?code=${code}&name=`,
    `<https://example.com/results?code=${code}>`,
    `[My book](https://example.com/results?code=${code})`,
  ]) {
    const params = submitEntry(input, { initialReaderName: 'Alex' });
    assert.equal(params.get('code'), code);
    assert.equal(params.has('name'), false, input);
  }
});

test('a bare-code correction still preserves the broken link reader name', () => {
  assert.equal(submitEntry(code, { initialReaderName: 'Alex' }).get('name'), 'Alex');
});

test('pasted personalized results replace the broken link reader name', () => {
  const input = `/results?${new URLSearchParams({ code, name: 'Sam' })}`;
  assert.equal(submitEntry(input, { initialReaderName: 'Alex' }).get('name'), 'Sam');
});


test('code recovery uses a multiline field so pasted chapter exports retain their line boundaries', () => {
  const entry = renderEntry('');
  const field = findElement(entry.form, node => node.type === 'textarea');
  assert.ok(field, 'single-line inputs strip newlines from pasted exports');
  assert.equal(field.props.rows, 2);
  const exportText = `Hyper Reality book code: ${code}\nReader name: Alex Dr.\n\nAnswer recap:\n1. Example answer`;
  field.props.onChange({ target: { value: exportText } });
  assert.deepEqual(entry.updates, [[1, exportText], [2, '']]);
  const params = submitEntry(entry.updates[0][1]);
  assert.equal(params.get('code'), code);
  assert.equal(params.get('name'), 'Alex Dr.');
});


test('empty Reader name lines do not consume the next export heading', () => {
  for (const newline of ['\n', '\r\n']) {
    for (const blankName of ['', '   ', '\t']) {
      const input = [`Hyper Reality book code: ${code}`, `Reader name:${blankName}`, '', 'Answer recap:', '1. Example answer'].join(newline);
      for (const initialReaderName of ['', 'Alex']) {
        const params = submitEntry(input, { initialReaderName });
        assert.equal(params.get('code'), code);
        assert.equal(params.has('name'), false, JSON.stringify(input));
      }
    }
  }
});


test('Enter opens a valid pasted code or export without inserting a newline', () => {
  for (const input of [code, `Hyper Reality book code: ${code}\nReader name: Alex`]) {
    const entry = renderEntry(input);
    const field = findElement(entry.form, node => node.type === 'textarea');
    let prevented = false;
    field.props.onKeyDown({ key: 'Enter', shiftKey: false, nativeEvent: { isComposing: false }, preventDefault() { prevented = true; } });
    assert.equal(prevented, true);
    assert.equal(entry.routes.length, 1);
    const params = new URL(entry.routes[0], 'https://example.com').searchParams;
    assert.equal(params.get('code'), code);
    assert.equal(params.get('name'), input === code ? null : 'Alex');
  }
});

test('Shift+Enter, composition confirmation, and other keys do not submit', () => {
  for (const event of [
    { key: 'Enter', shiftKey: true, nativeEvent: { isComposing: false } },
    { key: 'Enter', shiftKey: false, nativeEvent: { isComposing: true } },
    { key: 'a', shiftKey: false, nativeEvent: { isComposing: false } },
  ]) {
    const entry = renderEntry(code);
    const field = findElement(entry.form, node => node.type === 'textarea');
    field.props.onKeyDown({ ...event, preventDefault() { assert.fail('must preserve normal text entry'); } });
    assert.deepEqual(entry.routes, []);
  }
});

test('Enter on an invalid code shows validation instead of navigating', () => {
  const entry = renderEntry('not a code');
  const field = findElement(entry.form, node => node.type === 'textarea');
  field.props.onKeyDown({ key: 'Enter', shiftKey: false, nativeEvent: { isComposing: false }, preventDefault() {} });
  assert.deepEqual(entry.routes, []);
  assert.equal(entry.updates[0][0], 2);
  assert.match(entry.updates[0][1], /doesn't look right/);
});


test('hash results links preserve question marks in names and later code parameters', () => {
  for (const input of [
    `https://example.com/#/results?name=Who?%20Me?&code=${code}`,
    `https://example.com/#/results?code=${code}&name=Who?%20Me?`,
    `#/results?name=Who?%20Me?&code=${code}`,
  ]) {
    const params = submitEntry(input);
    assert.equal(params.get('code'), code);
    assert.equal(params.get('name'), 'Who? Me?');
  }
});

test('direct hash results parsing keeps complete query values and subsequent parameters', () => {
  const source = fs.readFileSync('src/app/results/page.tsx', 'utf8');
  const parser = source.match(/function getHashSearchParams\(\) \{[\s\S]*?\n\}/)[0];
  for (const hash of [
    `#/results?name=Who?%20Me?&code=${code}`,
    `#/results?code=${code}&name=Who?%20Me?`,
  ]) {
    const params = vm.runInNewContext(`${parser}; getHashSearchParams()`, {
      window: { location: { hash } }, URLSearchParams,
    });
    assert.equal(params.get('code'), code);
    assert.equal(params.get('name'), 'Who? Me?');
  }
  assert.equal(vm.runInNewContext(`${parser}; getHashSearchParams()`, {
    window: { location: { hash: '#/results' } }, URLSearchParams,
  }), null);
});
