import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('globals define Tahoe appearance tokens and shell materials', () => {
  const globals = read('app/globals.css');

  assert.match(globals, /--tahoe-menubar-bg:/);
  assert.match(globals, /--tahoe-dock-bg:/);
  assert.match(globals, /--tahoe-window-bg:/);
  assert.match(globals, /\.tahoe-shell/);
  assert.match(globals, /\.tahoe-glass-panel/);
});

test('desktop root applies Tahoe appearance classes', () => {
  const desktop = read('components/Desktop.tsx');

  assert.match(desktop, /tahoe-shell/);
  assert.match(desktop, /data-appearance=/);
  assert.match(desktop, /tahoe-wallpaper/);
});

test('window, menu bar, dock, and spotlight use Tahoe shell classes', () => {
  const windowFile = read('components/Window.tsx');
  const menuBar = read('components/MenuBar.tsx');
  const dock = read('components/Dock.tsx');
  const spotlight = read('components/Spotlight.tsx');

  assert.match(windowFile, /tahoe-window/);
  assert.match(menuBar, /tahoe-menubar/);
  assert.match(dock, /tahoe-dock/);
  assert.match(spotlight, /tahoe-spotlight/);
});
