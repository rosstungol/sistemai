We need the base chrome components that frame every editor screen - the top navbar and the left sidebar shell. These will be reused and extended in every chapter that follows.

### Editor Navbar

Create `features/editor/components/editor-navbar.tsx`.

Requirements:
- Fixed-height top navbar
- Left, center, and right sections
- Left section contains sidebar toggle button
- Use `PanelLeftOpen` / `PanelLeftClose` icons based on the sidebar state
- Right section stays empty for now
- Dark background with subtle bottom border color

### Project Sidebar

Create `features/editor/components/project-sidebar.tsx`.

Requirements:
- Sidebar should float above the editor canvas
- Opening it should not push page content
- Slide in from the left
- Accepts `isOpen` prop
- Header with `Projects` title + close button
- shadcn `Tabs`:
  - My Projects
  - Shared
- Both tabs show empty placeholder state
- Full-width `New Project` button at the bottom with `Plus` icon

### Dialog Pattern

Use the existing color tokens from `globals.css`.

Support:
- Title
- Descriptions
- Footer actions

Do not build the actual dialogs yet.

### Check when done
- New components compile without Typescript errors
- No lint errors
- Dialog pattern is ready for future use.