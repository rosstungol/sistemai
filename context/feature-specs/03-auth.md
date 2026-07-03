Clerk is already installed and connected. Wire it into the Next.js app: provider, auth pages, redirects, route protection and user menu.

## Design

Use Clerk's `dark` theme from `@clerk/ui/themes` as the base.

Override Clerk's appearance variables using the app's existing CSS variables. Do not hardcode colors.

## Sign-in and Sign-up pages:
- Large screens: Simple two-panel layout
- Left: Compact logo, tagline, short text-only feature list
- Right: Centered Clerk form
- Small screens: Form only
- No gradients
- No oversized hero sections
- No feature cards
- No scroll-heavy layouts

Keep layout minimal and professional.

## Implementation

Wrap the root layout with `ClerkProvider` using Clerk's `dark` theme.

Create sign-in and sign-up pages using Clerk components.

Use `proxy.ts` in the `src` directory, not `middleware.ts`.

Define public routes using the existing sign-in and sign-up env vars. Protect everything else by default.

Update `/` route:

- Authenticated users redirect to `/editor`.
- Unauthenticated users redirect to `/sign-in`.

Add Clerk's built-in `UserButton` to the editor navbar right section for profile settings and logout.

Keep Clerk's default user menu and profile flows intact. Do not rebuild or heavily customize Clerk internals.

Use existing Clerk env vars. Do not rename or invent new ones.

## Dependencies

Install: @clerk/ui

## Check when done
- `proxy.ts` exists in the `src` directory
- All routes are protected except public auth paths
- Auth pages use CSS variables with no hardcoded colors
- `ClerkProvider` wraps the root layout
- `bun run build` passes