const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToString } = require('react-dom/server');

function loadPage(react, storage) {
  function load(file) {
    const module = { exports: {} };
    const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    vm.runInNewContext(source, {
      module, exports: module.exports, sessionStorage: storage,
      require(name) {
        if (name === 'react') return react;
        if (name === 'next/navigation') return { useRouter: () => ({ push() {} }) };
        if (name.startsWith('@/')) return load(`src/${name.slice(2)}.${name.includes('/components/') ? 'tsx' : 'ts'}`);
        return require(name);
      },
    });
    return module.exports;
  }
  return load('src/app/survey/page.tsx').default;
}

test('server and first browser render match without reading or overwriting saved progress', () => {
  let reads = 0;
  let writes = 0;
  const server = loadPage(React, undefined);
  const browser = loadPage(React, {
    getItem() {
      reads++;
      return JSON.stringify({ current: 4, answers: { 0: 'B', 1: 'C' }, readerName: 'Alex' });
    },
    setItem() { writes++; },
  });
  assert.equal(renderToString(React.createElement(browser)), renderToString(React.createElement(server)));
  assert.equal(reads, 0);
  assert.equal(writes, 0);
});

test('the saved survey is mounted only after hydration completes', () => {
  let mounted = false;
  let mountEffect;
  const page = loadPage({
    useState: () => [mounted, value => { mounted = value; }],
    useEffect: effect => { mountEffect = effect; },
  });
  const initial = page();
  assert.equal(initial.type, 'main');
  assert.equal(initial.props.children.props.role, 'status');
  mountEffect();
  const ready = page();
  assert.equal(typeof ready.type, 'function');
  assert.equal(ready.type.name, 'Survey');
});
