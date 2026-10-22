const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function mountResults() {
  const slots = [];
  const routes = [];
  const writes = [];
  let cursor = 0;
  let blocked = true;
  const jsx = (type, props) => ({ type, props });
  function load(file) {
    const module = { exports: {} };
    const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    vm.runInNewContext(source, {
      module, exports: module.exports, URLSearchParams,
      window: { location: { hash: '' } },
      sessionStorage: {
        setItem(key, value) {
          if (blocked) throw new Error('storage blocked or full');
          writes.push({ key, value: JSON.parse(value) });
        },
      },
      require(name) {
        if (name === 'react') return {
          useState(initial) {
            const i = cursor++;
            if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial;
            return [slots[i], value => { slots[i] = value; }];
          },
          useEffect() {},
          Suspense: 'suspense',
        };
        if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
        if (name === 'next/navigation') return {
          useRouter: () => ({ push: url => routes.push(url) }),
          useSearchParams: () => new URLSearchParams({ code: '1A-2B-3C-4-5-6A-7B-8C-9A-10B-11' }),
        };
        if (name === '@/lib/chapters') return load('src/lib/chapters.ts');
        if (name === '@/lib/questions') return load('src/lib/questions.ts');
        if (name === '@/lib/last-result' || name === '@/lib/clipboard') return {};
        if (name === 'next/link' || name === '@/components/CodeEntry') return { default: 'stub' };
        throw new Error(name);
      },
    });
    return module.exports;
  }
  const Results = load('src/app/results/page.tsx').default;
  function render() {
    cursor = 0;
    const wrapper = Results();
    return wrapper.props.children.type();
  }
  function nodes(node) {
    if (!node || typeof node !== 'object') return [];
    return [node, ...[node.props?.children].flat(Infinity).flatMap(nodes)];
  }
  return {
    click(label, index = 0) {
      nodes(render()).filter(node => node.type === 'button' && node.props.children === label)[index].props.onClick();
    },
    alerts: () => nodes(render()).filter(node => node.props?.role === 'alert'),
    unblock: () => { blocked = false; },
    routes, writes,
  };
}

test('failed revisions stay on the book and announce an actionable error; retry preserves answers', () => {
  for (const [label, index, current, focused] of [
    ['Revise answers', 0, 0, false],
    ['Edit this answer', 3, 3, true],
  ]) {
    const results = mountResults();
    assert.doesNotThrow(() => results.click(label, index));
    assert.equal(results.routes.length, 0);
    assert.equal(results.writes.length, 0);
    assert.equal(results.alerts().length, 1);
    assert.match(String(results.alerts()[0].props.children), /browser storage/);

    results.unblock();
    results.click(label, index);
    assert.deepEqual(results.routes, ['/survey']);
    assert.equal(results.alerts().length, 0);
    assert.equal(results.writes[0].key, 'hr-survey');
    assert.equal(results.writes[0].value.current, current);
    assert.equal(results.writes[0].value.returnToResultsAfterEdit, focused);
    assert.deepEqual(results.writes[0].value.answers, { 0: 'A', 1: 'B', 2: 'C', 3: 'A', 4: 'B', 5: 'C', 6: 'A', 7: 'B' });
  }
});
