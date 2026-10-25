const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const code = '1A-2B-3C-4-5-6A-7B-8C-9A-10B-11';

function submitEntry(input) {
  const routes = [];
  const module = { exports: {} };
  let stateIndex = 0;
  const source = ts.transpileModule(fs.readFileSync('src/components/CodeEntry.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const jsx = (type, props) => ({ type, props });
  vm.runInNewContext(source, {
    module, exports: module.exports, URL, URLSearchParams,
    require(name) {
      if (name === 'react') return {
        useId: () => 'code-entry',
        useState: initial => [[true, input, '', true][stateIndex++], () => {}],
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
