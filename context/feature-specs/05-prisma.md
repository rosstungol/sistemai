Prisma is already installed. Add the project data models, Prisma client singleton, and first migration.

## Models

Create `prisma/models/project.prisma`

Add `Project`:
- Owner ID mapped to Clerk user
- Name
- Optional description
- Status enum: `DRAFT`, `ARCHIVED`
- `canvasJsonPath` for future canvas blob storage
- Timestamps
- Indexes on owner ID and creation date

Add `ProjectCollaborator`:
- Project relation with cascade delete
- Collaborator email
- Creation timestamp
- Unique constrait on project/email
- indexes on email and project/date

Do not add extra fields unless required by Prisma.

## Prisma Client

Create `lib/prisma.ts` as a cached singleton.

Branch by `DATABASE_URL`:
- If it starts with `prisma+postgres://`, use Accelerate
- otherwise use direct `@prisma/adapter-pg`

Cache the client on `global` in development for hot reloads.

## Migration

Run the migration and generate the client.

## Dependencies

Already installed:
- `prisma`
- `@prisma/client`
- `@prisma/adapter-pg`
- `pg`

## Check when done
- Schema has both models with correct relations and indexes
- `lib/prisma.ts` exports one cached Prisma instance
- Migration runs successfully
- `bun run build` passes