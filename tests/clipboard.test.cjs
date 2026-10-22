const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function setup({ clipboard, copyResult = true, copyError, connected = true } = {}) {
  const events = [];
  class HTMLElement {
    isConnected = connected;
    focus(options) { events.push(['restore', options?.preventScroll]); }
  }
  const textarea = {
    style: {},
    setAttribute() {},
    focus() { events.push('focus textarea'); },
    select() { events.push('select'); },
  };
  const document = {
    activeElement: new HTMLElement(),
    createElement: () => textarea,
    body: {
      appendChild() { events.push('append'); },
      removeChild() { events.push('remove'); },
    },
    execCommand(command) {
      events.push([command, textarea.value]);
      if (copyError) throw copyError;
      return copyResult;
    },
  };
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync('src/lib/clipboard.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInNewContext(source, { module, exports: module.exports, document, navigator: { clipboard }, HTMLElement });
  return { copy: module.exports.copyTextToClipboard, events };
}

test('fallback copies exact text, removes its field, and restores focus without scrolling', async () => {
  const { copy, events } = setup();
  await copy('Book code\nResults link');
  assert.deepEqual(events, ['append', 'focus textarea', 'select', ['copy', 'Book code\nResults link'], 'remove', ['restore', true]]);
});

test('rejected clipboard permission uses the same focus-preserving fallback', async () => {
  const { copy, events } = setup({ clipboard: { writeText: async () => { throw new Error('blocked'); } } });
  await copy('code');
  assert.deepEqual(events.slice(-2), ['remove', ['restore', true]]);
});

test('failed copy still cleans up and restores focus while reporting failure', async () => {
  for (const options of [{ copyResult: false }, { copyError: new Error('unsupported') }]) {
    const { copy, events } = setup(options);
    await assert.rejects(copy('code'));
    assert.deepEqual(events.slice(-2), ['remove', ['restore', true]]);
  }
});

test('native clipboard success leaves focus and DOM untouched', async () => {
  let copied;
  const { copy, events } = setup({ clipboard: { writeText: async (text) => { copied = text; } } });
  await copy('code');
  assert.equal(copied, 'code');
  assert.deepEqual(events, []);
});

test('a control removed during copy is not refocused', async () => {
  const { copy, events } = setup({ connected: false });
  await copy('code');
  assert.equal(events.at(-1), 'remove');
});
