# Tahoe Window Fidelity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Finder, Safari, Notes, and Terminal so they feel substantially closer to macOS Tahoe, while preserving their current functionality and fixing theme contrast in both `light` and `dark`.

**Architecture:** Start by locking the shared Tahoe expectations in regression tests, then add a small reusable Tahoe chrome layer in `app/globals.css` for control clusters, search fields, sidebar rows, content cards, and Terminal shell accents. Apply that shared chrome model window-by-window in Finder, Safari, Notes, and Terminal, then finish with full verification and targeted cleanup of dark-only utility classes in the edited chrome regions.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS 4 utilities, CSS variables in `app/globals.css`, Node test runner (`tests/control-center-theme.test.mjs`), ESLint, Next build.

---

## File Map

### Shared styling and regression coverage

- Modify: `app/globals.css`
  - Add Tahoe window-fidelity utility classes and any missing adaptive surface tokens needed by Finder, Safari, Notes, and Terminal.
- Modify: `tests/control-center-theme.test.mjs`
  - Add source-level regression tests that lock the new Tahoe chrome utilities and the four window-level integrations.

### Window implementations

- Modify: `components/FinderApp.tsx`
  - Rebuild toolbar, secondary path bar, sidebar, workspace states, breadcrumb strip, and storage status bar with Tahoe-first chrome.
- Modify: `components/BrowserApp.tsx`
  - Normalize Safari header, tab strip, sidebar, overview overlays, reader-mode shell, and embedded content-state surfaces.
- Modify: `components/NotesApp.tsx`
  - Rework toolbar and document body into a Notes-like editorial layout with Tahoe-adaptive materials.
- Modify: `components/TerminalApp.tsx`
  - Replace fixed prompt chrome and hardcoded terminal text colors with Tahoe-adaptive terminal surfaces.

## Shared Class and Token Contract

Use these exact utility names to keep the test plan and implementation aligned:

- `.tahoe-control-cluster`
- `.tahoe-control-button`
- `.tahoe-control-button[data-active="true"]`
- `.tahoe-search-field`
- `.tahoe-sidebar-section-title`
- `.tahoe-sidebar-row`
- `.tahoe-sidebar-row[data-active="true"]`
- `.tahoe-content-card`
- `.tahoe-status-separator`
- `.tahoe-terminal-shell`
- `.tahoe-terminal-input`
- `.tahoe-terminal-badge`

Use these exact CSS variable names if new variables are needed:

- `--tahoe-control-surface`
- `--tahoe-control-surface-hover`
- `--tahoe-content-card-surface`
- `--tahoe-terminal-surface`
- `--tahoe-terminal-border`

### Task 1: Lock Tahoe Chrome Expectations in Regression Tests

**Files:**
- Modify: `tests/control-center-theme.test.mjs`
- Test: `tests/control-center-theme.test.mjs`

- [ ] **Step 1: Write the failing regression tests for the shared Tahoe chrome contract**

Add these test blocks near the existing Tahoe theme assertions:

```js
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
  assert.match(notes, /var\\(--tahoe-text-secondary\\)/);
  assert.match(notes, /var\\(--tahoe-text-tertiary\\)/);
});

test('terminal consumes Tahoe terminal shell utilities and tokenized input colors', () => {
  const terminal = read('components/TerminalApp.tsx');

  assert.match(terminal, /tahoe-terminal-shell/);
  assert.match(terminal, /tahoe-terminal-input/);
  assert.match(terminal, /tahoe-terminal-badge/);
  assert.match(terminal, /var\\(--tahoe-text-primary\\)/);
});
```

- [ ] **Step 2: Run the tests to verify the new expectations fail**

Run: `node --test tests/control-center-theme.test.mjs`

Expected: FAIL with assertion errors mentioning missing `.tahoe-control-cluster`, `.tahoe-terminal-shell`, and missing Tahoe chrome usage in Finder, Safari, Notes, or Terminal.

- [ ] **Step 3: Commit the red test change**

```bash
git add tests/control-center-theme.test.mjs
git commit -m "test(tahoe): lock window chrome regression coverage"
```

### Task 2: Add Shared Tahoe Chrome Utilities and Tokens

**Files:**
- Modify: `app/globals.css`
- Test: `tests/control-center-theme.test.mjs`

- [ ] **Step 1: Add the missing Tahoe chrome variables in both shell themes**

Insert these variables inside `.tahoe-shell { ... }`:

```css
  --tahoe-control-surface: rgba(255, 255, 255, 0.08);
  --tahoe-control-surface-hover: rgba(255, 255, 255, 0.14);
  --tahoe-content-card-surface: rgba(255, 255, 255, 0.07);
  --tahoe-terminal-surface: rgba(10, 13, 20, 0.92);
  --tahoe-terminal-border: rgba(255, 255, 255, 0.1);
```

Insert these overrides inside `.tahoe-shell[data-appearance="light"] { ... }`:

```css
  --tahoe-control-surface: rgba(255, 255, 255, 0.58);
  --tahoe-control-surface-hover: rgba(255, 255, 255, 0.76);
  --tahoe-content-card-surface: rgba(255, 255, 255, 0.72);
  --tahoe-terminal-surface: rgba(244, 247, 252, 0.94);
  --tahoe-terminal-border: rgba(120, 133, 162, 0.18);
```

- [ ] **Step 2: Add the shared Tahoe chrome utility classes**

Append these class definitions near the existing `.tahoe-app-*` helpers:

```css
.tahoe-control-cluster {
  background: var(--tahoe-control-surface);
  border: 1px solid var(--tahoe-stroke-soft);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.tahoe-control-button {
  color: var(--tahoe-text-secondary);
  transition: background 140ms ease, color 140ms ease, border-color 140ms ease;
}

.tahoe-control-button:hover {
  background: var(--tahoe-control-surface-hover);
  color: var(--tahoe-text-primary);
}

.tahoe-control-button[data-active="true"] {
  background: color-mix(in srgb, var(--tahoe-accent) 18%, var(--tahoe-control-surface));
  color: var(--tahoe-text-primary);
}

.tahoe-search-field {
  background: color-mix(in srgb, var(--tahoe-control-surface) 88%, transparent);
  border: 1px solid var(--tahoe-stroke-soft);
  color: var(--tahoe-text-primary);
}

.tahoe-search-field::placeholder {
  color: var(--tahoe-text-tertiary);
}

.tahoe-sidebar-section-title {
  color: var(--tahoe-text-tertiary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tahoe-sidebar-row {
  color: var(--tahoe-text-secondary);
  transition: background 140ms ease, color 140ms ease;
}

.tahoe-sidebar-row:hover {
  background: color-mix(in srgb, var(--tahoe-control-surface) 72%, transparent);
  color: var(--tahoe-text-primary);
}

.tahoe-sidebar-row[data-active="true"] {
  background: color-mix(in srgb, var(--tahoe-accent) 16%, var(--tahoe-control-surface));
  color: var(--tahoe-text-primary);
}

.tahoe-content-card {
  background: var(--tahoe-content-card-surface);
  border: 1px solid var(--tahoe-stroke-soft);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.tahoe-status-separator {
  color: var(--tahoe-text-tertiary);
}

.tahoe-terminal-shell {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 22%),
    var(--tahoe-terminal-surface);
  border: 1px solid var(--tahoe-terminal-border);
  color: var(--tahoe-text-primary);
}

.tahoe-terminal-input {
  color: var(--tahoe-text-primary);
  caret-color: var(--tahoe-text-primary);
}

.tahoe-terminal-badge {
  border: 1px solid var(--tahoe-stroke-soft);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
```

- [ ] **Step 3: Run the regression tests and verify the failure moves from CSS to component usage**

Run: `node --test tests/control-center-theme.test.mjs`

Expected: FAIL, but only because Finder, Safari, Notes, and Terminal do not yet consume the new Tahoe classes.

- [ ] **Step 4: Commit the shared chrome utilities**

```bash
git add app/globals.css tests/control-center-theme.test.mjs
git commit -m "feat(tahoe): add shared window chrome utilities"
```

### Task 3: Redesign Finder with Tahoe-First Chrome

**Files:**
- Modify: `components/FinderApp.tsx`
- Test: `tests/control-center-theme.test.mjs`

- [ ] **Step 1: Replace the toolbar control groups with Tahoe chrome clusters**

Update the integrated titlebar control section to use the new utility classes:

```tsx
<div className="flex items-center gap-3 md:gap-16 ml-2">
  <div className="tahoe-control-cluster flex gap-1 rounded-xl p-1 ml-0 md:ml-16">
    <button
      onPointerDown={(e) => e.stopPropagation()}
      onClick={goBack}
      disabled={historyIndex === 0}
      data-active={historyIndex > 0}
      className="tahoe-control-button rounded-lg p-1.5"
      aria-label="Retroceder"
    >
      <ChevronLeft size={18} />
    </button>
    <button
      onPointerDown={(e) => e.stopPropagation()}
      onClick={goForward}
      disabled={historyIndex === history.length - 1}
      data-active={historyIndex < history.length - 1}
      className="tahoe-control-button rounded-lg p-1.5"
      aria-label="Avanzar"
    >
      <ChevronRight size={18} />
    </button>
  </div>
  <span className="text-[13px] font-semibold" style={{ color: 'var(--tahoe-text-primary)' }}>
    {currentFolder.name}
  </span>
</div>
```

- [ ] **Step 2: Replace the view controls and search field with Tahoe utilities**

Update the right side of the toolbar like this:

```tsx
<div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
  <div className="tahoe-control-cluster hidden sm:flex items-center gap-1 rounded-xl p-1">
    <button className="tahoe-control-button rounded-lg px-2 py-1" data-active="true" aria-label="Vista cuadrícula">
      <LayoutGrid size={15} />
    </button>
    <button className="tahoe-control-button rounded-lg px-2 py-1" aria-label="Vista lista">
      <List size={15} />
    </button>
  </div>

  <button className="tahoe-control-button hidden md:block rounded-lg p-2" aria-label="Compartir">
    <Share size={18} />
  </button>

  <div className="relative ml-1">
    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--tahoe-text-tertiary)' }} />
    <input
      type="text"
      placeholder="Buscar"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="tahoe-search-field rounded-xl py-1.5 pl-8 pr-3 text-[12px] outline-none w-28 sm:w-36 focus:w-48 transition-all"
      aria-label="Buscar archivos"
    />
  </div>
</div>
```

- [ ] **Step 3: Rebuild the secondary path bar, sidebar rows, empty state, and status bars with Tahoe surfaces**

Apply the shared chrome language to the remaining Finder structure:

```tsx
<div className="tahoe-app-toolbar flex h-10 shrink-0 items-center px-4">
  <div className="tahoe-control-cluster flex h-8 flex-1 items-center justify-center rounded-xl px-3">
    <span className="text-[11px] font-medium" style={{ color: 'var(--tahoe-text-secondary)' }}>
      {currentFolder.name}
    </span>
    <button
      onClick={handleCreateFolder}
      className="tahoe-control-button absolute right-5 rounded-lg p-1"
      aria-label="Nueva carpeta"
    >
      <Plus size={14} />
    </button>
  </div>
</div>

<div className="tahoe-app-sidebar hidden w-[220px] shrink-0 flex-col gap-4 overflow-y-auto border-r p-3 pt-4 md:flex" style={{ borderColor: 'var(--tahoe-hairline)' }}>
  {!section.hideTitle && (
    <div className="tahoe-sidebar-section-title px-3 mb-1.5 text-[11px] font-semibold">{section.title}</div>
  )}
  <button
    className="tahoe-sidebar-row flex items-center justify-between rounded-[8px] px-3 py-1.5"
    data-active={currentFolder.id === item.id || (item.id === 'desktop' && currentFolder.id === null)}
  >
```

Use these status-bar replacements:

```tsx
<div className="tahoe-app-statusbar flex h-7 shrink-0 items-center gap-2 overflow-hidden border-t px-4 text-[10px] font-medium" style={{ borderColor: 'var(--tahoe-hairline)', color: 'var(--tahoe-text-secondary)' }}>
  <span className="tahoe-status-separator hidden sm:inline">›</span>
</div>

<div className="tahoe-app-statusbar relative flex h-9 shrink-0 items-center justify-center border-t px-4" style={{ borderColor: 'var(--tahoe-hairline)' }}>
  <span className="text-[11.5px] font-medium tracking-tight truncate px-2" style={{ color: 'var(--tahoe-text-secondary)' }}>
    {currentFiles.length} elementos, 34.49 GB disponible(s)
  </span>
</div>
```

- [ ] **Step 4: Run the tests to verify Finder now satisfies the Tahoe regression assertions**

Run: `node --test tests/control-center-theme.test.mjs`

Expected: Finder-related assertions PASS. Safari, Notes, and Terminal assertions still FAIL.

- [ ] **Step 5: Commit the Finder redesign**

```bash
git add components/FinderApp.tsx tests/control-center-theme.test.mjs
git commit -m "feat(finder): redesign chrome for tahoe fidelity"
```

### Task 4: Redesign Safari Chrome and Normalize Special States

**Files:**
- Modify: `components/BrowserApp.tsx`
- Test: `tests/control-center-theme.test.mjs`

- [ ] **Step 1: Replace Safari header clusters and address bar with Tahoe utility classes**

Update the main Safari header clusters using this pattern:

```tsx
<div className="tahoe-control-cluster flex items-center rounded-xl p-1">
  <button
    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    data-active={isSidebarOpen}
    className="tahoe-control-button flex items-center gap-0.5 rounded-lg px-2 py-1"
    aria-label="Alternar barra lateral"
  >
    <PanelLeft size={16} />
    <ChevronDown size={10} className="mt-0.5" />
  </button>
</div>

<div className="tahoe-control-cluster flex items-center rounded-xl p-1">
  <button className="tahoe-control-button rounded-lg px-2 py-1" data-active={activeTab.historyIndex > 0} aria-label="Retroceder">
    <ChevronLeft size={16} />
  </button>
  <button className="tahoe-control-button rounded-lg px-2 py-1" data-active={activeTab.historyIndex < activeTab.history.length - 1} aria-label="Avanzar">
    <ChevronRight size={16} />
  </button>
</div>

<div className="flex-1 flex justify-center min-w-0 sm:min-w-[300px] px-2">
  <form onSubmit={handleSearch} className="w-full">
    <div className="tahoe-search-field flex h-[34px] items-center gap-3 rounded-xl px-3 shadow-inner">
      <AlignLeft size={16} className={isReaderMode ? 'text-orange-400' : ''} style={isReaderMode ? undefined : { color: 'var(--tahoe-text-tertiary)' }} />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="bg-transparent border-none outline-none w-full max-w-[220px] text-center"
        style={{ color: 'var(--tahoe-text-primary)' }}
        placeholder="Busca o introduce un sitio web"
        aria-label="Barra de direcciones"
      />
    </div>
  </form>
</div>
```

- [ ] **Step 2: Redesign Safari sidebar, tab strip, and tab overview cards using Tahoe surfaces**

Use these replacements in the sidebar and overview:

```tsx
<div className={`tahoe-app-sidebar overflow-hidden border-r transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-[220px]' : 'w-0'}`} style={{ borderColor: 'var(--tahoe-hairline)' }}>
  <div className="p-4 w-[220px]">
    <h3 className="tahoe-sidebar-section-title mb-4 text-xs font-semibold">Favoritos</h3>
    <button className="tahoe-sidebar-row flex w-full items-center gap-2 rounded-lg p-2 text-left">
      <span>📂</span> Portafolio
    </button>
  </div>
</div>

<div className={`absolute inset-0 rounded-lg transition-all duration-200 ${activeTabId === tab.id ? 'tahoe-content-card border shadow-[0_1px_3px_rgba(0,0,0,0.18)]' : 'hover:bg-white/5'}`} />

<div className="tahoe-content-card w-full h-full flex flex-col rounded-2xl overflow-hidden">
  <div className="h-10 flex items-center px-3 gap-2 border-t" style={{ borderColor: 'var(--tahoe-hairline)' }}>
    <span className="text-xs truncate font-medium" style={{ color: 'var(--tahoe-text-secondary)' }}>{tab.title}</span>
  </div>
</div>
```

- [ ] **Step 3: Normalize reader mode, blocked previews, and embedded content shells so light mode stays readable**

Replace the dark-only shells in the special content states with Tahoe-adaptive cards and tokenized text:

```tsx
<div style={{ fontSize: `${fontSize}%` }} className="h-full">
  {activeTab.view === 'profile' && (
    <div className="tahoe-app-panel h-full overflow-auto">
      <div className="mx-auto max-w-6xl p-6 md:p-8">
        <div className="tahoe-content-card rounded-[28px] p-6 md:p-8">
          <h2 className="text-[10px] font-bold uppercase tracking-[3px]" style={{ color: 'var(--tahoe-text-tertiary)' }}>
            Stack Tecnológico
          </h2>
        </div>
      </div>
    </div>
  )}
```

Also replace the hardcoded browser fallback shells:

```tsx
<div className="w-full h-full flex flex-col tahoe-app-panel">
  <div className="p-3 md:p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--tahoe-hairline)' }}>
    <h3 className="font-semibold" style={{ color: 'var(--tahoe-text-primary)' }}>{activeTab.url.split('/')[0]}</h3>
    <p className="text-xs md:text-sm truncate max-w-[200px] sm:max-w-none" style={{ color: 'var(--tahoe-text-secondary)' }}>{activeTab.iframeSrc}</p>
  </div>
</div>
```

- [ ] **Step 4: Run the tests to verify Safari now satisfies the Tahoe regression assertions**

Run: `node --test tests/control-center-theme.test.mjs`

Expected: Safari-related assertions PASS. Notes and Terminal assertions still FAIL.

- [ ] **Step 5: Commit the Safari redesign**

```bash
git add components/BrowserApp.tsx tests/control-center-theme.test.mjs
git commit -m "feat(safari): redesign chrome for tahoe fidelity"
```

### Task 5: Redesign Notes as a Tahoe-Native Editorial Surface

**Files:**
- Modify: `components/NotesApp.tsx`
- Test: `tests/control-center-theme.test.mjs`

- [ ] **Step 1: Replace the toolbar styling with Tahoe control clusters**

Update the Notes toolbar to this pattern:

```tsx
<div className="tahoe-app-toolbar flex h-[52px] shrink-0 items-center justify-between px-4 cursor-grab active:cursor-grabbing" onPointerDown={(e) => dragControls?.start(e)}>
  <div className="ml-[72px] flex items-center">
    <span className="text-[14px] font-bold" style={{ color: 'var(--tahoe-text-primary)' }}>Mi Portafolio</span>
  </div>

  <div className="flex items-center gap-3">
    <div className="tahoe-control-cluster pointer-events-auto flex items-center rounded-[12px] p-[3px]" onPointerDown={(e) => e.stopPropagation()}>
      <button className="tahoe-control-button rounded-[8px] px-3 py-1 text-[14px] font-semibold" data-active="true" aria-label="Opciones de formato">
        Aa
      </button>
      <button className="tahoe-control-button rounded-[8px] p-1.5" aria-label="Lista de tareas">
        <ListChecks size={18} strokeWidth={2} />
      </button>
      <button className="tahoe-control-button rounded-[8px] p-1.5" aria-label="Insertar tabla">
        <TableIcon size={18} strokeWidth={2} />
      </button>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Convert the note body into a Notes-like document sheet with tokenized cards and copy**

Replace the body styling with Tahoe-adaptive text tokens and content cards:

```tsx
<div className="flex-1 overflow-y-auto px-8 pb-10 custom-scrollbar">
  <div className="mx-auto flex max-w-3xl flex-col items-center pt-6">
    <p className="mb-8 text-[12px] font-medium" style={{ color: 'var(--tahoe-text-tertiary)' }}>
      {currentDate}
    </p>

    <div className="w-full rounded-[28px] p-8 md:p-10" style={{ background: 'var(--tahoe-app-panel-surface)', border: '1px solid var(--tahoe-stroke-soft)' }}>
      <h1 className="text-[32px] font-extrabold tracking-tight leading-tight" style={{ color: 'var(--tahoe-text-primary)' }}>
        Bienvenido a Mi Portafolio
      </h1>
      <p className="text-xl font-medium" style={{ color: 'var(--tahoe-text-secondary)' }}>
        👋 ¡Hola! Gracias por visitar mi portafolio interactivo.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="tahoe-content-card rounded-2xl p-6 space-y-3">
          <h3 className="text-lg font-bold text-blue-500">🖥️ ¿Qué es esto?</h3>
          <p className="text-[14px] leading-relaxed font-medium" style={{ color: 'var(--tahoe-text-secondary)' }}>
            Este es un portafolio interactivo diseñado como una réplica funcional de macOS.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Replace the numbered feature bullets and footer copy with tokenized Notes styling**

Use this list-item pattern:

```tsx
<li className="flex items-start gap-4">
  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: 'var(--tahoe-control-surface)', color: 'var(--tahoe-text-tertiary)' }}>
    1
  </div>
  <p className="text-[15px] font-medium" style={{ color: 'var(--tahoe-text-secondary)' }}>
    <span style={{ color: 'var(--tahoe-text-primary)' }} className="font-bold">Finder:</span> Navega por mi sistema de archivos real.
  </p>
</li>
```

- [ ] **Step 4: Run the tests to verify Notes now satisfies the Tahoe regression assertions**

Run: `node --test tests/control-center-theme.test.mjs`

Expected: Notes-related assertions PASS. Terminal assertions still FAIL.

- [ ] **Step 5: Commit the Notes redesign**

```bash
git add components/NotesApp.tsx tests/control-center-theme.test.mjs
git commit -m "feat(notes): redesign editor surface for tahoe fidelity"
```

### Task 6: Redesign Terminal with Tahoe-Adaptive Prompt Chrome

**Files:**
- Modify: `components/TerminalApp.tsx`
- Test: `tests/control-center-theme.test.mjs`

- [ ] **Step 1: Replace the prompt badge colors with Tahoe terminal badge styling**

Update `LeftPrompt` and `RightPrompt` like this:

```tsx
const LeftPrompt = ({ path }: { path: string }) => (
  <div className="flex items-center font-bold text-[11px] h-6 select-none shrink-0">
    <div className="tahoe-terminal-badge px-2 h-full flex items-center rounded-l-md relative z-20" style={{ background: 'color-mix(in srgb, var(--tahoe-text-tertiary) 36%, transparent)', color: 'var(--tahoe-text-primary)' }}>
      <AppleLogo />
      <div className="absolute right-[-12px] top-0 h-0 w-0 border-y-[12px] border-y-transparent z-20" style={{ borderLeft: '12px solid color-mix(in srgb, var(--tahoe-text-tertiary) 36%, transparent)' }} />
    </div>
    <div className="tahoe-terminal-badge px-4 h-full flex items-center relative ml-[0px] z-10" style={{ background: 'color-mix(in srgb, var(--tahoe-accent) 60%, transparent)', color: 'var(--tahoe-text-primary)' }}>
      <Home size={12} className="mr-1" />
      <span>{path}</span>
    </div>
  </div>
);

const RightPrompt = ({ timestamp }: { timestamp?: string }) => (
  <div className="flex items-center font-bold text-[11px] h-6 select-none ml-auto shrink-0 gap-1 opacity-90">
    <div className="tahoe-terminal-badge px-2 h-full flex items-center rounded-l-full" style={{ background: 'color-mix(in srgb, #22c55e 18%, var(--tahoe-terminal-surface))', color: '#22c55e' }}>
      <Check size={12} />
    </div>
    <div className="tahoe-terminal-badge px-3 h-full flex items-center rounded-r-full -ml-1" style={{ background: 'color-mix(in srgb, var(--tahoe-control-surface) 92%, transparent)', color: 'var(--tahoe-text-primary)' }}>
      <span className="mr-1">{timestamp || getTime()}</span>
      <Clock size={12} />
    </div>
  </div>
);
```

- [ ] **Step 2: Convert the terminal shell and input to Tahoe terminal utilities**

Update the root and input classes:

```tsx
<div
  className="tahoe-terminal-shell h-full overflow-auto p-3 font-mono text-[13px] leading-normal selection:bg-white/20"
  style={{ fontFamily: \"MesloLGS NF, Menlo, Monaco, 'Courier New', monospace\" }}
  onClick={() => document.getElementById('term-input')?.focus()}
>
```

```tsx
<input
  id="term-input"
  autoFocus
  autoComplete="off"
  className="tahoe-terminal-input bg-transparent border-none outline-none w-full min-w-[10px]"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={handleKeyDown}
  aria-label="Entrada de terminal"
/>
```

- [ ] **Step 3: Replace hardcoded output colors in command rendering with token-aware colors**

Update the `ls` rendering and default text styles like this:

```tsx
response = (
  <div className="flex flex-wrap gap-x-4">
    {files.map(f => (
      <span
        key={f.id}
        className="font-bold"
        style={{ color: f.type === 'folder' ? 'var(--tahoe-accent)' : 'var(--tahoe-text-primary)' }}
      >
        {f.name}{f.type === 'folder' ? '/' : ''}
      </span>
    ))}
  </div>
);
```

Keep the rest of the history rendering on the terminal shell's inherited `var(--tahoe-text-primary)` color unless a command explicitly needs accent color.

- [ ] **Step 4: Run the tests to verify Terminal now satisfies the Tahoe regression assertions**

Run: `node --test tests/control-center-theme.test.mjs`

Expected: PASS, 0 failing tests.

- [ ] **Step 5: Commit the Terminal redesign**

```bash
git add components/TerminalApp.tsx tests/control-center-theme.test.mjs
git commit -m "feat(terminal): redesign shell for tahoe fidelity"
```

### Task 7: Final Verification and Contrast Cleanup

**Files:**
- Modify if needed: `components/FinderApp.tsx`
- Modify if needed: `components/BrowserApp.tsx`
- Modify if needed: `components/NotesApp.tsx`
- Modify if needed: `components/TerminalApp.tsx`
- Modify if needed: `app/globals.css`
- Test: `tests/control-center-theme.test.mjs`

- [ ] **Step 1: Search the edited windows for leftover dark-only chrome classes**

Run:

```bash
rg -n "text-white|bg-black/|bg-white/|border-white/|text-black|bg-\\[#|border-\\[#|text-\\[#" components/FinderApp.tsx components/BrowserApp.tsx components/NotesApp.tsx components/TerminalApp.tsx app/globals.css
```

Expected: only intentional content-specific cases remain. Any toolbar, sidebar, path bar, status bar, prompt shell, or theme-adaptive chrome leftovers should be removed.

- [ ] **Step 2: Run the Tahoe regression suite**

Run: `node --test tests/control-center-theme.test.mjs`

Expected:

```text
ℹ tests 18
ℹ pass 18
ℹ fail 0
```

The exact test count may differ if the suite grows, but failure count must be `0`.

- [ ] **Step 3: Run lint**

Run: `npm run lint`

Expected: exit code `0`. If warnings remain in untouched legacy areas, record them explicitly instead of silently ignoring them.

- [ ] **Step 4: Run production build**

Run: `npm run build`

Expected: Next build completes successfully with exit code `0`.

- [ ] **Step 5: Commit the final Tahoe fidelity pass**

```bash
git add app/globals.css components/FinderApp.tsx components/BrowserApp.tsx components/NotesApp.tsx components/TerminalApp.tsx tests/control-center-theme.test.mjs
git commit -m "feat(tahoe): raise window fidelity across core apps"
```

## Self-Review

### Spec coverage

- Shared Tahoe chrome language: covered by Task 2.
- Finder Tahoe-first redesign: covered by Task 3.
- Safari Tahoe-first redesign and special-state normalization: covered by Task 4.
- Notes editorial redesign: covered by Task 5.
- Terminal Tahoe-native shell redesign: covered by Task 6.
- Cross-window contrast verification and cleanup: covered by Task 7.

### Placeholder scan

- No `TODO`, `TBD`, or deferred placeholders are present in the task steps.
- Every code-change step contains concrete code snippets or concrete commands.
- Every verification step contains an explicit command and expected outcome.

### Type and naming consistency

- Shared class names are defined once in the contract section and reused consistently across tasks and tests.
- New CSS variable names are defined once and referenced consistently in Task 2 and later tasks.
- Component file names and test file names match the current repository structure.
