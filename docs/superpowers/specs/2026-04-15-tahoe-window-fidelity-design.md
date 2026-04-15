# Tahoe Window Fidelity Design

Date: 2026-04-15
Branch: `feat/control-center-theme`
Status: Approved for planning review

## Summary

This phase extends the Tahoe theme work beyond the Control Center and Profile window so the main app windows feel closer to macOS Tahoe itself. The target windows are Finder, Safari, Notes, and Terminal.

The user wants fidelity to Tahoe to take priority over preserving the current custom composition when there is a tradeoff. The redesign should keep the current feature set and content, but the chrome, layout density, contrast, and material hierarchy should move closer to a real Tahoe desktop app.

## Problem Statement

The current windows are already directionally close to macOS, but several panes still read as custom dark UI instead of Tahoe-native app chrome:

- `light mode` loses contrast because many surfaces and labels still rely on hardcoded `text-white`, `bg-black/*`, and `bg-white/*` classes rather than Tahoe theme tokens.
- left rails and sidebars are inconsistent: some are too opaque, some too dark, some too generic.
- right-hand content panes often inherit too much translucency, causing washed-out content in `light mode`.
- Finder, Safari, Notes, and Terminal do not yet share a consistent Tahoe material system for toolbar, sidebar, content, overlays, and status bars.
- some windows preserve legacy custom aesthetics that fight Tahoe fidelity, especially in Safari reader/profile subviews and Terminal prompt chrome.

## Goals

- Make Finder, Safari, Notes, and Terminal feel substantially closer to macOS Tahoe.
- Keep left-side navigation panes more translucent and glass-like than the main content area.
- Keep the main content area more solid and readable in both `light` and `dark`.
- Replace hardcoded light/dark utility colors with Tahoe tokens wherever the UI needs to adapt by theme.
- Preserve each window's existing functionality while improving visual hierarchy and material realism.
- Establish a reusable Tahoe app-chrome language across the four windows.

## Non-Goals

- Rebuild the desktop shell, menu bar, dock, or Control Center in this phase.
- Change user flows, file system behavior, navigation logic, or Terminal command behavior.
- Add new applications or redesign unrelated windows.
- Fully refactor BrowserApp's internal product content model beyond what is needed for Tahoe fidelity.

## Design Principles

1. Tahoe fidelity wins over preserving custom legacy styling.
2. The sidebar should read as translucent glass; the content pane should read as firmer app material.
3. Text contrast must be correct in `light` and `dark` without app-specific hacks.
4. Repeated visual primitives should come from shared Tahoe tokens and patterns, not one-off color tweaks.
5. Each app should still feel like itself: Finder should feel like Finder, Safari like Safari, Notes like Notes, and Terminal like Terminal.

## Shared App Chrome Model

All four windows should align to the same Tahoe structure:

- `titlebar`: window title region stays light and restrained, with subtle separation from toolbar/content.
- `toolbar`: compact controls with clearer density and tokenized chrome.
- `sidebar`: translucent, blurred, lower-contrast navigation material.
- `content panel`: more solid surface with stronger readability and reduced wallpaper bleed-through.
- `status/footer areas`: softer tertiary text, cleaner separators, lighter visual weight.
- `overlay/popup states`: elevated material distinct from base content but still tied to Tahoe tokens.

### Shared Token Direction

The implementation should continue using Tahoe tokens in `app/globals.css` and extend them only where needed. New or refined tokens should support:

- sidebar glass surface
- primary content surface
- toolbar control surface
- inset control fill
- active/selected row states
- secondary and tertiary text
- terminal-specific foreground/background accents

New app-specific styling should prefer inline references to Tahoe CSS variables or reusable Tahoe utility classes over hardcoded `text-white`, `bg-black/*`, or `bg-white/*`.

## App-by-App Design

### Finder

#### Current issues

- Toolbar controls still use dark-biased hardcoded fills and labels.
- Sidebar selections and icon colors are not yet Tahoe-native enough.
- The center breadcrumb capsule and lower status bar feel custom rather than Finder-like.
- The content area and file selection states need better `light mode` contrast.

#### Target design

- Toolbar becomes more native and compact, with grouped navigation, view controls, search, and actions using Tahoe surfaces.
- Sidebar keeps a translucent Tahoe rail with stronger section hierarchy and more Finder-like selection treatment.
- Content area becomes a cleaner, more solid pane to improve list/grid readability.
- Empty states and file cards use tokenized contrast and less pure white text.
- Lower status bar becomes more Finder-like with subtle separators and a more believable storage bar.

#### Behavioral expectations

- Existing Finder navigation, file opening, and context menus remain unchanged.
- Selection visibility improves in both themes without changing selection semantics.

### Safari

#### Current issues

- The unified toolbar is close, but still leans on repeated hardcoded white overlays.
- Sidebar and tab strip need better Tahoe hierarchy.
- Reader mode and alternate content states are visually inconsistent in `light mode`.
- Preview overlays, tab overview, blocked states, and embedded profile/experience/project content are stylistically fragmented.

#### Target design

- Safari chrome becomes more native with better grouped control proportions and adaptive text/icon contrast.
- Sidebar remains more translucent than the main browsing surface.
- Main browsing area gains stronger, cleaner panel surfaces in `light mode`.
- Tab strip, overview overlays, and fallback states use Tahoe materials consistently.
- Reader mode should feel editorial and readable instead of simply switching to a flat white background.
- Internal portfolio sections shown inside Safari should be visually normalized so they do not clash with the Tahoe shell.

#### Behavioral expectations

- Existing browser navigation, tabs, tab overview, and content switching remain unchanged.
- Reader mode still works, but with more faithful Tahoe presentation.

### Notes

#### Current issues

- The window still relies heavily on `text-white/*` and dark translucent cards.
- The note body reads like a custom landing page inside a glass shell, not like Apple Notes.
- Toolbar density and control treatment are too dark and too custom in `light mode`.

#### Target design

- Notes should feel like a document sheet with editorial spacing and stronger paper-like readability.
- Toolbar becomes lighter, tighter, and more Tahoe-native.
- Supporting cards and list items should still have structure, but with softer panel treatment.
- In `light mode`, the note body should look intentional and readable, not washed out or over-translucent.

#### Behavioral expectations

- The existing content and note framing stay intact.
- The redesign changes presentation and structure, not the underlying note content.

### Terminal

#### Current issues

- Prompt blocks use fixed custom colors that do not adapt well to theme changes.
- Terminal foreground/background contrast is not yet balanced across `light` and `dark`.
- Input line and command output still rely on hardcoded white text.

#### Target design

- Terminal should remain distinct from the other apps, but still feel like a Tahoe-native Terminal window.
- Prompt chrome should be cleaner and more integrated with Tahoe surfaces.
- Output colors should stay semantically readable while adapting to theme.
- The content background should remain terminal-like, but it must not collapse into a flat or blinding surface in `light mode`.

#### Behavioral expectations

- Command handling, history, tab completion, file opening, and folder opening remain unchanged.

## Implementation Approach

The work should be executed in this order:

1. Refine shared Tahoe app tokens and utility classes only where needed for the four windows.
2. Redesign Finder to establish the final Tahoe chrome language for structured app navigation.
3. Redesign Safari using the same chrome language, then normalize its special content states.
4. Redesign Notes around a Tahoe-native editorial document surface.
5. Redesign Terminal last, because it needs its own specialized palette on top of the shared chrome model.
6. Run cross-window visual cleanup to ensure the four apps feel like one OS family.

## Testing Strategy

### Automated

Add or extend source-level regression tests to verify that:

- Finder, Safari, Notes, and Terminal consume Tahoe adaptive surface classes or tokenized styles.
- critical hardcoded dark-only patterns are removed from the key chrome regions of those components.
- any new shared Tahoe utility classes or tokens are present in `app/globals.css`.

### Manual

Verify each target window in:

- `system` appearance while the OS/browser prefers dark
- `system` appearance while the OS/browser prefers light
- explicit `dark`
- explicit `light`

For each app, verify:

- sidebar translucency vs content solidity
- text legibility
- toolbar control contrast
- selected row/tab/item visibility
- overlay, panel, or empty-state readability

## Risks and Mitigations

- Large TSX files may become harder to maintain.
  Mitigation: prefer extracting small styling helpers or shared class patterns where it reduces repetition.

- Safari contains multiple sub-experiences that may drift visually.
  Mitigation: normalize Safari shell and special states under the same material rules before polishing inner content.

- Terminal may lose personality if over-normalized.
  Mitigation: keep Terminal distinct, but adapt its palette through Tahoe tokens instead of custom fixed colors.

- Incremental edits may leave old hardcoded classes behind.
  Mitigation: use regression tests plus targeted code search for theme-hostile classes in each edited window.

## Acceptance Criteria

This phase is complete when:

- Finder, Safari, Notes, and Terminal all look noticeably closer to macOS Tahoe.
- `light mode` no longer washes out the main readable surfaces in those windows.
- sidebars are visually more translucent than their content panels across the four apps.
- the four apps feel visually related through a shared Tahoe chrome system.
- automated tests, lint, and build all pass, with any remaining warnings called out explicitly.
