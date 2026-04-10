import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ModuleKind, ScriptTarget, transpileModule } from 'typescript';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const loadThemeModule = async () => {
  const source = read('lib/tahoe-theme.ts');
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

test('system context exposes theme mode controls and persisted storage key usage', () => {
  const systemContext = read('context/SystemContext.tsx');

  assert.match(systemContext, /themeMode: ThemeMode/);
  assert.match(systemContext, /setThemeMode: \(value: ThemeMode\) => void/);
  assert.match(systemContext, /cycleThemeMode: \(\) => void/);
  assert.match(systemContext, /SYSTEM_THEME_MODE_STORAGE_KEY/);
  assert.match(systemContext, /resolveAppearanceForThemeMode/);
  assert.match(systemContext, /getNextThemeMode/);
  assert.match(systemContext, /useEffect\(\(\) => \{\s*if \(typeof window !== 'undefined'\) \{\s*localStorage\.setItem\(SYSTEM_THEME_MODE_STORAGE_KEY, themeMode\);/s);
  assert.match(systemContext, /const setThemeMode = useCallback\(\(value: ThemeMode\) => \{\s*setThemeModeState\(value\);\s*\}, \[\]\);/s);
  assert.match(systemContext, /const cycleThemeMode = useCallback\(\(\) => \{\s*setThemeModeState\(\(currentMode\) => getNextThemeMode\(currentMode\)\);\s*\}, \[\]\);/s);
});

test('desktop continues to consume the effective appearance from system context', () => {
  const desktop = read('components/Desktop.tsx');

  assert.match(desktop, /const\s+\{[\s\S]*\bappearance\b[\s\S]*\}\s*=\s*useSystem\(\);/);
  assert.match(desktop, /data-appearance=\{appearance\}/);
});
