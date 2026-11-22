const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function loadRemember(localStorage) {
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync('src/lib/last-result.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInNewContext(source, { module, exports: module.exports, localStorage });
  return module.exports.rememberLastResult;
}

test('a corrupt or unreadable previous book does not block saving a new book', () => {
  for (const getItem of [() => '{broken', () => { throw new Error('read blocked'); }]) {
    let saved;
    const remember = loadRemember({ getItem, setItem(key, value) { saved = { key, ...JSON.parse(value) }; } });
    remember('book-code', 'Alex');
    assert.equal(saved.key, 'hr-last-result');
    assert.equal(saved.code, 'book-code');
    assert.equal(saved.readerName, 'Alex');
    assert.ok(Number.isFinite(Date.parse(saved.updatedAt)));
  }
});

test('only the same book and reader keep their original valid saved date', () => {
  const originalDate = '2026-09-29T12:00:00.000Z';
  for (const [code, readerName, updatedAt, preserve] of [
    ['book-code', ' Alex ', originalDate, true],
    ['other-code', 'Alex', originalDate, false],
    ['book-code', 'Sam', originalDate, false],
    ['book-code', 'Alex', 'invalid', false],
    ['book-code', {}, originalDate, false],
  ]) {
    let saved;
    const remember = loadRemember({
      getItem: () => JSON.stringify({ code, readerName, updatedAt }),
      setItem(key, value) { saved = JSON.parse(value); },
    });
    remember('book-code', 'Alex');
    assert.equal(saved.updatedAt === originalDate, preserve);
    assert.ok(Number.isFinite(Date.parse(saved.updatedAt)));
  }
});

test('unavailable or full local storage does not break results', () => {
  const remember = loadRemember({
    getItem() { throw new Error('blocked'); },
    setItem() { throw new Error('quota exceeded'); },
  });
  assert.doesNotThrow(() => remember('book-code', 'Alex'));
});
