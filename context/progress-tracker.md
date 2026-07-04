# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase
- Project dialogs — create, rename, and delete project dialogs wired into sidebar and editor home

## Current Goal
- Editor home screen with New Project button and project dialog flows

## Completed

### 01 — Design System (`context/feature-specs/01-design-system.md`)
- Initialized shadcn/ui (v4, base-nova style) with Tailwind v4
- Added shadcn components: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea
- Installed lucide-react (icon library)
- Created `lib/utils.ts` with `cn()` helper (clsx + tailwind-merge)
- Configured `globals.css` with project-specific dark theme variables mapped to shadcn CSS variable tokens
- Verified production build compiles with zero TypeScript and build errors

### 02 — Editor (`context/feature-specs/02-editor.md`)
- Editor Navbar (`components/editor/editor-navbar.tsx`) — fixed-height top bar with sidebar toggle
- Project Sidebar (`components/editor/project-sidebar.tsx`) — floating slide-in overlay with tabs and new-project button
- Dialog pattern verified: Title, Description, Footer actions supported by existing `components/ui/dialog.tsx`
- Editor layout (`app/editor/layout.tsx`) — client component wiring navbar, sidebar toggle, and page content
- Editor page (`app/editor/page.tsx`) — workspace shell with empty state

### 03 — Auth (`context/feature-specs/03-auth.md`)
- Installed `@clerk/ui` for Clerk's `dark` theme
- Created `src/proxy.ts` with protected-first route strategy (sign-in/sign-up public, all else protected)
- Root layout wrapped with `ClerkProvider` using `dark` theme from `@clerk/ui/themes`
- Clerk appearance variables mapped to project's existing CSS variables via `appearance.variables`
- Shared `(auth)/layout.tsx` — two-panel wrapper (left: brand/features via `AuthContent`, right: centered form slot)
- Sign-in page at `(auth)/sign-in/[[...rest]]/page.tsx` — renders `<SignIn>` into shared layout
- Sign-up page at `(auth)/sign-up/[[...rest]]/page.tsx` — renders `<SignUp>` into shared layout
- Root page (`/`) redirects authenticated users to `/editor` (proxy middleware handles unauthenticated redirect)
- `AuthContent` component moved to `components/auth/auth-content.tsx`
- `UserButton` added to editor navbar right section for profile settings and logout
- Verification build passes with zero errors

### 04 — Project Dialogs (`context/feature-specs/04-project-dialogs.md`)
- Created `src/hooks/use-project-dialog.tsx` — dedicated hook managing dialog type, form state (name/slug), loading state, and mock project list
- Created `useEditorDialog` context — shares `openCreate`, `openRename`, `openDelete` across layout, sidebar, and editor page
- Created `src/components/editor/project-dialogs.tsx` — three dialog components:
  - **Create**: project name input + live slug preview
  - **Rename**: pre-filled input, auto-focus, current name in description, Enter submits
  - **Delete**: destructive confirmation with `destructive` button variant
- Updated `src/app/editor/page.tsx` — editor home with heading, description, and New Project button (Plus icon)
- Updated `src/components/editor/project-sidebar.tsx`:
  - Mock project list in "My Projects" tab with inline Rename/Delete actions (visible on hover, owned only)
  - Shared projects listed without actions
  - Backdrop scrim (`bg-black/40`) added to overlay
- Updated `src/app/editor/layout.tsx` — wires hook, context provider, sidebar callbacks, and dialog rendering
- All flows use mock data (no API calls or persistence)
- Production build: zero TypeScript errors, zero lint errors

## In Progress
- None yet.

## Next Up
- Canvas workspace and project canvas data binding

## Open Questions
- None yet.

## Architecture Decisions
- shadcn v4 base-nova style chosen (uses `@base-ui/react` primitives instead of Radix)
- Dark-only theme: `:root` contains the dark values; no light mode
- Custom CSS variables (`--bg-base`, `--text-primary`, `--accent-primary`, etc.) registered via `@theme inline` for Tailwind utility use
- shadcn CSS variable layer (`--background`, `--foreground`, etc.) references the custom project variables
- Editor components are interactive; marked `"use client"`
- Auth uses Clerk (already installed before this phase): `@clerk/nextjs` v7, `@clerk/ui` for themes
- Route protection via `proxy.ts` (`clerkMiddleware`) instead of `middleware.ts`
- Clerk's `dark` theme used as base; CSS variable overrides ensure visual consistency with the design system
- Auth pages use `(auth)` route group for clean URLs (`/sign-in`, `/sign-up`)
- Dialog state managed via shared `useProjectDialog` hook + React context, allowing both sidebar and editor page to trigger dialogs without prop drilling through `children`
- Mock data lives in the hook (`MOCK_PROJECTS`) with simulated 400ms async delay for create/rename/delete actions

## Session Notes
- Design system foundation complete. All UI primitives are available and ready for feature development.
- Generated `components/ui/*` files must NOT be manually modified per spec.
- Editor shell components implemented: navbar and project sidebar. Navbar accepts `isSidebarOpen` and `onToggleSidebar` props for parent-controlled state.
- Clerk auth integrated: provider with dark theme, proxy-based route protection, sign-in/sign-up pages with two-panel layout, root page redirect, UserButton in navbar.
- Editor layout created as client component managing sidebar state. Editor page shows project home with heading, description, and New Project button.
- Project dialogs implemented: Create (name + live slug preview), Rename (pre-filled + auto-focus + Enter submit), Delete (destructive confirmation).
- Sidebar shows mock project list with inline actions for owned projects; shared projects listed without actions.
- Backdrop scrim (`bg-black/40`) added to sidebar overlay for mobile.
- All dialog state, form state, and loading state managed by `useProjectDialog` hook, shared via `EditorDialogProvider` context.
- The `/editor` route is live, protected by Clerk middleware. Authenticated users see the editor home with New Project flow.
