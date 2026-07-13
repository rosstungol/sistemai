# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase
- Editor workspace shell — access control and layout scaffolding

## Current Goal
- Canvas workspace and project canvas data binding

## Completed

### 09 — Share Dialog (`context/feature-specs/09-share-dialog.md`)
- Created `src/app/api/projects/[projectId]/collaborators/route.ts`:
  - `GET` — lists collaborators enriched with Clerk user data (display name, avatar) via `clerkClient.users.getUserList()`, falls back to email-only display when no Clerk user is found; includes `isOwner` flag for the requesting user
  - `POST` — invites a collaborator by email (owner-only, 403 for non-owners). Validates email format, returns 409 for duplicate collaborators. `@unique([projectId, email])` constraint enforces uniqueness at DB level
  - `DELETE` — removes a collaborator by `collaboratorId` (owner-only, 403 for non-owners)
  - All routes enforce Clerk authentication (401 for unauthenticated, 404 for missing projects)
- Created `src/features/editor/components/share-dialog.tsx` — `ShareDialog` component:
  - Fetches collaborator list on open; shows loading spinner while fetching
  - **Owner view**: invite input with email validation (Enter to submit), collapsible list with remove button (`UserMinus` icon) per collaborator, "Copy link" button in the footer
  - **Collaborator view**: read-only list of collaborators
  - Collaborator rows display Clerk avatar (if available) or a `Mail` icon fallback, display name and email when Clerk data is found, email-only when not
  - Copy link button with temporary "Copied!" feedback (`Check` icon, 2s timeout)
  - Uses existing `Dialog` component (shadcn v4 base-nova, `@base-ui/react/dialog`)
- Updated `EditorClientShell` — added `isShareOpen` state, wired `onShare` navbar callback, renders `ShareDialog` conditionally when `currentProject` is defined (only visible on workspace pages)
- Production build: zero TypeScript errors, zero build errors

### 05 — Prisma (`context/feature-specs/05-prisma.md`)
- Created `prisma/models/project.prisma` with `Project` (ownerId, name, description, status, canvasJsonPath, timestamps, indexes) and `ProjectCollaborator` (project relation with cascade delete, email, timestamps, unique constraint, indexes)
- Both models added to shared schema in `prisma/schema.prisma` — Prisma v7 auto-loads all `.prisma` files from `prisma/` directory
- Created `lib/prisma.ts` as a cached singleton that branches on `DATABASE_URL`: uses `accelerateUrl` for `prisma+postgres://` URLs, otherwise wraps `@prisma/adapter-pg` via `pg.Pool`
- Client cached on `globalThis` in non-production for hot-reload safety
- Client generated to `src/generated/prisma/` (imported as `@/generated/prisma/client`)
- Initial migration `20260707135720_init` applied to the remote Prisma Postgres database
- Production build passes with zero TypeScript errors

### 01 — Design System (`context/feature-specs/01-design-system.md`)
- Initialized shadcn/ui (v4, base-nova style) with Tailwind v4
- Added shadcn components: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea
- Installed lucide-react (icon library)
- Created `lib/utils.ts` with `cn()` helper (clsx + tailwind-merge)
- Configured `globals.css` with project-specific dark theme variables mapped to shadcn CSS variable tokens
- Verified production build compiles with zero TypeScript and build errors

### 02 — Editor (`context/feature-specs/02-editor.md`)
- Editor Navbar (`features/editor/components/editor-navbar.tsx`) — fixed-height top bar with sidebar toggle
- Project Sidebar (`features/editor/components/project-sidebar.tsx`) — floating slide-in overlay with tabs and new-project button
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
- `AuthContent` component moved to `features/auth/components/auth-content.tsx`
- `UserButton` added to editor navbar right section for profile settings and logout
- Verification build passes with zero errors

### 04 — Project Dialogs (`context/feature-specs/04-project-dialogs.md`)
- Created `features/editor/hooks/use-project-dialog.tsx` — dedicated hook managing dialog type, form state (name/slug), loading state, and mock project list
- Created `features/editor/providers/editor-dialog-provider.tsx` — `EditorDialogProvider` context and `useEditorDialog` hook sharing `openCreate`, `openRename`, `openDelete` across layout, sidebar, and editor page
- Created `features/editor/components/project-dialog.tsx` — reusable dialog shell extracted from `project-dialogs.tsx` (handles open/close, title, description, body, footer with Cancel + action button)
- Created `features/editor/components/project-dialogs.tsx` — three dialog instances using `ProjectDialog`:
  - **Create**: project name input + live slug preview
  - **Rename**: pre-filled input, auto-focus, current name in description, Enter submits
  - **Delete**: destructive confirmation with `destructive` button variant
- Updated `src/app/editor/page.tsx` — editor home with heading, description, and New Project button (Plus icon)
- Updated `features/editor/components/project-sidebar.tsx`:
  - Mock project list in "My Projects" tab with inline Rename/Delete actions (visible on hover, owned only)
  - Shared projects listed without actions
  - Backdrop scrim (`bg-black/40`) added to overlay
- Updated `src/app/editor/layout.tsx` — wires hook, context provider, sidebar callbacks, and dialog rendering
- All flows use mock data (no API calls or persistence)
- Production build: zero TypeScript errors, zero lint errors

### 06 — Project APIs (`context/feature-specs/06-project-apis.md`)
- Created `src/app/api/projects/route.ts` — `GET` lists authenticated user's projects (ordered by `createdAt desc`); `POST` creates a project with `name` defaulting to `Untitled Project`
- Created `src/app/api/projects/[projectId]/route.ts` — `PATCH` renames (owner-only, 403 for non-owners); `DELETE` deletes (owner-only, 403 for non-owners)
- Auth checks via `auth()` from `@clerk/nextjs/server`: `401` for unauthenticated, `403` for non-owner mutations, `404` for missing projects
- Route params use the Next.js 16 pattern (`Promise<params>` awaited in handler)
- Moved `lib/prisma.ts` to `src/lib/prisma.ts` for consistency with `@/*` alias (maps to `./src/*`)
- Production build passes with zero TypeScript errors

### 08 — Editor Workspace Shell (`context/feature-specs/08-editor-workspace-shell.md`)
- Created `src/lib/project-access.ts` with `getCurrentIdentity()` (userId + email from Clerk) and `checkProjectAccess(slug)` (looks up project by slug, verifies owner or collaborator, returns project data or null)
- Created `src/features/editor/components/access-denied.tsx` — centered layout with lock icon, "Access Denied" message, and Back to Editor link
- Created `src/app/editor/[roomId]/page.tsx` — server component that awaits `params`, redirects unauthenticated users to `/sign-in`, displays `AccessDenied` for missing or unauthorized projects, and renders canvas placeholder on success
- Modified `EditorNavbar` — added optional `projectName`, `onShare`, `onToggleAi`, `isAiOpen` props; conditionally shows project name with divider, Share icon button, and AI toggle button (AI button highlighted when active)
- Modified `ProjectSidebar` — added `activeProjectSlug` prop for highlighting the current room; project items are now `Link` elements navigating to `/editor/<slug>`, clicking closes the sidebar, active project highlighted with accent background and text colors
- Modified `EditorClientShell` — detects current room via `useParams()`, resolves current project from the projects list, passes project info to `EditorNavbar` and `activeProjectSlug` to `ProjectSidebar`, manages `isAiOpen` state, renders AI sidebar placeholder alongside children (closed by default, toggled from navbar, shows AI Assistant header with bot icon and placeholder message)
- Fixed `use-project-dialog` delete check: now compares against `slug` instead of `id` for active workspace detection (URLs use slugs)
- Production build: zero TypeScript errors, zero build errors

### 07 — Editor Home (`context/feature-specs/07-editor-home.md`)
- Added `slug` field to Prisma `Project` model (unique) and pushed schema to database
- Created `src/lib/projects.ts` — `getUserProjects()` server-only helper that fetches owned and shared projects via Prisma
- Updated `POST /api/projects` to accept `slug`; generates fallback slug from name + random suffix when not provided
- Fixed `DELETE /api/projects/[projectId]` route handler signature (missing `NextRequest` first param)
- Refactored `use-project-dialog.tsx` — removed mock data and simulated delays; all mutations call real API:
  - **Create**: generates unique slug from name + 4-char suffix (pinned when dialog opens, stable while typing), calls `POST /api/projects`, navigates to `/editor/<slug>` on success
  - **Rename**: calls `PATCH /api/projects/[id]`, calls `router.refresh()` on success
  - **Delete**: calls `DELETE /api/projects/[id]`, redirects to `/editor` if deleting the active workspace, otherwise refreshes
- Restructured `app/editor/layout.tsx` — now a server component that fetches projects via `getUserProjects()` and passes them to a new `EditorClientShell` client component
- Created `EditorClientShell` — client component managing sidebar state, dialog state, navbar, sidebar, and dialogs; wraps children in `EditorDialogProvider`
- Created `EditorHomeContent` — client component extracted from the old page (heading + New Project button), uses `useEditorDialog` context
- `app/editor/page.tsx` — simplified to server component rendering `EditorHomeContent`
- No client-side fetching for initial load; all data flows through server component
- The project `id` (cuid) is the source of truth for both the project identifier and the Liveblocks room ID — documented by the POST response returning the full project object with `id`
  - Hardened auth checks: `!isAuthenticated` changed to `!isAuthenticated || !userId` across all four API route handlers to ensure `userId` is non-null before use
  - Slug normalization: `POST /api/projects` now lowercases slugs, replaces whitespace with hyphens, and strips non-alphanumeric characters
  - Slug conflict handling: `POST /api/projects` catches `Prisma.PrismaClientKnownRequestError` (code `P2002`) and returns `409 Conflict` with a descriptive error when a slug is taken
  - Error propagation: added `error` state (`string | null`) to the hook, surfaced as red text in `ProjectDialog` header; all three dialogs (Create, Rename, Delete) display API errors inline
  - Create uses real slug from API: `handleCreate` now navigates to `/editor/${project.slug}` from the response body instead of the local slug variable
  - Fixed shared project lookup in `getUserProjects()`: now fetches the authenticated user's email via `currentUser()` and filters collaborators by `some: { email: userEmail }` instead of `some: {}`
- Production build: zero TypeScript errors, zero build errors

## In Progress
- None yet.

## Next Up
- Canvas workspace and project canvas data binding
- Real canvas logic with React Flow
- Liveblocks integration for real-time collaboration
- AI chat sidebar implementation

## Recently Completed

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
- Dialog state managed via shared `useProjectDialog` hook + React context (separated into `EditorDialogProvider` in `features/editor/providers/`), allowing both sidebar and editor page to trigger dialogs without prop drilling through `children`
- Slug suffix pinned via ref when create dialog opens; stable across keystrokes, regenerated each reopen
- Feature code organized under `src/features/` by domain (`auth/`, `editor/`) with components, hooks, and providers colocated per feature
- API routes organized under `src/app/api/` by resource (`projects/`)
- Project owner checks enforced server-side in route handlers: 401 for unauthenticated, 403 for non-owner mutations
- Route handler `params` is a Promise (Next.js 16 convention); must be awaited
- `auth()` from `@clerk/nextjs/server` provides `isAuthenticated` and `userId` for server-side auth checks
- `lib/prisma.ts` moved to `src/lib/prisma.ts` for consistency with the `@/*` path alias mapping to `./src/*`
- Project access checks for workspace pages use `checkProjectAccess(slug)` in `lib/project-access.ts` — verifies ownership OR collaborator status by slug lookup; returns null for missing/unauthorized projects
- Workspace page (`/editor/[roomId]`) is a server component that redirects unauthenticated users and renders `AccessDenied` for unauthorized access
- Current room detected in `EditorClientShell` via `useParams()` and used to highlight the active project in the sidebar and pass the project name to the navbar
- AI sidebar state managed in `EditorClientShell` and toggled from `EditorNavbar`; rendered as a right-side panel alongside children in the main area

## Session Notes
- Design system foundation complete. All UI primitives are available and ready for feature development.
- Generated `components/ui/*` files must NOT be manually modified per spec.
- Editor shell components implemented: navbar and project sidebar. Navbar accepts `isSidebarOpen` and `onToggleSidebar` props for parent-controlled state.
- Clerk auth integrated: provider with dark theme, proxy-based route protection, sign-in/sign-up pages with two-panel layout, root page redirect, UserButton in navbar.
- Editor layout created as client component managing sidebar state. Editor page shows project home with heading, description, and New Project button.
- Project dialogs implemented: Create (name + live slug preview), Rename (pre-filled + auto-focus + Enter submit), Delete (destructive confirmation).
- Sidebar shows mock project list with inline actions for owned projects; shared projects listed without actions.
- Backdrop scrim (`bg-black/40`) added to sidebar overlay for mobile.
- All dialog state, form state, and loading state managed by `useProjectDialog` hook (`features/editor/hooks/`), shared via `EditorDialogProvider` context (`features/editor/providers/`).
- The `/editor` route is live, protected by Clerk middleware. Authenticated users see the editor home with New Project flow.
- Project API routes implemented at `/api/projects` (GET, POST) and `/api/projects/[projectId]` (PATCH, DELETE). All routes enforce Clerk authentication. Mutations check project ownership (`ownerId === userId`). Missing projects return 404. Non-owner mutations return 403. Unauthenticated requests return 401.
- Editor workspace shell (`/editor/[roomId]`) implemented: server component with access checks (unauthenticated → redirect, no access → AccessDenied), workspace layout with project name in navbar, Share/AI toggle buttons, sidebar highlighting current project, canvas placeholder, and AI sidebar placeholder.
- `EditorNavbar` extended with optional workspace props: `projectName`, `onShare`, `onToggleAi`, `isAiOpen` — conditionally renders project name divider and action buttons.
- `ProjectSidebar` project items now navigate to `/editor/<slug>` via `Link` and highlight the active project with accent color.
- `use-project-dialog` delete check fixed to use `slug` instead of `id` for active workspace detection.
- Production build: zero TypeScript errors, zero build errors.
