const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

// Exercise the real component with a deterministic clock and browser history.
function mountSurvey(current = 1, reducedMotion = false) {
  const slots = [];
  const effects = [];
  const timers = new Map();
  const listeners = new Map();
  const pushes = [];
  const routes = [];
  let cursor = 0;
  let timerId = 0;
  const answers = Object.fromEntries(Array.from({ length: 8 }, (_, i) => [i, 'A']));
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial;
      return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }];
    },
    useRef(initial) {
      const i = cursor++;
      return slots[i] ??= { current: initial };
    },
    useCallback(fn) { return fn; },
    useEffect(fn) { effects.push(fn); },
  };
  const jsx = (type, props) => ({ type, props });
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync('src/app/survey/page.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(source, {
    module, exports: module.exports,
    require(name) {
      if (name === 'react') return react;
      if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
      if (name === 'next/navigation') return { useRouter: () => ({ push: url => routes.push(url) }) };
      if (name === '@/lib/questions') return { questions: Array.from({ length: 8 }, () => ({ text: 'Question', options: [{ value: 'A', label: 'A', text: 'Answer' }] })) };
      if (name === '@/lib/chapters') return { questionToSection: Array(8).fill(0) };
      throw new Error(name);
    },
    sessionStorage: {
      getItem: () => JSON.stringify({ current, answers }),
      setItem() {}, removeItem() {},
    },
    window: {
      history: { state: { surveyQ: current }, pushState: state => pushes.push(state), replaceState() {} },
      matchMedia: () => ({ matches: reducedMotion, addEventListener() {}, removeEventListener() {} }),
      addEventListener: (name, fn) => listeners.set(name, fn),
      removeEventListener: name => listeners.delete(name),
    },
    setTimeout: fn => { timers.set(++timerId, fn); return timerId; },
    clearTimeout: id => timers.delete(id),
    URLSearchParams,
  });
  let tree = module.exports.default();
  const cleanups = effects.splice(0).map(fn => fn()).filter(Boolean);
  // Render again after the media-query effect initializes reduced motion.
  cursor = 0;
  tree = module.exports.default();
  function findAnswer(node) {
    if (!node || typeof node !== 'object') return;
    if (node.props?.['aria-pressed'] !== undefined) return node;
    return [node.props?.children].flat(Infinity).map(findAnswer).find(Boolean);
  }
  return {
    answer: () => findAnswer(tree).props.onClick(),
    pop: state => listeners.get('popstate')({ state }),
    unmount: () => cleanups.forEach(fn => fn()),
    flush() {
      while (timers.size) {
        const [id, fn] = timers.entries().next().value;
        timers.delete(id);
        fn();
      }
    },
    pushes, routes, slots,
  };
}

test('browser Back cancels a pending answer instead of pushing forward again', () => {
  for (const destination of [{ surveyQ: 0 }, null]) {
    const survey = mountSurvey();
    survey.answer();
    survey.pop(destination);
    survey.flush();
    assert.equal(survey.pushes.length, 0);
    assert.equal(survey.routes.length, 0);
    assert.equal(survey.slots[5], false); // animating
  }
});

test('leaving the last question cancels delayed results navigation', () => {
  const survey = mountSurvey(7);
  survey.answer();
  survey.unmount();
  survey.flush();
  assert.equal(survey.routes.length, 0);
});

test('ordinary and reduced-motion answers still advance', () => {
  for (const reducedMotion of [false, true]) {
    const survey = mountSurvey(1, reducedMotion);
    survey.answer();
    survey.flush();
    assert.equal(survey.pushes[0].surveyQ, 2);
  }
});
