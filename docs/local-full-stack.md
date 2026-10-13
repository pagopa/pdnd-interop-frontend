# Local full-stack development

The backend owns the standalone development dashboard at
<http://localhost:8076>. One Docker Compose runtime supervises the backend
processes and Vite when the frontend checkout is mounted and started. The frontend is available at
<http://localhost:3000/ui/it/>. The dashboard remains available when Vite or a
backend process stops.

## Prerequisites

- Docker Engine or Docker Desktop with Linux containers
- Sibling checkouts of this frontend and `interop-be-monorepo` containing the
  development dashboard changes
- Linux, macOS, or Windows with WSL2; see the [Windows guide](local-full-stack-windows.md)
- VS Code and Dev Containers only if you want to attach an editor to the runtime

Node, pnpm, Docker CLI, Chromium and the process supervisor run inside the
backend image. Host Node/pnpm and VS Code are not needed to start the stack.
Dependency directories, the pnpm store and browser cache use named Docker
volumes. Source repositories retain their absolute host paths in the container.
The runtime accesses the host Docker socket; use trusted repositories.

## First start

From the backend checkout, without opening VS Code:

```bash
bash scripts/local-development/dashboard.sh start --frontend "$(realpath ../pdnd-interop-frontend)" --preset frontend-full
```

Open <http://localhost:8076> to follow dependency installation, infrastructure,
backend compilation and readiness, seed, token generation, frontend startup,
smoke checks and browser checks. Inspect failed operation phases and logs there.
Open <http://localhost:3000/ui/it/> when full-stack startup has passed.

Alternatively, open `interop-pdnd-fullstack.code-workspace` and run
**Dev Containers: Reopen in Container**. Initialization prepares the same
backend Compose configuration; VS Code attaches to its `dashboard` service.
There are no editor startup tasks, duplicate dependency installations or tmux
sessions. Closing VS Code leaves the runtime running.
If the sibling backend checkout is missing, initialization clones `develop`;
the dashboard changes must be available on the selected backend branch.
Existing checkouts and their local changes are preserved.

For backend-only development, start the dashboard from the backend without
`--frontend`. Mounting the frontend checkout makes its controls available;
`--preset frontend-full` selects automatic full-stack startup. Without a startup
preset, the runtime prepares only infrastructure, even with the frontend mounted.
Reconfigure through the backend launcher when changing checkout mounts.

## Commands

Inside the shared runtime, from the frontend checkout:

| Command                                  | Effect                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| `pnpm local:start`                       | Starts the full stack and waits for its operation to pass or fail        |
| `pnpm local:status`                      | Prints dashboard package, infrastructure and operation status            |
| `pnpm local:dashboard`                   | Prints the independent dashboard URL                                     |
| `pnpm local:logs`                        | Prints the latest combined logs                                          |
| `pnpm local:logs -- frontend`            | Prints the latest frontend logs                                          |
| `pnpm local:stop`                        | Stops application processes; keeps dashboard, infrastructure and volumes |
| `pnpm local:reset`                       | Explicitly confirms destructive local infrastructure reset               |
| `pnpm local:use:local`                   | Restarts Vite against the local BFF                                      |
| `pnpm local:use:dev`                     | Restarts Vite against the development environment                        |
| `pnpm local:identity -- comune reviewer` | Generates a local token and restarts Vite                                |
| `pnpm local:smoke`                       | Checks frontend, BFF, Selfcare, seed and infrastructure                  |
| `pnpm local:test:e2e`                    | Runs the frontend browser checks                                         |

The dashboard also controls single backend processes, watch mode, infrastructure
and shared/personal presets. A reset removes local infrastructure data and
generated seed state; it does not delete either Git checkout. Use infrastructure
stop in the dashboard when you want to stop those containers as well.

The frontend CLI delegates to the dashboard API. It does not launch its own
supervisor. `INTEROP_DASHBOARD_URL` can override the API origin for local tools
and Vite; only loopback HTTP origins are accepted. Normal `pnpm dev` and
production builds do not enable this proxy.

## Local identities

Tenants: `comune`, `provider`, `impresa`, `certificatore`.
Users: `admin`, `api`, `security`, `reviewer`, `viewer`.

Use the header party switcher or
<http://localhost:3000/ui/it/local-identity-selection/>. The selection persists
across reloads. After an infrastructure reset, the frontend restores the same
tenant and user using stable Selfcare/user IDs and requests a new local token.
While the seed or identity API is unavailable, it retains the saved session and
retries. If the identity was removed, the selection page opens.

The dashboard provides the identity API; Vite proxies it on the frontend origin.
Local identity selection uses its own development flag and does not depend on a
dashboard route in the SPA. `SELFCARE_LOGIN_URL` defaults to the local identity
page and can be overridden for a different public frontend origin.
Token files remain in the ignored backend `.local-development` directory.

The idempotent seed creates `Catalogo Demo`, owned by `Provider Demo`, and the
demo tenants and role-specific users. Confirm the catalog and selected identity
in the application after startup.

## Networking and troubleshooting

Docker publishes frontend host port `3000` to runtime Vite port `5173`, and
dashboard port `8076` independently. The backend catalog uses runtime
`localhost:3000`; that internal address is not the frontend. Vite proxies the
local BFF on `localhost:3600`. HMR uses public browser port `3000`.
Vite runs with `--strictPort` and fails when `5173` is occupied.
Infrastructure relays are managed by the backend runtime.

VS Code automatic forwarding and restored forwards are disabled. Remove old
manual forwards of `3000` or infrastructure ports; they can shadow Docker's
public bindings. Use the published URLs from the host browser.

Use dashboard operation errors and service logs first. Retry the failed
operation after resolving its cause. Restart/rebuild through the backend
launcher after runtime image or workspace package changes. Named volumes survive
ordinary stops; fresh volumes can require a longer first dependency install.

Keep shell scripts LF-terminated in both repositories. Windows users should
store source in the WSL Linux filesystem and use the wrapper
`pnpm local:test:e2e` to preserve the published frontend's browser origin.
Windows validation remains a separate target; Linux tests do not certify WSL2
bind mounts or networking.
