import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('formats menu bar date and time in Tahoe-style Spanish', async () => {
  const { formatMenuBarDateTime } = await import('../lib/menu-bar-time.mjs');

  const formatted = formatMenuBarDateTime(new Date('2026-04-10T01:39:36.000Z'), 'America/Mexico_City');

  assert.equal(formatted, 'Jue 9 de abr 7:39:36 p.m.');
});

test('computes right-edge resize geometry without exceeding viewport', async () => {
  const { computeResizeFrame } = await import('../lib/window-geometry.mjs');

  const frame = computeResizeFrame({
    handle: 'right',
    pointer: { x: 980, y: 0 },
    startPointer: { x: 800, y: 0 },
    startFrame: { width: 700, height: 500, top: 80, left: 120 },
    viewport: { width: 1280, height: 900, menuBarHeight: 32, dockSpace: 90, windowGap: 10, minWidth: 300, minHeight: 200 },
  });

  assert.deepEqual(frame, { width: 880, height: 500, top: 80, left: 120 });
});

test('computes top-left resize geometry while respecting menu bar bounds', async () => {
  const { computeResizeFrame } = await import('../lib/window-geometry.mjs');

  const frame = computeResizeFrame({
    handle: 'top-left',
    pointer: { x: 40, y: 10 },
    startPointer: { x: 100, y: 100 },
    startFrame: { width: 600, height: 420, top: 70, left: 100 },
    viewport: { width: 1280, height: 900, menuBarHeight: 32, dockSpace: 90, windowGap: 10, minWidth: 300, minHeight: 200 },
  });

  assert.deepEqual(frame, { width: 660, height: 448, top: 42, left: 40 });
});

test('computes maximized frame inside the menu bar and dock with symmetric gaps', async () => {
  const { getDockReserveSpace, getMaximizedFrame } = await import('../lib/window-geometry.mjs');

  assert.equal(getDockReserveSpace(800), 130);
  assert.equal(getDockReserveSpace(500), 110);

  const frame = getMaximizedFrame({
    width: 1280,
    height: 900,
    menuBarHeight: 32,
    dockSpace: getDockReserveSpace(1280),
    windowGap: 10,
  });

  assert.deepEqual(frame, {
    top: 42,
    left: 10,
    width: 1260,
    height: 718,
  });
});

test('viewport bounds reserve the menu bar height plus the shared gap at the top edge', async () => {
  const { getViewportBounds } = await import('../lib/window-geometry.mjs');

  const bounds = getViewportBounds({
    width: 1280,
    height: 900,
    menuBarHeight: 32,
    dockSpace: 90,
    windowGap: 10,
  });

  assert.equal(bounds.minTop, 42);
  assert.equal(bounds.maxTop(500), 300);
});

test('window hot path uses requestAnimationFrame for interaction updates', () => {
  const windowFile = read('components/Window.tsx');

  assert.match(windowFile, /requestAnimationFrame/);
  assert.match(windowFile, /data-interacting=/);
});

test('window maximize and top-snap preview use the shared maximized frame helper', () => {
  const windowFile = read('components/Window.tsx');

  assert.match(windowFile, /getMaximizedFrame/);
});
