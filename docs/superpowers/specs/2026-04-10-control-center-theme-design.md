# Control Center Tahoe Theme Mode Design

## Summary

Redesign the macOS-style Control Center so it more closely matches the Tahoe visual language shown in the user references, and add a dedicated theme control that cycles through three modes: `system`, `dark`, and `light`.

The redesign keeps the current desktop shell architecture intact. `Desktop` continues to consume an effective `appearance` value for styling, while `SystemContext` becomes responsible for tracking the user-selected theme mode, deriving the effective appearance, and persisting the preference across reloads.

## Goals

- Make the Control Center layout feel closer to macOS Tahoe, especially in spacing, hierarchy, and control density.
- Add a theme control that looks like a native quick control rather than a settings form input.
- Support three theme states:
  - `system`: follows the operating system preference
  - `dark`: forces dark appearance
  - `light`: forces light appearance
- Show the current theme state inside the Control Center in a compact, readable way.
- Persist the selected theme mode across page reloads.
- Preserve the existing shell-level `data-appearance` contract so the rest of the UI keeps working without broad changes.

## Non-Goals

- Rebuild every quick control into a fully interactive system feature.
- Introduce a separate Settings flow for appearance management.
- Refactor unrelated desktop state or window management code.
- Add animation-heavy transitions beyond small interaction polish already consistent with the app.

## Current State

### Control Center

`components/ControlCenter.tsx` currently renders a simple two-column panel using a few generic Tahoe cards:

- Left column: stacked Wi-Fi, Bluetooth, AirDrop rows
- Right column: Concentration card and a brightness summary card
- Bottom: full-width brightness and volume sliders

The panel works functionally but does not yet resemble the denser Tahoe Control Center layout shown in the reference images.

### Theme Handling

`context/SystemContext.tsx` currently exposes:

- `appearance`
- `brightness`
- `setBrightness`
- `volume`
- `setVolume`

`appearance` is derived directly from `matchMedia('(prefers-color-scheme: dark)')`, which means the app follows the OS theme but does not support user override from inside the app.

`components/Desktop.tsx` applies the value to the shell root through `data-appearance={appearance}`, and `app/globals.css` uses that attribute to switch between dark and light Tahoe tokens.

## Proposed UX

### Layout Direction

The Control Center should be visually restructured to better match the reference:

- A stronger two-column top area with tighter, macOS-like card proportions
- Left column with three large capsule controls:
  - Wi-Fi
  - Bluetooth
  - AirDrop
- Right column with:
  - A larger media-style card on top
  - A row of smaller quick controls beneath it
- Full-width sliders for:
  - `Pantalla`
  - `Sonido`
- A lower area with large quick-action cards to preserve the visual balance of the reference design

### Theme Control

The theme control should appear as a compact round quick control in the utility row, visually aligned with the macOS-style reference.

Because the quick control itself should stay circular and compact, the readable state label should not be embedded inside the circle. Instead, the panel should render a small adjacent or immediately-below caption tied to that control cluster so the UI stays clean while still exposing the current mode.

Behavior:

- One click cycles the mode in this order:
  - `system -> dark -> light -> system`
- The control uses a computer/display icon to imply “appearance/display mode”
- The current state is reflected in nearby text within the panel:
  - `Automático`
  - `Oscuro`
  - `Claro`
- When in `system`, the secondary text should make it clear that the app is following the system appearance. If space allows cleanly, show the effective result as `Automático · Oscuro` or `Automático · Claro`

### Interaction Expectations

- The control should feel instant; clicking it updates the shell appearance immediately
- The panel should not close when the theme control is clicked
- The theme control should visually distinguish active override modes from the neutral system-following state
- The redesign should preserve existing brightness and volume interactions

## State Model

### New Theme Mode State

Extend `SystemContext` with a user-facing theme mode:

- `themeMode: 'system' | 'dark' | 'light'`

Retain the existing effective shell appearance:

- `appearance: 'dark' | 'light'`

`appearance` should be derived from `themeMode` like this:

- If `themeMode === 'dark'`, `appearance = 'dark'`
- If `themeMode === 'light'`, `appearance = 'light'`
- If `themeMode === 'system'`, `appearance` follows the OS media query

### Context API Additions

Add:

- `themeMode`
- `setThemeMode(mode)`
- `cycleThemeMode()`

This keeps the Control Center implementation simple and keeps theme logic centralized in the system layer.

## Persistence

Persist `themeMode` in `localStorage`.

Suggested key:

- `system_theme_mode`

Load behavior:

- On first visit, default to `system`
- On subsequent visits, restore the last selected mode if it is valid

Runtime sync behavior:

- Continue listening to `matchMedia('(prefers-color-scheme: dark)')`
- Only update the effective `appearance` from media query events while `themeMode === 'system'`
- If the user has explicitly chosen `dark` or `light`, ignore system theme changes until they cycle back to `system`

## Component Changes

### `context/SystemContext.tsx`

Responsibilities after the change:

- Store `themeMode`
- Persist `themeMode`
- Derive `appearance`
- Keep brightness and volume state as-is
- Expose a small, stable API for UI consumers

Implementation notes:

- Avoid spreading theme logic across multiple components
- Keep `appearance` as the value the rest of the app consumes so the shell contract stays stable

### `components/ControlCenter.tsx`

Responsibilities after the change:

- Render the redesigned Tahoe-style grid
- Read `themeMode`, `appearance`, and `cycleThemeMode()` from `useSystem()`
- Show the theme quick control in the utility row
- Show a compact text label next to or directly below that utility row cluster so the control remains visually close to the Tahoe reference while still surfacing the current mode
- Continue rendering brightness and sound sliders using the existing context values

Implementation notes:

- The theme control should be a button with clear `aria-label`
- The control’s visual styling should reuse Tahoe glass tokens already defined in `app/globals.css`
- The layout should rely on existing utility classes where possible, with only minimal new CSS if necessary

### `components/Desktop.tsx`

No structural change required.

It should continue to read:

- `appearance`

and apply:

- `data-appearance={appearance}`

This isolates the redesign to the system context and the control center.

### `app/globals.css`

Possible changes:

- Small additions for Control Center-specific quick-control styling if the current Tahoe card classes are not enough
- No redesign of the global shell token system

Styling changes should remain scoped and should not alter unrelated components such as Dock, Spotlight, or window chrome.

## Accessibility

- Theme control must be a semantic `button`
- Add an `aria-label` that describes both action and state, for example:
  - `Cambiar tema. Estado actual: Automático`
- Preserve keyboard accessibility by using native buttons and range inputs
- Ensure text labels remain legible in both dark and light appearances

## Testing Plan

### Manual

Validate:

1. The Control Center opens and visually resembles the Tahoe-inspired layout
2. Clicking the theme quick control cycles:
   - `system -> dark -> light -> system`
3. The displayed label updates correctly on each click
4. The shell appearance updates immediately across the desktop
5. In `system` mode, changing the OS/browser color scheme updates the shell appearance
6. In `dark` or `light` mode, OS/browser color scheme changes do not override the explicit selection
7. Reloading the app preserves the selected theme mode
8. Brightness and volume sliders continue to work as before

### Automated Verification Available Today

- `npm run lint`
- `npm run build`

## Risks and Mitigations

### Risk: Theme state flicker on first client render

Mitigation:

- Initialize `themeMode` and effective `appearance` from client-safe logic in the existing client-only provider
- Keep the initial fallback deterministic for non-browser environments

### Risk: The visual redesign drifts too far from the current Tahoe token system

Mitigation:

- Reuse existing Tahoe glass, stroke, text, and shadow variables
- Add only small scoped style hooks instead of inventing a separate theme language for the panel

### Risk: `system` mode becomes unclear to the user

Mitigation:

- Explicitly label the mode as `Automático`
- If space is cleanly available, include the effective resolved appearance next to the label

## Decisions

- The theme selector will be a quick control inside Control Center, not a Settings-only option
- The selector cycles through exactly three states with repeated clicks
- `system` remains the default mode
- The shell continues to consume `appearance`, not `themeMode`
- The redesign focuses on Control Center only and does not expand scope into other system panels

## Implementation Readiness

This design is ready for implementation planning. The next step is to break the work into small execution steps covering:

- context/state changes
- Control Center layout changes
- any minimal styling additions
- verification
