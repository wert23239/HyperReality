const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function mountResults(options = {}) {
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
      window: { location: { hash: '', origin: 'https://example.com' }, setTimeout() {} },
      navigator: options.navigator ?? {}, DOMException,
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
        if (name === '@/lib/clipboard') return { copyTextToClipboard: options.copy ?? (async () => {}) };
        if (name === '@/lib/last-result') return {};
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
      return nodes(render()).filter(node => node.type === 'button' && node.props.children === label)[index].props.onClick();
    },
    button: label => nodes(render()).find(node => node.type === 'button' && node.props.children === label),
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


test('sharing stays busy until settlement and cancellation allows a clean retry', async () => {
  let rejectShare;
  let shareCalls = 0;
  let copies = 0;
  const results = mountResults({
    navigator: { share: () => {
      shareCalls++;
      return new Promise((resolve, reject) => { rejectShare = reject; });
    } },
    copy: async () => { copies++; },
  });
  const pending = results.click('Share results');
  assert.equal(results.button('Sharing…').props.disabled, true);
  assert.equal(results.button('Sharing…').props['aria-busy'], true);
  await results.click('Sharing…'); // Even a programmatic repeat must not share again.
  assert.equal(shareCalls, 1);
  rejectShare(new DOMException('Cancelled', 'AbortError'));
  await pending;
  assert.equal(copies, 0);
  assert.equal(results.button('Share results').props.disabled, false);

  const retry = results.click('Share results');
  assert.equal(shareCalls, 2);
  rejectShare(new Error('Share unavailable'));
  await retry;
  assert.equal(copies, 1);
  assert.equal(results.button('Copied share link').props.disabled, false);
});
