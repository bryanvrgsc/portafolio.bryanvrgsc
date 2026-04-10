# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
node --test tests/*.test.mjs  # Run the lightweight contract tests
```

The repo uses lightweight `node:test` contract tests under `tests/`. They cover shared UI behavior and shell regressions without a full browser test suite.

## Architecture

macOS desktop simulator portfolio built with Next.js 16 App Router, React 19, Tailwind CSS 4, and Framer Motion.

### Entry Point & Core Flow

`app/page.tsx` → renders `<Desktop>` which orchestrates the entire environment.

`Desktop.tsx` manages:
- Active windows, z-index ordering, minimize/maximize/close state
- App launcher (opens windowed apps or system overlays)
- Global keyboard shortcuts (Cmd+Space for Spotlight, Cmd+W to close)
- Deferred loading for app chrome and window contents via `next/dynamic`

### Component Categories

**System UI** (always visible):
- `MenuBar.tsx` — top bar with localized Spanish clock (`Jue 9 de abr 7:39:36 p.m.`), active app menu, status items
- `Dock.tsx` — bottom dock with minimization genie animations
- `ControlCenter.tsx` — brightness/volume panel
- `NotificationCenter.tsx` — notifications panel
- `Spotlight.tsx` — search overlay (Cmd+Space)
- `ContextMenu.tsx` — right-click menu

**Window System:**
- `Window.tsx` — HOC wrapping all apps; handles drag, resize, minimize, maximize, close, z-index
- `lib/window-geometry.mjs` — shared clamp/snap/resize math used by `Window.tsx`, including the shared maximized frame for the green button and top-edge snap preview
- `lib/menu-bar-time.mjs` — shared menu-bar date/time formatting

**Apps** (each opens in a `Window`):
- `BrowserApp.tsx` — Safari-like browser (~63KB, most complex component)
- `FinderApp.tsx` — file explorer using VFS
- `TerminalApp.tsx` — terminal emulator
- `ProfileApp.tsx` — portfolio/resume info
- `NotesApp.tsx` — notes editor
- `AboutThisMac.tsx` — system info modal
- `PreviewApp.tsx` — file preview

**Boot sequence:** `BootShell.tsx` — handles boot animation and lock screen

### State Management

`context/SystemContext.tsx` — appearance (auto light/dark), brightness, volume; persists brightness/volume to `localStorage`  
`context/FileSystemContext.tsx` — virtual file system (VFS); persists to `localStorage`

The VFS supports create/rename/delete with "protected" items that cannot be modified. Modify initial file structure in `FileSystemContext.tsx` (or `hooks/useFileSystem.ts` if extracted there).

### Styling Conventions

- Tailwind CSS 4 via `@tailwindcss/postcss` (no `tailwind.config.ts` — config lives in CSS/postcss)
- `lib/utils.ts` exports `cn()` = `clsx` + `tailwind-merge` — use for conditional class merging
- Tahoe shell tokens and shared materials live in `app/globals.css` (`.tahoe-*` classes and CSS variables)
- Prefer semantic Tahoe classes over one-off `bg-white/10`/blur recipes when touching shell chrome
- Language set to Spanish in `app/layout.tsx` (`lang="es"`)

### Window Performance Notes

- `Window.tsx` uses a `requestAnimationFrame`-driven hot path for resize updates; avoid reintroducing `setState` on every `pointermove`
- Dragging uses Framer Motion transforms, while resize commits geometry to React state only after the interaction ends
- Keep expensive window work out of drag/resize loops; commit final geometry after interaction ends
- If changing window interactions, re-run `tests/window-behavior.test.mjs`

### Image Configuration

`next.config.ts` allows remote images from `wikimedia.org` and `github.com`. Formats: AVIF, WebP.

### Key Patterns

- Functional components with TypeScript interfaces for all props
- Local state for component UI, Context for shared/persisted state
- Framer Motion for all animations (window open/close, dock effects, boot sequence)
- Lucide React for icons throughout
