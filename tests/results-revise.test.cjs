const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function mountResults(options = {}) {
  const slots = [];
  const effects = [];
  const effectDeps = [];
  let effectCursor = 0;
  const location = { hash: options.hash ?? "", origin: "https://example.com" };
  let query = options.query ?? "code=1A-2B-3C-4-5-6A-7B-8C-9A-10B-11";
  const routes = [];
  const writes = [];
  const removals = [];
  const focusCalls = [];
  const chapterFocusCalls = [];
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
      document: { title: 'Hyper Reality' },
      setTimeout() {}, clearTimeout() {},
      window: { location, setTimeout() {}, addEventListener() {}, removeEventListener() {},
        matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) },
      navigator: options.navigator ?? {}, DOMException,
      localStorage: {
        removeItem(key) {
          removals.push(key);
          if (options.blockLocalRemoval) throw new Error('local storage blocked');
        },
      },
      sessionStorage: {
        removeItem(key) {
          removals.push(key);
          if (options.blockSessionRemoval) throw new Error('session storage blocked');
        },
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
          useRef(initial) {
            const i = cursor++;
            return slots[i] ??= { current: initial };
          },
          useEffect(fn, deps) {
            const i = effectCursor++;
            const previous = effectDeps[i];
            if (!previous || !deps || deps.some((value, index) => value !== previous[index])) {
              effects.push(() => { effectDeps[i] = deps; return fn(); });
            }
          },
          Suspense: 'suspense',
        };
        if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
        if (name === 'next/navigation') return {
          useRouter: () => ({ push: url => routes.push(url), replace: url => routes.push(url) }),
          useSearchParams: () => new URLSearchParams(query),
        };
        if (name === '@/lib/chapters') return load('src/lib/chapters.ts');
        if (name === '@/lib/questions') return load('src/lib/questions.ts');
        if (name === '@/lib/clipboard') return { copyTextToClipboard: options.copy ?? (async () => {}) };
        if (name === '@/lib/last-result') return { rememberLastResult() {} };
        if (name === 'next/link' || name === '@/components/CodeEntry') return { default: 'stub' };
        throw new Error(name);
      },
    });
    return module.exports;
  }
  const Results = load('src/app/results/page.tsx').default;
  function render() {
    cursor = 0;
    effectCursor = 0;
    effects.length = 0;
    const wrapper = Results();
    const tree = wrapper.props.children.type();
    const input = nodes(tree).find(node => node.props?.id === 'reader-name');
    if (input?.props.ref) input.props.ref.current = { focus: options => focusCalls.push(options) };
    const chapterList = nodes(tree).find(node => node.props?.['aria-label'] === 'Book chapters');
    if (chapterList?.props.ref) chapterList.props.ref.current = { focus: options => chapterFocusCalls.push(options) };
    return tree;
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
    changeName(value) {
      nodes(render()).find(node => node.props?.id === 'reader-name').props.onChange({ target: { value } });
    },
    nameValue: () => nodes(render()).find(node => node.props?.id === 'reader-name').props.value,
    nameHelp: () => nodes(render()).find(node => node.props?.id === 'reader-name-help').props.children,
    saveName() {
      nodes(render()).find(node => node.type === 'form').props.onSubmit({ preventDefault() {} });
    },
    runEffects() {
      render();
      effects.splice(0).forEach(fn => fn());
    },
    navigate(url) {
      const next = new URL(url, location.origin);
      location.hash = next.hash;
      query = next.search.slice(1);
    },
    chapterList: () => nodes(render()).find(node => node.props?.['aria-label'] === 'Book chapters'),
    routes, writes, removals, focusCalls, chapterFocusCalls,
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

for (const [label, options] of [
  ['available storage', {}],
  ['blocked session storage', { blockSessionRemoval: true }],
  ['blocked local storage', { blockLocalRemoval: true }],
  ['both storage areas blocked', { blockSessionRemoval: true, blockLocalRemoval: true }],
]) {
  test(`Start over attempts both resets and returns home with ${label}`, () => {
    const results = mountResults(options);
    assert.doesNotThrow(() => results.click('← Start over'));
    assert.deepEqual(results.removals, ['hr-survey', 'hr-last-result']);
    assert.deepEqual(results.routes, ['/']);
  });
}


test('clearing a cover-name draft returns focus to the editor after Clear disappears', () => {
  const results = mountResults();
  results.changeName('Alex');
  assert.ok(results.button('Clear'));
  results.click('Clear');
  assert.equal(results.nameValue(), '');
  assert.equal(results.button('Clear'), undefined);
  assert.equal(results.focusCalls.length, 1);
  assert.equal(results.focusCalls[0].preventScroll, true);
  assert.equal(new URL(results.routes[0], 'https://example.com').searchParams.has('name'), false);
});


test('canonicalizing a hash results link does not restore its removed reader name', () => {
  const code = '1A-2B-3C-4-5-6A-7B-8C-9A-10B-11';
  const results = mountResults({ query: '', hash: `#/results?code=${code}&name=Alex` });
  results.runEffects();
  assert.equal(new URL(results.routes[0], 'https://example.com').searchParams.get('name'), 'Alex');

  // Next replaces the URL through history without necessarily firing hashchange.
  results.navigate(results.routes[0]);
  results.runEffects();
  assert.equal(results.nameValue(), 'Alex');
  results.click('Clear');
  const clearedURL = results.routes.at(-1);
  assert.equal(new URL(clearedURL, 'https://example.com').searchParams.has('name'), false);
  results.navigate(clearedURL);
  results.runEffects();
  assert.equal(results.nameValue(), '');
  assert.equal(results.routes.at(-1), clearedURL);
});


test('cover-name drafts announce that sharing and downloads still use the saved name', () => {
  const results = mountResults();
  results.runEffects();
  results.changeName('Alex');
  assert.match(results.nameHelp(), /Unsaved name.*Save.*shared links, downloads, and printouts/);
  results.saveName();
  assert.match(results.nameHelp(), /^Name saved/);
  results.changeName('Sam');
  assert.match(results.nameHelp(), /^Unsaved name/);
  results.changeName(' Alex  ');
  assert.match(results.nameHelp(), /^Name saved/, 'normalization-equivalent edits are not unsaved changes');
  results.changeName('');
  assert.match(results.nameHelp(), /^Unsaved name/, 'deleting the input does not yet remove the saved cover name');
  results.click('Clear');
  assert.match(results.nameHelp(), /^Name removed/);
});


test('opening another book discards the previous book cover-name draft and feedback', () => {
  const results = mountResults();
  results.runEffects();
  results.changeName('Alex');
  results.saveName();
  results.navigate(results.routes.at(-1));
  results.runEffects();
  results.changeName('Unsaved old draft');
  results.runEffects();
  assert.equal(results.nameValue(), 'Unsaved old draft', 'ordinary renders preserve ongoing edits');

  results.navigate('/results?code=1B-2B-3C-4-5-6A-7B-8C-9A-10B-11&name=Alex');
  results.runEffects();
  assert.equal(results.nameValue(), 'Alex', 'a new book must start with its own saved URL name');
  assert.doesNotMatch(results.nameHelp(), /Unsaved|Name saved/, 'save feedback belongs to the previous book');
});


test('skipping the chapter reveal moves focus to the revealed chapter list', () => {
  const results = mountResults();
  results.click('Show all chapters now');
  assert.equal(results.button('Show all chapters now'), undefined, 'skip button disappears after revealing');
  assert.equal(results.chapterFocusCalls.length, 1, 'focus must not be lost with the removed button');
  assert.equal(results.chapterFocusCalls[0].preventScroll, true);
  const list = results.chapterList();
  assert.equal(list.props.tabIndex, -1, 'chapter region accepts programmatic focus without a tab stop');
  assert.ok(list.props.children.length > 0);
  for (const chapter of list.props.children) {
    assert.match(chapter.props.className, /opacity-100/);
  }
});


for (const label of ['Copy chapter list', 'Copy results link', 'Copy book code']) {
  test(`${label} does not report an old clipboard operation on a different book`, async () => {
    for (const fails of [false, true]) {
      let settle;
      const results = mountResults({ copy: () => new Promise((resolve, reject) => {
        settle = () => fails ? reject(new Error('denied')) : resolve();
      }) });
      results.runEffects();
      const pending = results.click(label);
      results.navigate('/results?code=1B-2B-3C-4-5-6A-7B-8C-9A-10B-11');
      results.runEffects();
      settle();
      await pending;
      assert.ok(results.button(label), 'new book retains its untouched copy control');
      assert.equal(results.alerts().length, 0, 'old clipboard failures must not appear on the new book');
    }
  });
}

test('changing personalization clears completed copy feedback', async () => {
  const results = mountResults();
  results.runEffects();
  await results.click('Copy results link');
  assert.ok(results.button('Copied results link'));
  results.navigate('/results?code=1A-2B-3C-4-5-6A-7B-8C-9A-10B-11&name=Alex');
  results.runEffects();
  assert.ok(results.button('Copy results link'));
});

test('an old failed native share cannot copy its link after book navigation', async () => {
  let rejectShare;
  let copies = 0;
  const results = mountResults({
    navigator: { share: () => new Promise((resolve, reject) => { rejectShare = reject; }) },
    copy: async () => { copies++; },
  });
  results.runEffects();
  const pending = results.click('Share results');
  results.navigate('/results?code=1B-2B-3C-4-5-6A-7B-8C-9A-10B-11');
  results.runEffects();
  rejectShare(new Error('share failed'));
  await pending;
  assert.equal(copies, 0, 'do not replace the clipboard with a book the reader left');
  assert.ok(results.button('Share results'));
});
