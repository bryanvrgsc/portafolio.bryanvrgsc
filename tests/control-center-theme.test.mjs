import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { JsxEmit, ModuleKind, ScriptTarget, transpileModule } from 'typescript';

const { act } = React;
const require = createRequire(import.meta.url);

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const temporaryModuleDirs = [];

process.on('exit', () => {
  for (const directory of temporaryModuleDirs) {
    rmSync(directory, { recursive: true, force: true });
  }
});

const toDataModuleUrl = (source, fileName, extraCompilerOptions = {}) => {
  const { outputText } = transpileModule(source, {
    compilerOptions: {
      module: ModuleKind.ESNext,
      target: ScriptTarget.ES2020,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      ...extraCompilerOptions,
    },
    fileName,
  });

  return `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
};

const loadThemeModule = async () => {
  const source = read('lib/tahoe-theme.ts');
  return import(toDataModuleUrl(source, 'tahoe-theme.ts'));
};

const loadSystemContextModule = async () => {
  const directory = mkdtempSync(join(tmpdir(), 'system-context-test-'));
  temporaryModuleDirs.push(directory);

  const themePath = join(directory, 'tahoe-theme.mjs');
  const systemPath = join(directory, 'SystemContext.mjs');
  const reactModuleUrl = pathToFileURL(require.resolve('react')).href;

  writeFileSync(
    themePath,
    transpileModule(read('lib/tahoe-theme.ts'), {
      compilerOptions: {
        module: ModuleKind.ESNext,
        target: ScriptTarget.ES2020,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
      fileName: 'tahoe-theme.ts',
    }).outputText
  );
  writeFileSync(
    systemPath,
    transpileModule(read('context/SystemContext.tsx').replace(
      "from '@/lib/tahoe-theme';",
      "from './tahoe-theme.mjs';"
    ).replace(
      "from 'react';",
      `from ${JSON.stringify(reactModuleUrl)};`
    ), {
      compilerOptions: {
        module: ModuleKind.ESNext,
        target: ScriptTarget.ES2020,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        jsx: JsxEmit.React,
        jsxFactory: 'React.createElement',
      },
      fileName: 'SystemContext.tsx',
    }).outputText
  );

  return import(`${pathToFileURL(systemPath).href}?t=${Date.now()}`);
};

const installDomGlobals = () => {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: 'http://localhost',
  });
  const names = [
    'window',
    'document',
    'navigator',
    'HTMLElement',
    'Event',
    'CustomEvent',
    'Node',
    'localStorage',
    'matchMedia',
    'MutationObserver',
  ];
  const previousDescriptors = new Map();

  for (const name of names) {
    previousDescriptors.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, {
      configurable: true,
      writable: true,
      value: dom.window[name],
    });
  }

  const previousActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;

  return {
    dom,
    restore() {
      for (const name of names) {
        const descriptor = previousDescriptors.get(name);
        if (descriptor) {
          Object.defineProperty(globalThis, name, descriptor);
        } else {
          delete globalThis[name];
        }
      }

      globalThis.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
      dom.window.close();
    },
  };
};

const createMatchMediaController = (initialMatches) => {
  let matches = initialMatches;
  const listeners = new Set();

  return {
    matchMedia: () => ({
      get matches() {
        return matches;
      },
      media: '(prefers-color-scheme: dark)',
      addEventListener: (type, listener) => {
        if (type === 'change') {
          listeners.add(listener);
        }
      },
      removeEventListener: (type, listener) => {
        if (type === 'change') {
          listeners.delete(listener);
        }
      },
    }),
    emitChange(nextMatches) {
      matches = nextMatches;
      const event = { matches: nextMatches };
      for (const listener of listeners) {
        listener(event);
      }
    },
  };
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

test('system provider restores theme mode, persists updates, and only follows system theme in system mode', async (t) => {
  const { dom, restore } = installDomGlobals();

  const matchMediaController = createMatchMediaController(false);
  dom.window.matchMedia = matchMediaController.matchMedia;
  globalThis.matchMedia = matchMediaController.matchMedia;
  dom.window.localStorage.setItem('system_theme_mode', 'dark');

  const { SystemProvider, useSystem } = await loadSystemContextModule();

  let latestSystem = null;

  const Probe = () => {
    const system = useSystem();

    React.useEffect(() => {
      latestSystem = system;
    }, [system]);

    return React.createElement('div', {
      id: 'probe',
      'data-theme-mode': system.themeMode,
      'data-appearance': system.appearance,
    });
  };

  const container = dom.window.document.getElementById('root');
  const root = createRoot(container);
  t.after(async () => {
    await act(async () => {
      root.unmount();
    });
    restore();
  });

  await act(async () => {
    root.render(React.createElement(SystemProvider, null, React.createElement(Probe)));
  });

  assert.equal(latestSystem?.themeMode, 'dark');
  assert.equal(latestSystem?.appearance, 'dark');
  assert.equal(dom.window.localStorage.getItem('system_theme_mode'), 'dark');

  await act(async () => {
    latestSystem.cycleThemeMode();
  });

  assert.equal(latestSystem?.themeMode, 'light');
  assert.equal(latestSystem?.appearance, 'light');
  assert.equal(dom.window.localStorage.getItem('system_theme_mode'), 'light');

  await act(async () => {
    latestSystem.cycleThemeMode();
  });

  assert.equal(latestSystem?.themeMode, 'system');
  assert.equal(latestSystem?.appearance, 'light');
  assert.equal(dom.window.localStorage.getItem('system_theme_mode'), 'system');

  await act(async () => {
    matchMediaController.emitChange(true);
  });

  assert.equal(latestSystem?.themeMode, 'system');
  assert.equal(latestSystem?.appearance, 'dark');

  await act(async () => {
    latestSystem.setThemeMode('light');
  });

  assert.equal(latestSystem?.themeMode, 'light');
  assert.equal(latestSystem?.appearance, 'light');
  assert.equal(dom.window.localStorage.getItem('system_theme_mode'), 'light');

  await act(async () => {
    matchMediaController.emitChange(false);
  });

  assert.equal(latestSystem?.themeMode, 'light');
  assert.equal(latestSystem?.appearance, 'light');
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

test('control center uses the theme quick control and Tahoe layout hooks', () => {
  const controlCenter = read('components/ControlCenter.tsx');

  assert.match(controlCenter, /const \{ themeMode, appearance, cycleThemeMode, brightness, setBrightness, volume, setVolume \} = useSystem\(\);/);
  assert.match(controlCenter, /control-center-toggle-card/);
  assert.match(controlCenter, /control-center-quick-button/);
  assert.match(controlCenter, /control-center-theme-button/);
  assert.match(controlCenter, /control-center-theme-status/);
  assert.match(controlCenter, /Cambiar tema\. Estado actual:/);
  assert.match(controlCenter, /Automático/);
  assert.match(controlCenter, /Oscuro/);
  assert.match(controlCenter, /Claro/);
});

test('control center uses symmetric layout hooks for the top grid and lower action cards', () => {
  const controlCenter = read('components/ControlCenter.tsx');

  assert.match(controlCenter, /control-center-top-grid/);
  assert.match(controlCenter, /control-center-utility-row/);
  assert.equal(controlCenter.match(/control-center-secondary-card/g)?.length ?? 0, 2);
});

test('globals define the quick control styles used by the Tahoe control center redesign', () => {
  const globals = read('app/globals.css');

  assert.match(globals, /\.control-center-toggle-card/);
  assert.match(globals, /\.control-center-quick-button/);
  assert.match(globals, /\.control-center-quick-button\[data-active="true"\]/);
  assert.match(globals, /\.control-center-theme-button\[data-mode="dark"\]/);
  assert.match(globals, /\.control-center-theme-button\[data-mode="light"\]/);
  assert.match(globals, /\.control-center-theme-status/);
  assert.match(globals, /\.control-center-top-grid/);
  assert.match(globals, /\.control-center-utility-row/);
  assert.match(globals, /\.control-center-secondary-card/);
});

test('globals define window-specific theme surface tokens that windows consume from the shell appearance', () => {
  const globals = read('app/globals.css');

  assert.match(globals, /--tahoe-window-surface:/);
  assert.match(globals, /--tahoe-window-inactive-surface:/);
  assert.match(globals, /--tahoe-window-content-surface:/);
  assert.match(globals, /--tahoe-window-titlebar-surface:/);
  assert.match(globals, /var\(--tahoe-window-surface\)/);
  assert.match(globals, /var\(--tahoe-window-inactive-surface\)/);
  assert.match(globals, /var\(--tahoe-window-content-surface\)/);
  assert.match(globals, /var\(--tahoe-window-titlebar-surface\)/);
});

test('globals define Tahoe chrome utilities for desktop app windows', () => {
  const globals = read('app/globals.css');

  assert.match(globals, /\.tahoe-control-cluster/);
  assert.match(globals, /\.tahoe-control-button/);
  assert.match(globals, /\.tahoe-search-field/);
  assert.match(globals, /\.tahoe-sidebar-section-title/);
  assert.match(globals, /\.tahoe-sidebar-row/);
  assert.match(globals, /\.tahoe-content-card/);
  assert.match(globals, /\.tahoe-terminal-shell/);
  assert.match(globals, /--tahoe-control-surface:/);
  assert.match(globals, /--tahoe-content-card-surface:/);
  assert.match(globals, /--tahoe-terminal-surface:/);
});

test('finder consumes Tahoe chrome utilities instead of dark-only shell styling', () => {
  const finder = read('components/FinderApp.tsx');

  assert.match(finder, /tahoe-control-cluster/);
  assert.match(finder, /tahoe-search-field/);
  assert.match(finder, /tahoe-sidebar-row/);
  assert.match(finder, /tahoe-content-card/);
});

test('safari consumes Tahoe chrome utilities across header sidebar and content states', () => {
  const safari = read('components/BrowserApp.tsx');

  assert.match(safari, /tahoe-control-cluster/);
  assert.match(safari, /tahoe-control-button/);
  assert.match(safari, /tahoe-search-field/);
  assert.match(safari, /tahoe-sidebar-row/);
  assert.match(safari, /tahoe-content-card/);
});

test('notes consumes Tahoe chrome utilities and tokenized copy colors', () => {
  const notes = read('components/NotesApp.tsx');

  assert.match(notes, /tahoe-control-cluster/);
  assert.match(notes, /tahoe-content-card/);
  assert.match(notes, /var\(--tahoe-text-secondary\)/);
  assert.match(notes, /var\(--tahoe-text-tertiary\)/);
});

test('terminal consumes Tahoe terminal shell utilities and tokenized input colors', () => {
  const terminal = read('components/TerminalApp.tsx');

  assert.match(terminal, /tahoe-terminal-shell/);
  assert.match(terminal, /tahoe-terminal-input/);
  assert.match(terminal, /tahoe-terminal-badge/);
  assert.match(terminal, /var\(--tahoe-text-primary\)/);
});

test('globals define adaptive app chrome surface classes for light-mode window content', () => {
  const globals = read('app/globals.css');

  assert.match(globals, /--tahoe-app-surface:/);
  assert.match(globals, /--tahoe-app-toolbar-surface:/);
  assert.match(globals, /--tahoe-app-panel-surface:/);
  assert.match(globals, /--tahoe-app-sidebar-surface:/);
  assert.match(globals, /--tahoe-app-overlay-surface:/);
  assert.match(globals, /--tahoe-app-statusbar-surface:/);
  assert.match(globals, /\.tahoe-app-surface/);
  assert.match(globals, /\.tahoe-app-toolbar/);
  assert.match(globals, /\.tahoe-app-panel/);
  assert.match(globals, /\.tahoe-app-sidebar/);
  assert.match(globals, /\.tahoe-app-overlay/);
  assert.match(globals, /\.tahoe-app-statusbar/);
});

test('desktop window apps consume the adaptive Tahoe app surface classes', () => {
  assert.match(read('components/BrowserApp.tsx'), /tahoe-app-surface/);
  assert.match(read('components/BrowserApp.tsx'), /tahoe-app-toolbar/);
  assert.match(read('components/FinderApp.tsx'), /tahoe-app-surface/);
  assert.match(read('components/FinderApp.tsx'), /tahoe-app-sidebar/);
  assert.match(read('components/NotesApp.tsx'), /tahoe-app-surface/);
  assert.match(read('components/TerminalApp.tsx'), /tahoe-app-surface/);
  assert.match(read('components/PreviewApp.tsx'), /tahoe-app-surface/);
  assert.match(read('components/AboutThisMac.tsx'), /tahoe-app-surface/);
});

test('profile app consumes Tahoe adaptive surfaces and tokenized copy colors', () => {
  const profileApp = read('components/ProfileApp.tsx');

  assert.match(profileApp, /tahoe-app-surface/);
  assert.match(profileApp, /tahoe-app-sidebar/);
  assert.match(profileApp, /tahoe-app-panel/);
  assert.match(profileApp, /var\(--tahoe-text-secondary\)/);
  assert.match(profileApp, /var\(--tahoe-text-tertiary\)/);
});
