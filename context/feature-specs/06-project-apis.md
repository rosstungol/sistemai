The database schema is ready. Build the backend project API routes only.

## Routes

Create Rest endpoints for:
- `GET /api/projects`, list current user's projects
- `POST /api/projects`, create a project
- `PATCH /api/projects/[projectId]`, rename a project
- `DELETE /api/projects/[projectId]`, delete a project

## Rules

Use the authenticated Clerk user ID as `ownerId`.

When creating:
- Default missing project name to `Untitled Project`
- Use the schema's existing ID strategy, do not add sequential IDs

Security:
- Unauthenticated requests return `401`
- Only the project owner can rename or delete
- Non-owner mutations return `403`

Keep this backend-only. Do not wire the UI yet.

## Check when done
- Routes exits for list, create, rename and delete
- Owner checks are enforced for rename and delete
- `401` and `403` responses are handled correctly
- `bun run build` passes
