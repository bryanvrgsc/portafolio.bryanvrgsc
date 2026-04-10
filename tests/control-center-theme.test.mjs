import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ModuleKind, ScriptTarget, transpileModule } from 'typescript';

const loadThemeModule = async () => {
  const source = readFileSync(new URL('../lib/tahoe-theme.ts', import.meta.url), 'utf8');
  const { outputText } = transpileModule(source, {
    compilerOptions: {
      module: ModuleKind.ESNext,
      target: ScriptTarget.ES2020,
    },
    fileName: 'tahoe-theme.ts',
  });

  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
};

test('cycles theme mode through system, dark, light, then back to system', async () => {
  const { getNextThemeMode } = await loadThemeModule();

  assert.equal(getNextThemeMode('system'), 'dark');
  assert.equal(getNextThemeMode('dark'), 'light');
  assert.equal(getNextThemeMode('light'), 'system');
});

test('resolves the effective appearance for explicit and system theme modes', async () => {
  const { resolveAppearanceForThemeMode } = await loadThemeModule();

  assert.equal(resolveAppearanceForThemeMode('dark', false), 'dark');
  assert.equal(resolveAppearanceForThemeMode('light', true), 'light');
  assert.equal(resolveAppearanceForThemeMode('system', true), 'dark');
  assert.equal(resolveAppearanceForThemeMode('system', false), 'light');
});

test('normalizes invalid persisted theme modes back to system', async () => {
  const { resolveStoredThemeMode, SYSTEM_THEME_MODE_STORAGE_KEY } = await loadThemeModule();

  assert.equal(SYSTEM_THEME_MODE_STORAGE_KEY, 'system_theme_mode');
  assert.equal(resolveStoredThemeMode('dark'), 'dark');
  assert.equal(resolveStoredThemeMode('light'), 'light');
  assert.equal(resolveStoredThemeMode('system'), 'system');
  assert.equal(resolveStoredThemeMode('sepia'), 'system');
  assert.equal(resolveStoredThemeMode(null), 'system');
});
