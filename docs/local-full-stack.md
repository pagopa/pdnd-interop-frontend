# Local full-stack development

Run the PDND frontend with a local backend, infrastructure, demo data, and
identities. The environment includes a development dashboard for backend
packages, watch mode, presets, infrastructure, access tokens, and logs.

| Application              | Browser URL                      |
| ------------------------ | -------------------------------- |
| Frontend                 | <http://localhost:3000/ui/it/>   |
| Development dashboard    | <http://localhost:8076>          |
| Fullstack startup status | <http://localhost:8076/#/status> |

## Prerequisites

- Git and Bash on Linux, macOS, or Windows with WSL2.
- Docker Engine or Docker Desktop with Linux containers and Compose v2.
- VS Code with Dev Containers for editing inside the container.
- Network access for repository cloning, container images, and dependencies on
  the first start.

On Windows, follow the [WSL2 setup guide](local-full-stack-windows.md) before
starting the environment. On macOS, allow Docker Desktop to access the checkout
directory. Host Node.js and pnpm are optional for startup. The containers provide
their own tools and dependencies.

Keep the checkouts as siblings under any parent directory:

```text
dev/
  pdnd-interop-frontend/
  interop-be-monorepo/
```

Initialization looks for `../interop-be-monorepo`. If the directory is missing,
it clones the backend's `develop` branch there. It preserves an existing checkout
and its local changes. Both checkouts must contain the local-development
scripts described in this guide.

## First start

### Start in VS Code

1. From the frontend checkout, open the fullstack workspace:

   ```bash
   code interop-pdnd-fullstack.code-workspace
   ```

2. Run **Dev Containers: Reopen in Container**. Allow workspace tasks when VS Code
   asks. VS Code attaches to the frontend container while setup continues.
3. Follow the **Full stack: startup logs** terminal. The dashboard opens in the
   host's default browser when its API is ready.
4. In **Fullstack status**, follow the startup phases. Use **Open frontend** when
   Vite is running. After setup completes, the frontend shows the local identity
   and the seeded `Catalogo Demo` eservice.

The workspace shows both repositories as separate roots. Closing VS Code leaves
the containers running.

### Start from a terminal

From the frontend checkout on the host, run:

```bash
bash scripts/local-development/fullstack.sh start
```

The command prepares the Compose configuration, starts the containers, and waits
for startup checks to finish. Open the dashboard and frontend URLs from the table
above. This path does not require VS Code or host Node.js.

### Startup phases

The dashboard API coordinates startup in this order:

1. Install frontend dependencies and Playwright Chromium when Vite is not running.
2. Confirm dashboard API readiness.
3. Start and initialize local infrastructure.
4. Start the **Frontend backend** preset, `frontend-full`.
5. Create or reuse the local demo data.
6. Obtain a token for the selected local identity, initially `comune` and `admin`.
7. Start Vite.
8. Run smoke checks and browser checks.

Backend packages in the preset start with bounded concurrency after their shared
build dependencies are ready. Startup waits for all members before seeding.
Their watch mode is off by default. Enable watch in the dashboard for packages
you are editing.

The first start includes image builds and dependency downloads. Later starts
reuse dependency volumes and build caches. If a phase fails, the remaining phases
are skipped and the frontend container stays available for inspection. Fix the
reported error and run `pnpm local:start` to retry.

## Daily commands

Run these commands from the frontend checkout in its devcontainer. On a host
with pnpm, lifecycle commands enter the frontend container through Compose.

| Command                               | Effect                                                                                       |
| ------------------------------------- | -------------------------------------------------------------------------------------------- |
| `pnpm local:start`                    | Start the local frontend, backend preset, seed, and checks.                                  |
| `pnpm local:stop`                     | Stop Vite and the backend preset. Keep infrastructure, containers, and data.                 |
| `pnpm local:status`                   | Print backend status and frontend process state.                                             |
| `pnpm local:dashboard`                | Start the standalone dashboard from the host, or check fullstack readiness in the container. |
| `pnpm local:logs`                     | Print recent backend and orchestration logs.                                                 |
| `pnpm local:logs frontend`            | Print the Vite log tail.                                                                     |
| `pnpm local:use:local`                | Obtain a local token and restart Vite against the local BFF.                                 |
| `pnpm local:use:dev`                  | Restart Vite against shared development without local token injection.                       |
| `pnpm local:identity comune reviewer` | Select a local tenant and user, obtain their token, and restart Vite.                        |

`local:use:local` and `local:identity` require seeded local data. CLI identity
selection persists for later starts. Switching to shared development leaves
local backend processes running. Use the dashboard to manage backend packages
outside the frontend preset.

Run smoke checks and browser checks **inside the frontend container**, which has
the required tools and Chromium installation:

```bash
pnpm local:smoke
pnpm local:test:e2e
```

### Reset local data

`pnpm local:reset` stops Vite and managed backend packages, deletes infrastructure
data and backend seed state, and initializes clean infrastructure. The CLI does
not ask for interactive confirmation. Git checkouts, dependency caches, and
personal presets are preserved.

To reset and prepare a new local environment, run:

```bash
pnpm local:reset
pnpm local:start
```

## Local identities

The demo dataset provides these identity keys:

| Type   | Keys                                             |
| ------ | ------------------------------------------------ |
| Tenant | `comune`, `provider`, `impresa`, `certificatore` |
| User   | `admin`, `api`, `security`, `reviewer`, `viewer` |

In the frontend, use the header's party switcher or open
<http://localhost:3000/ui/it/local-identity-selection/> to choose a tenant and user.
The browser retains that selection across reloads. CLI selection controls the
runtime's initial token and is stored separately from the browser session.

After a reset, the frontend resolves the saved session through stable Selfcare
and user IDs and requests a fresh token. While the identity API is unavailable,
the frontend retains the session and retries. If an identity no longer exists,
the frontend returns to identity selection.

The seed creates the demo tenants, role-specific users, and the published
`Catalogo Demo` eservice owned by `Provider Demo`. The dashboard's **Access token**
page also generates tokens for manual API use.

## Runtime architecture

Docker Compose runs two application containers on the same network:

| Service     | Responsibilities                                                                                                      |
| ----------- | --------------------------------------------------------------------------------------------------------------------- |
| `dashboard` | Serve the dashboard UI and API, supervise backend packages, manage infrastructure, seed data, and issue local tokens. |
| `frontend`  | Host VS Code, run the frontend agent and Vite, and execute frontend installation and checks.                          |

The backend dashboard runs independently of the frontend. The frontend container
mounts both checkouts for editing, with dependencies and browser caches in named
volumes. Infrastructure runs in additional Compose containers. The dashboard has
Docker access for infrastructure operations.

The frontend agent listens on internal port `8077`. The dashboard reads its
status and logs and sends commands for installation, Vite, and checks. The agent
owns the Vite process and frontend state. The dashboard accepts one fullstack
action at a time and rejects concurrent lifecycle requests.

For backend-only startup and dashboard features, see
`docs/development-dashboard.md` in the `interop-be-monorepo` checkout. Infrastructure
mocks and seeding are described in that repository's `docs/frontend-local-runtime.md`.

### Workspace and configuration

The single `interop-pdnd-fullstack.code-workspace` lists both repositories.
Initialization creates `.local-development/interop-be-monorepo` as a symbolic
link to the sibling backend checkout. The real backend repository remains outside
the frontend. Both real source paths are mounted in the container.

`.devcontainer/compose.yml` defines the frontend service and dashboard integration.
Initialization generates `.local-development/frontend/compose.yml` with absolute
checkout paths, mounts, and the container user's UID and GID. Linux and WSL2 use
the host user's IDs. macOS keeps the image's `node` identity, `1000:1000`, because
Docker Desktop maps bind-mount permissions. Regenerate the configuration through
initialization after moving the checkouts. For host-only editing before the
first container start, prepare the workspace with `bash .devcontainer/initialize.sh`.

The Compose configuration provides these internal targets:

| Setting                        | Value                              | Used by                                             |
| ------------------------------ | ---------------------------------- | --------------------------------------------------- |
| `DASHBOARD_FRONTEND_URL`       | `http://frontend:8077`             | Dashboard commands and frontend status.             |
| `INTEROP_DASHBOARD_URL`        | `http://dashboard:8076`            | Frontend lifecycle client and local identity proxy. |
| `INTEROP_LOCAL_BACKEND_TARGET` | `http://dashboard:3600`            | Vite's local BFF proxy and smoke checks.            |
| `INTEROP_SELFCARE_URL`         | `http://host.docker.internal:8006` | Selfcare smoke checks.                              |

These hostnames are for container traffic. In the browser, use `localhost`.
The local identity proxy is enabled by the local-development launcher.

### Ports

| Host port | Container destination | Purpose                |
| --------- | --------------------- | ---------------------- |
| `3000`    | `frontend:5173`       | Frontend HTTP and HMR. |
| `8076`    | `dashboard:8076`      | Dashboard UI and API.  |
| `3600`    | `dashboard:3600`      | Local BFF.             |

Docker publishes these ports. VS Code automatic and restored port forwarding
are disabled. Vite uses `--strictPort` so it fails if internal port `5173` is
occupied instead of choosing an unpublished port.

Browser checks keep the public `http://localhost:3000` origin while routing
through the Docker host gateway. Use `pnpm local:test:e2e` so its wrapper prepares
the required networking settings.

### Local files and persistence

Generated frontend files are ignored by Git:

| Path                                           | Contents                                         |
| ---------------------------------------------- | ------------------------------------------------ |
| `.local-development/frontend/compose.yml`      | Machine-specific frontend Compose configuration. |
| `.local-development/frontend/startup.log`      | Frontend installation, checks, and agent output. |
| `.local-development/frontend/vite.log`         | Vite output.                                     |
| `.local-development/frontend/browser-open.log` | Host browser opener diagnostics.                 |
| `.local-development/frontend/identity.json`    | CLI tenant and user selection.                   |
| `.local-development/frontend-token`            | Local token used when starting Vite.             |

Token files have private permissions. Status and log APIs do not return the
stored token. Infrastructure data, dependency directories, the pnpm store, and
browser caches use Docker volumes and survive ordinary stops.

## Troubleshooting

### A startup phase fails

Open **Fullstack status** for the failing phase and its backend operation details.
Inspect frontend output in the log files above. For a Vite startup error, read
`.local-development/frontend/vite.log` first. Fix the reported cause, then run
`pnpm local:start`. An interrupted operation also requires an explicit retry.

### The dashboard does not open automatically

Automatic opening requires the trusted workspace's **Full stack: startup logs**
task. Enable it through **Tasks: Manage Automatic Tasks**, or run it through
**Tasks: Run Task**. The host opener uses `xdg-open` on Linux, `open` on macOS,
or Windows PowerShell from WSL2. Inspect `browser-open.log` if opening fails.

A VS Code window reload can restore the log task without a new initialization
request. Open <http://localhost:8076/#/status> manually in that case. The terminal
also prints the URL.

### The frontend URL serves the wrong application

Remove saved or manual VS Code forwards for port `3000` that shadow Docker's
publication. The frontend listens on `5173` inside its container. The backend
catalog also uses internal port `3000`, but in the dashboard container, with
host port `13000`.

### Internal Vite works but the public URL does not

Inside the frontend container, compare these read-only requests:

```bash
curl --fail http://localhost:5173/ui/it/
curl --fail http://host.docker.internal:3000/ui/it/
curl --fail http://dashboard:8076/health
curl --fail http://dashboard:3600/backend-for-frontend/0.0/status
```

The first two return the frontend HTML shell. If only the internal request
succeeds, inspect Docker's port publication and host connectivity. For Windows
mounts, HMR, and browser routing, use the
[WSL2 troubleshooting guide](local-full-stack-windows.md#troubleshooting-by-symptom).
