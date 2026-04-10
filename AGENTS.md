# Repository Guidelines

## Project Structure & Module Organization
`app/` contains the Next.js App Router entrypoints (`page.tsx`, `layout.tsx`, `not-found.tsx`) and API handlers under `app/api/`. `components/` holds the macOS-style UI shell; `Desktop.tsx` coordinates the experience, `Window.tsx` provides shared chrome, and files such as `FinderApp.tsx` or `TerminalApp.tsx` implement individual apps. Global state lives in `context/` (`FileSystemContext.tsx`, `SystemContext.tsx`), and shared helpers live in `lib/utils.ts`. Static assets, screenshots, icons, wallpapers, and downloadable PDFs belong in `public/`.

## Build, Test, and Development Commands
Use `npm install` to install dependencies. Run `npm run dev` for local development at `http://localhost:3000`. Use `npm run build` to create a production build and catch integration issues early, then `npm run start` to serve that build locally. Run `npm run lint` before every PR; it uses Next.js Core Web Vitals and TypeScript ESLint rules.

## Coding Style & Naming Conventions
Write TypeScript with `strict`-mode discipline: prefer explicit prop and state types for non-trivial components. Match the existing code style in `components/`: 2-space indentation, semicolons, and single quotes in TS/TSX files. Use PascalCase for React components and context providers (`NotificationCenter.tsx`), and keep route files lowercase to match Next.js conventions. Prefer the `@/*` import alias for shared modules. Keep Tailwind utility classes near the component they style.

## Testing Guidelines
There is no dedicated automated test suite yet. For now, contributors should run `npm run lint`, `npm run build`, and manually verify the main flows: boot sequence, Dock/window behavior, Spotlight (`Cmd/Ctrl + Space`), Finder, and Terminal interactions. If you introduce automated tests, use `*.test.ts` or `*.test.tsx` naming and colocate them with the feature or place broader scenarios under `tests/`.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commit style with scopes, for example `fix(profile): ...`, `fix(desktop): ...`, and `perf(mobile): ...`. Keep commits focused and use scopes that match the area you touched. PRs should include a short summary, linked issue when available, and screenshots or GIFs for UI changes. Call out performance-sensitive changes explicitly, especially anything that could affect LCP, CLS, lazy loading, or image optimization.
