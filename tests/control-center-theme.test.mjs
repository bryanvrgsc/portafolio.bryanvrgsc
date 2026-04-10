import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('cycles theme mode through system, dark, light, then back to system', async () => {
  const { getNextThemeMode } = await import('../lib/tahoe-theme.ts');

  assert.equal(getNextThemeMode('system'), 'dark');
  assert.equal(getNextThemeMode('dark'), 'light');
  assert.equal(getNextThemeMode('light'), 'system');
});

test('resolves the effective appearance for explicit and system theme modes', async () => {
  const { resolveAppearanceForThemeMode } = await import('../lib/tahoe-theme.ts');

  assert.equal(resolveAppearanceForThemeMode('dark', false), 'dark');
  assert.equal(resolveAppearanceForThemeMode('light', true), 'light');
  assert.equal(resolveAppearanceForThemeMode('system', true), 'dark');
  assert.equal(resolveAppearanceForThemeMode('system', false), 'light');
});

test('normalizes invalid persisted theme modes back to system', async () => {
  const { resolveStoredThemeMode, SYSTEM_THEME_MODE_STORAGE_KEY } = await import('../lib/tahoe-theme.ts');

  assert.equal(SYSTEM_THEME_MODE_STORAGE_KEY, 'system_theme_mode');
  assert.equal(resolveStoredThemeMode('dark'), 'dark');
  assert.equal(resolveStoredThemeMode('light'), 'light');
  assert.equal(resolveStoredThemeMode('system'), 'system');
  assert.equal(resolveStoredThemeMode('sepia'), 'system');
  assert.equal(resolveStoredThemeMode(null), 'system');
});
