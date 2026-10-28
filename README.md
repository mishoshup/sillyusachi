# sillyusachi

Sillyusachi's bookshelf site, running on Cloudflare Workers.

- `apps/web`: Astro front end (worker `sillyusachi`, serving sillyusachi.com), which reaches the API through the `API` service binding.
- `apps/api`: Hono API (worker `sillyusachi-api`, private) backed by D1 and R2.
- `packages/shared`: types shared by both apps.

## Setup

Requires Node 24 (pinned in `mise.toml`) and bun.

```sh
bun install
bun run --filter api keys:dev   # writes apps/api/.dev.vars (gitignored)
bun run db:migrate              # applies migrations to the local D1
```

## Scripts

| Script                 | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `bun run dev`          | Runs the web (4321) and API (8787) workers |
| `bun run check`        | Generates worker types and type-checks     |
| `bun run test`         | Runs the API tests                         |
| `bun run lint`         | Runs ESLint                                |
| `bun run format:check` | Checks Prettier formatting                 |
