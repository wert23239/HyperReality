const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

test('last book shortcut follows other tabs and removes its listener on unmount', () => {
  const effects = [];
  const listeners = new Map();
  let saved = JSON.stringify({ code: 'first', readerName: 'Alex' });
  let result;
  const localStorage = { getItem: () => saved };
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync('src/components/LastResultHint.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(source, {
    module, exports: module.exports, localStorage, URLSearchParams,
    window: {
      addEventListener: (name, fn) => listeners.set(name, fn),
      removeEventListener(name, fn) { if (listeners.get(name) === fn) listeners.delete(name); },
    },
    require(name) {
      if (name === 'react') return {
        useState: () => [null, value => { result = value; }],
        useEffect: fn => effects.push(fn),
      };
      if (name === '@/lib/chapters') return {
        normalizeBookCode: code => code,
        isValidBookCode: code => ['first', 'second'].includes(code),
        getVersionNumberFromCode: () => 1,
        questionToSection: Array(8),
      };
      if (name === 'next/link') return { default: 'link' };
      if (name === 'react/jsx-runtime') return { jsx: () => null, jsxs: () => null };
      throw new Error(name);
    },
  });
  module.exports.default();
  const cleanup = effects[0]();
  assert.equal(result.readerName, 'Alex');
  const notify = (key = 'hr-last-result', storageArea = localStorage) => listeners.get('storage')({ key, storageArea });

  saved = JSON.stringify({ code: 'second', readerName: 'Sam' });
  notify('unrelated-key');
  notify('hr-last-result', {}); // Ignore sessionStorage or other storage areas.
  assert.equal(result.code, 'first');
  notify();
  assert.equal(result.code, 'second');
  assert.equal(result.href, '/results?code=second&name=Sam');

  saved = null; // Reset or Hide in another tab.
  notify();
  assert.equal(result, null);
  saved = JSON.stringify({ code: 'first' });
  notify();
  assert.equal(result.code, 'first');
  saved = null;
  notify(null); // localStorage.clear().
  assert.equal(result, null);
  saved = '{broken';
  assert.doesNotThrow(() => notify());
  assert.equal(result, null);

  cleanup();
  assert.equal(listeners.size, 0);
});
