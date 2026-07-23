# Local full-stack development

The VS Code devcontainer runs the frontend and the backend monorepo against a
local, persistent infrastructure. The frontend is available at
<http://localhost:3000/ui/it/> and uses the local backend by default. The local
operations dashboard is available at
<http://localhost:3000/ui/local-dashboard/>.

## Prerequisites

- Linux or macOS
- Docker Engine or Docker Desktop running on the host
- VS Code with the Dev Containers extension
- Git access to `https://github.com/pagopa/interop-be-monorepo.git`
- at least 8 CPU and 12 GB RAM allocated to Docker Desktop (or available to the
  Docker Engine); backend watch mode can require more

The container reuses the host Docker socket. Code running inside the container
can therefore control the host Docker daemon; use this configuration only with
trusted repositories and dependencies. Only one local Interop full-stack
environment is supported at a time because its ports and Docker project name
are fixed.

Dependencies and the pnpm store use Docker volumes, so host and container
native modules remain separate and subsequent container rebuilds can reuse the
downloaded packages.

## First start

1. Open `interop-pdnd-fullstack.code-workspace` in VS Code.
2. Run **Dev Containers: Reopen in Container**.
3. When VS Code asks whether automatic tasks are allowed for this repository,
   select **Allow Automatic Tasks**. This explicit, one-time permission is
   required before VS Code can open the `fullstack:startup-dashboard` terminal.
4. Vite starts first in bootstrap mode, so VS Code can immediately open the
   React dashboard at <http://localhost:3000/ui/local-dashboard/>. The page
   reports startup progress, Docker infrastructure, backend processes, and
   searchable logs while the rest of the stack is still starting.
5. Follow the `fullstack:startup-dashboard` terminal for the same startup flow
   in text form. Startup failures are displayed there immediately with the
   relevant backend log tail.
6. After seed and token generation, Vite restarts once in authenticated local
   mode. The dashboard reconnects automatically after this brief interruption.
   When startup reports `READY`, open the application at
   <http://localhost:3000/ui/it/>.

If the automatic-task notification was dismissed, run **Tasks: Manage
Automatic Tasks** from the Command Palette, choose **Allow Automatic Tasks**,
and reload the window. Alternatively, run `pnpm local:dashboard` in a terminal
to attach to the startup that is already running.

If `../interop-be-monorepo` is missing, the initialize step clones its
`develop` branch. If it already exists, it is left untouched: no checkout,
pull, stash, or branch change is performed.

Set `INTEROP_AUTO_START=false` in the environment that launches VS Code to open
the container without starting the stack automatically. Then run
`pnpm local:start` when needed.

## Commands

Run these commands from the frontend terminal inside the devcontainer:

| Command                                  | Effect                                                                            |
| ---------------------------------------- | --------------------------------------------------------------------------------- |
| `pnpm local:start`                       | Starts infrastructure, backend, base seed, token, and frontend                    |
| `pnpm local:status`                      | Shows tmux sessions, every backend application process, and Docker services       |
| `pnpm local:dashboard`                   | Follows the current automatic startup in the terminal and prints its final status |
| `pnpm local:smoke`                       | Checks frontend, BFF, Selfcare, catalog seed, and Docker services                 |
| `pnpm local:test:e2e`                    | Opens the published frontend with Playwright and verifies the local seed          |
| `pnpm local:logs`                        | Follows the combined backend log                                                  |
| `pnpm local:logs -- frontend`            | Follows the frontend log                                                          |
| `pnpm local:stop`                        | Stops the stack and preserves Docker volumes                                      |
| `pnpm local:reset`                       | Stops the stack and deletes all local Interop volumes and generated state         |
| `pnpm local:use:local`                   | Restarts only Vite against the local backend                                      |
| `pnpm local:use:dev`                     | Restarts only Vite against the development environment                            |
| `pnpm local:identity -- <tenant> <user>` | Generates a local token and restarts Vite with that identity                      |

`local:reset` is destructive for this local environment. It removes event
store, SQL readmodels, DynamoDB, Kafka, Redis, MinIO, and generated seed/token
state; it does not delete either Git checkout.

## Identities and seed

Available tenants are `comune`, `provider`, `impresa`, and `certificatore`.
Available users are `admin`, `api`, `security`, `reviewer`, and `viewer`, each
with the corresponding single role on every tenant.
Use the party switcher in the frontend header, or open
<http://localhost:3000/ui/it/local-identity-selection/>, to select a local tenant
and a role-specific user. Every local user can access all seeded tenants, and the
selection persists across page reloads.

The local frontend runner sets `SELFCARE_LOGIN_URL` to that route. Override the
variable before starting Vite if the frontend is published on a different host
URL.

The CLI remains available as a fallback:

```bash
pnpm local:identity -- comune reviewer
pnpm local:identity -- provider admin
```

IDs are generated or discovered during the seed and stored under the ignored
backend `.local-development` directory. They are deliberately not copied from
older token-generation scripts. Tokens are signed by local KMS and the frontend
reads the generated token file without writing it to a tracked `.env` file.

The idempotent base seed creates the four Selfcare tenants and a published
`Catalogo Demo` e-service owned by `Provider Demo`. Each tenant also receives a
`CONTACT_EMAIL`, so agreement submission and the other flows that require a
tenant contact address work without manual setup. Data reaches the SQL and
DynamoDB readmodels through the same APIs and event consumers used by the
application.

## Local and development backend

Local mode rewrites frontend gateway requests to the local BFF. Development
mode keeps the regular Vite environment configuration and therefore uses the
token already configured for development. Changing mode restarts Vite only;
the local backend and its volumes stay running.

The dashboard route and its read-only status/log endpoints exist only when Vite
is started by the local-development scripts. They are not registered by a
normal `pnpm dev` or production build. Log search covers the most recent 2 MB
of each local startup, backend, frontend, and port-forward log and accepts a
correlation ID or arbitrary text. Subsequent polling requests use a byte cursor
for each source and transfer only complete log lines appended since the
previous response. Changing the source or search text starts a fresh query.

## Manual UI verification

After `pnpm local:start`, verify the user-visible contract:

1. Open the UI and confirm that the selected institution is `Comune Demo`.
2. Open the catalog and confirm that `Catalogo Demo`, published by
   `Provider Demo`, is visible.
3. Use the header party switcher to select `Provider Demo` and `Utente Viewer`,
   then confirm that the frontend opens with the selected identity.
3. As `provider admin`, create an e-service and confirm that it appears in the
   producer e-service list after a refresh.
4. Switch to `comune reviewer` and confirm that the risk-analysis/reviewer area
   is accessible.
5. Switch back to `comune admin` and confirm normal administration navigation.

This is the extended manual UI check. Startup also runs focused Playwright
checks for the published frontend shell and seeded catalog; API, seed, proxy,
and configuration behaviour are covered by automated smoke and unit tests.

## Troubleshooting

- Use `pnpm local:status` first, then `pnpm local:logs`.
- Open <http://localhost:3000/ui/local-dashboard/> to inspect services and
  search the latest 500 log lines by source, level, process, correlation ID, or
  message without leaving the browser. Selecting a process in the services
  table applies the corresponding log filter. Use **Copia log filtrati** to
  copy the complete filtered result, including virtualized rows, for an issue
  or troubleshooting note.
- Port `5173` is Vite's internal devcontainer port and is used only by health
  checks. From the host browser always use port `3000`.
- After an unclean Docker shutdown, startup automatically removes a stale
  ZooKeeper `/brokers/ids/1` registration only when Kafka is not running. Kafka
  topics and persistent volumes are preserved.
- The `fullstack:startup-dashboard` terminal is opened automatically on every
  container start. Use **Terminal: Run Task** to reopen it if it was closed.
- If old persistent data is incompatible with the current branches, run
  `pnpm local:reset` and then `pnpm local:start`.
- If port `3000` or an infrastructure port is already occupied, the dashboard
  now fails immediately and displays Docker's conflicting port. Stop the other
  Interop environment before starting this one.
- Docker services are published by the host daemon. Small `socat` forwarders
  make those host ports reachable as `localhost` from inside the devcontainer.
  They must not be added to the devcontainer `forwardPorts`: VS Code would bind
  the same host ports before Compose and prevent services such as MinIO from
  starting.
- Automatic forwarding is disabled for every port except Vite `5173`. This is
  important because backend processes also listen inside the devcontainer; if
  VS Code forwarded the catalog process on port `3000`, it could shadow the
  Docker mapping from host port `3000` to Vite and return a backend error when
  opening the UI.
