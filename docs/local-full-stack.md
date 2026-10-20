# Local full-stack development

The backend owns the standalone dashboard at <http://localhost:8076>. A separate
frontend container runs VS Code, Vite and frontend checks. It mounts both
checkouts for editing and serves <http://localhost:3000/ui/it/>. The dashboard works
without the frontend checkout or container and remains available when Vite stops.
The frontend Compose overlay enables the optional full-stack status page at
<http://localhost:8076/#/status>, including frontend startup phases and logs.
Standalone backend configuration stays unchanged.

## Prerequisites

- Docker Engine or Docker Desktop with Linux containers
- Sibling frontend and `interop-be-monorepo` checkouts containing the dashboard changes
- Linux, macOS, or Windows with WSL2; see the [Windows guide](local-full-stack-windows.md)
- VS Code and Dev Containers only for editing inside the frontend container

Host Node/pnpm is optional. Each image installs its own dependencies into named
volumes. The frontend has its own pnpm store and Playwright browser cache. Its
container does not install backend dependencies or expose the Docker socket.
The backend dashboard retains Docker access for infrastructure commands.

## First start

From the frontend checkout, without opening VS Code:

```bash
bash scripts/local-development/fullstack.sh start
```

The host initializer prepares a missing backend Compose configuration and the
machine-specific frontend overlay at `.local-development/frontend/compose.yml`.
The versioned `.devcontainer/compose.yml` contains the fixed frontend service and
dashboard override settings; the generated overlay supplies absolute workspace
and build paths, the frontend root, UID/GID, and the workspace-dependent mounts.
An existing backend-only overlay and its startup settings are preserved. Compose starts
`dashboard` and `frontend` on the same network; only the frontend image is rebuilt
by routine frontend starts. The versioned frontend overlay disables backend
autostart for this composition: the dashboard API coordinates the complete startup
when the frontend agent requests it.
The standalone backend overlay retains its original autostart setting.
If a standalone dashboard is already running, the host launcher reconciles its
Compose configuration once to enable the frontend integration, without rebuilding
its image. Later starts reuse the dashboard when that configuration is unchanged.
The frontend container starts as soon as the dashboard container is running,
so VS Code can attach during backend setup. Its launcher waits for the dashboard
HTTP API before requesting fullstack startup.

The frontend entrypoint starts a small agent and requests startup from the dashboard
API. The API coordinates dependency and Chromium installation in the frontend,
infrastructure start, the `frontend-full` backend preset, the idempotent seed,
identity selection, Vite and smoke/browser checks. The agent executes frontend
commands and saves the token privately in the frontend checkout.
The default identity is `comune` / `admin`; subsequent starts retain CLI selections.

The host command waits for completed setup and checks. Backend operations and
logs appear in the dashboard. Frontend setup and failures appear in the frontend
container logs and `.local-development/frontend/startup.log`; Vite logs are in
`.local-development/frontend/vite.log`. Failed setup leaves the frontend container
alive for inspection and manual retry; it does not automatically retry the seed.

For VS Code, open `interop-pdnd-fullstack.code-workspace` from the host/WSL terminal
(`code interop-pdnd-fullstack.code-workspace`), then choose
**Dev Containers: Reopen in Container**. VS Code attaches to `frontend` and uses
the same automatic setup. This single workspace shows frontend and backend as
two roots and also works on the host.

Initialization creates `.local-development/interop-be-monorepo`, a symbolic link
to the actual backend checkout. Both repositories stay in their sibling directories;
the workspace uses the link so its folder paths stay within the workspace file's
directory, avoiding Dev Containers' shared-root warning. Both actual source paths
are mounted in the container. On a fresh checkout, the backend root becomes
available after initialization creates the link and clones the backend if needed.
For host-only editing before the first container start, run
`bash .devcontainer/initialize.sh` once to prepare it.

The **Full stack: startup logs** task automatically presents a terminal with frontend installation/startup output
and incremental backend orchestration logs, including infrastructure setup. It
waits for the dashboard API if necessary and observes the existing startup.
This task works when opening the frontend folder as well as the full-stack
workspace; outside the frontend devcontainer it exits without starting anything,
even when frontend runtime mode is set.
VS Code Workspace Trust must allow tasks. If automatic tasks were disabled,
use **Tasks: Manage Automatic Tasks** or **Tasks: Run Task** to show the log terminal.

Devcontainer initialization prepares a one-time browser request on the host.
After dashboard HTTP health succeeds, the automatic terminal task signals that
request and the host opens <http://localhost:8076/#/status> in its default browser.
This preserves Docker's published port: VS Code's remote browser command would
create a tunnel and could change the port to `8077`. The page opens while the
remaining frontend startup phases continue. The status page contains the startup
timeline, frontend logs and **Open frontend**, available as soon as Vite is running.

The host opener uses `xdg-open` on Linux, `open` on macOS or Windows PowerShell
from WSL2. A new initialization supersedes an older pending request; requests
expire after 30 minutes. A window reload that only restores the existing task
does not prepare a new request: use the URL printed in the terminal in that case.
If automatic opening is unavailable, log streaming continues. Host opener errors
are recorded in `.local-development/frontend/browser-open.log`.
Ports keep their existing Docker publication without automatic VS Code forwarding.
Closing the editor leaves both
containers running. Fix setup errors inside the container and retry
`pnpm local:start`.

Existing checkouts and local changes are preserved. A missing backend is cloned
from `develop`, which must contain the dashboard changes.

For the standalone dashboard, run the backend launcher without frontend arguments,
or `bash scripts/local-development/dashboard.sh` from the frontend host checkout.
This starts only the dashboard, without Vite.

A legacy backend overlay that mounts the frontend must be migrated explicitly:
stop that old runtime and run the backend's `dashboard.sh start` without
frontend arguments to rebuild its image before starting the new frontend container. Initialization reports
the legacy configuration instead of silently replacing a running backend.

## Commands

Run these from the frontend checkout, on the host or in its devcontainer:

| Command                                  | Effect                                                                                        |
| ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| `pnpm local:start`                       | Starts frontend and its backend preset, seeds, obtains a token and runs checks                |
| `pnpm local:stop`                        | Stops Vite and the frontend-full backend preset; keeps containers, infrastructure and volumes |
| `pnpm local:status`                      | Prints backend status and the owned frontend process state                                    |
| `pnpm local:dashboard`                   | Starts or waits for the standalone dashboard and prints its URL                               |
| `pnpm local:logs`                        | Prints recent backend logs                                                                    |
| `pnpm local:logs -- frontend`            | Prints frontend Vite logs                                                                     |
| `pnpm local:reset`                       | Stops Vite and explicitly confirms destructive local infrastructure reset                     |
| `pnpm local:use:local`                   | Obtains the selected local token and restarts Vite against the local BFF                      |
| `pnpm local:use:dev`                     | Restarts Vite against shared development without local token injection                        |
| `pnpm local:identity -- comune reviewer` | Resolves tenant/user keys through the API and restarts Vite with their token                  |

Host lifecycle commands enter the frontend container through Compose. Inside it,
the client forwards lifecycle actions to the dashboard API; the frontend agent
manages only its own Vite process group. Repeated
starts also restart a stopped frontend in an existing container. Overlapping
fullstack operations are rejected by the API. Frontend commands also use a Linux
kernel lock, which is released when the command exits.
Refreshing a token restarts Vite so its environment receives the new token.
Every lifecycle command records fresh phase results; stopped Vite cannot retain
a successful readiness status. Retrying startup clears previous phase errors.
If the dashboard restarts during an operation, the CLI reports the lost operation
and asks for an explicit retry instead of continuing to wait for obsolete progress.

The frontend agent listens on internal port `8077` before dependency installation
or backend waits. The dashboard reads `GET /status` and
`GET /logs?source=startup|vite`, and submits allowlisted commands to `POST /commands`
over Compose DNS. This port is not published on the host. Status includes the
selected tenant/user keys; tokens and process ownership are never exposed by reads.
Log responses contain at most the last 64 KiB. The agent closes with the frontend
runtime. Fullstack progress and backend operations belong to the dashboard API.

After reset, run `pnpm local:start` to seed and start again. Reset removes local
event store, SQL readmodels, DynamoDB, Kafka, Redis, RustFS and backend seed state;
both Git checkouts are preserved. Ordinary frontend stop leaves unrelated
backend packages alone. The dashboard controls other backend packages, watch
mode, presets and infrastructure.

Run `pnpm local:smoke` and `pnpm local:test:e2e` **inside the frontend container**,
which contains their dependencies and browser installation. Rebuild through the
host launcher or Dev Containers after image/container configuration changes.

## Local identities

Tenants: `comune`, `provider`, `impresa`, `certificatore`.
Users: `admin`, `api`, `security`, `reviewer`, `viewer`.

Use the header party switcher or
<http://localhost:3000/ui/it/local-identity-selection/>. Selection persists across
reloads. After reset, the application restores tenant/user using stable
Selfcare/user IDs and requests a new token. While seed or the identity API is
unavailable, it retains the saved session and retries. Removed identities return
to the selection page.

Vite proxies the identity API on the frontend origin. For CLI lifecycle actions,
the dashboard resolves user IDs from `users[].key` and sends the token to the
frontend agent. Tokens are saved privately in the
frontend's ignored `.local-development/frontend-token`, never read from backend
files. `SELFCARE_LOGIN_URL` defaults to the public local identity page.

The seed creates `Catalogo Demo`, owned by `Provider Demo`, and demo tenants and
role-specific users. Confirm the catalog and identity in the application.

## Networking and troubleshooting

Docker publishes frontend host port `3000` to frontend-container Vite port
`5173`. Dashboard port `8076` is independent. Vite calls `dashboard:3600` for the
BFF and `dashboard:8076` for identities through Compose DNS. These are internal
addresses, not browser URLs. The backend catalog runs on port `3000` in a
different container. The public browser origin and HMR remain
`http://localhost:3000`.

Host dashboard targets must use local HTTP loopback origins. The frontend
container also accepts the exact Compose hostname `dashboard`.
`INTEROP_DASHBOARD_URL` selects the API/proxy origin;
`INTEROP_LOCAL_BACKEND_TARGET` and `INTEROP_SELFCARE_URL` select internal smoke
targets. Normal `pnpm dev` and production builds do not enable the identity proxy.

VS Code automatic and restored forwarding are disabled. Remove old manual
forwards of `3000` or infrastructure ports that shadow Docker publications.
Vite uses `--strictPort`, and the launcher rejects an occupied internal `5173`
before spawning a process.

The Playwright wrapper retains the public `localhost:3000` browser origin while
connecting through the Docker host gateway. Node HTTP publication checks use
`host.docker.internal:3000`; dashboard checks use Compose DNS. Keep scripts
LF-terminated and source in WSL's Linux filesystem. Windows acceptance remains
separate: Linux checks do not certify WSL2 mounts or networking.
