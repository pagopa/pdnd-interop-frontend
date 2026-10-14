# Local full stack on Windows / WSL2

Use Windows VS Code connected to an Ubuntu WSL2 distribution, with Docker
Desktop's Linux engine integrated into that distribution. The Bash scripts run
in WSL during initialization and in the Linux devcontainer afterwards. Native
PowerShell, Git Bash, Windows containers, and a remote Docker daemon are not the
supported startup path.

The changes for [PIN-11061](https://pagopa.atlassian.net/browse/PIN-11061) are
developed on Ubuntu. Linux regression checks do not certify Windows networking,
Docker Desktop bind mounts, or Windows browser access. The acceptance procedure
below must still be completed on a Windows machine; troubleshooting scenarios
are possible causes, not failures reproduced on this project under WSL2.

## Prepare Windows and WSL

1. Install/update WSL and an Ubuntu distribution. In PowerShell, inspect
   `wsl --version` and `wsl --list --verbose`: Ubuntu must use version **2**.
   Keep WSL current; Docker documents a minimum WSL version of 2.1.5.
2. Enable **Use WSL 2 based engine** in Docker Desktop and enable Ubuntu under
   **Settings > Resources > WSL Integration**. Use Linux containers. Avoid
   running a second Docker Engine inside Ubuntu alongside Docker Desktop.
3. Install VS Code on Windows with **WSL** and **Dev Containers** extensions.
4. Provide the existing full-stack resource budget: at least 8 CPU and 12 GB RAM
   available to the Linux environment, with room for Windows itself. WSL VM
   memory/CPU limits are configured through Windows `.wslconfig`; do not assume
   the host's installed RAM is all available to the container.

See [Docker's WSL backend requirements](https://docs.docker.com/desktop/features/wsl/)
and [WSL resource settings](https://learn.microsoft.com/en-us/windows/wsl/wsl-config#main-wsl-settings).

In the Ubuntu terminal, check the integration before opening VS Code:

```bash
git --version
docker context show
docker version
docker info --format '{{.OSType}}'
docker compose version
```

The Docker client must reach a server and report `linux`. Both WSL and the
devcontainer must use the same local Docker Desktop daemon. Check unexpected
`DOCKER_HOST` / `DOCKER_CONTEXT` overrides rather than selecting an unrelated
remote context to make a command pass.

## Clone into the Linux filesystem

Keep the repositories as siblings in the **same WSL distribution**, for example:

```text
/home/<user>/dev/
  pdnd-interop-frontend/
  interop-be-monorepo/
```

Clone with Linux Git in Ubuntu, not Windows Git into `C:\` or `/mnt/c`:

```bash
mkdir -p ~/dev
cd ~/dev
git -c core.autocrlf=false clone https://github.com/pagopa/pdnd-interop-frontend.git
git -c core.autocrlf=false clone https://github.com/pagopa/interop-be-monorepo.git
git -C pdnd-interop-frontend config core.autocrlf false
git -C interop-be-monorepo config core.autocrlf false
cd pdnd-interop-frontend
```

Before opening the container, check out the frontend branch containing this
devcontainer and a backend branch containing the PIN-10657 local-runtime
scripts. While that backend work is unmerged, use
`feature/PIN-10657_frontend-local-runtime`. Verify that the backend
`package.json` includes `local:start:frontend-full`. Initialization
preserves an existing backend checkout; if it is missing, it clones `develop`,
which is sufficient only after the local-runtime changes have landed there.

Once both branches are selected, open the workspace from this WSL terminal:

```bash
code interop-pdnd-fullstack.code-workspace
```

VS Code must show **WSL: Ubuntu** before **Dev Containers: Reopen in Container**.
Then follow [First start](local-full-stack.md#first-start). After reopening,
the terminal runs in the devcontainer, not the WSL host.

Storing bind-mounted source on Linux avoids slow Windows filesystem crossings
and missing file-change events. Dependency directories and the pnpm store use
named Docker volumes. Do not work around filesystem problems by enabling
polling everywhere or copying Windows `node_modules` into the container.
See [Docker's WSL filesystem guidance](https://docs.docker.com/desktop/features/wsl/best-practices/).

Keep shell scripts LF-terminated and executable in **both** repositories. The
frontend attributes enforce LF for its shell scripts; they cannot change the
backend checkout. For an existing checkout, inspect `git ls-files --eol` and
`git diff` before repairing affected files. Disabling `core.autocrlf` alone does
not repair files already checked out as CRLF. Avoid blanket renormalization or
checkout commands that discard local work.

## Understand the ports and mounts

| Caller | Destination | Purpose |
| --- | --- | --- |
| Windows browser | `http://localhost:3000/ui/it/` | Frontend through Docker's host `3000` → devcontainer `5173` mapping |
| Windows browser | `http://localhost:3000/ui/local-dashboard/` | Startup, services, and logs dashboard through the same mapping |
| Vite inside devcontainer | `http://localhost:3600` | Local BFF API proxy; the browser never needs a separate BFF port |
| Backend inside devcontainer | `localhost:<infrastructure-port>` | `socat` relay to `host.docker.internal:<port>`, then Docker's published infrastructure service |
| Internal backend callers | `localhost:3000` inside devcontainer | Catalog process, **not** the frontend |
| Vite HMR in browser | WebSocket on `localhost:3000` | Same public frontend port; Vite listens internally on `5173` |

Do not forward catalog port `3000`, BFF ports, or infrastructure ports through
VS Code. Docker already owns the public bindings. The existing Vite `5173`
forward can appear in the Ports view, but the documented browser origin remains
`http://localhost:3000`. Remove any saved/manual `3000` forward that shadows the
Docker mapping. Do not replace the browser hostname with a container IP or
`host.docker.internal`; the app's local login and HMR use the public origin.

Vite starts with `--strictPort`: if internal port `5173` is occupied, startup
fails instead of silently selecting `5174`, which Docker does not publish.
Stop the conflicting Vite process and restart the local frontend.

`localhost` names the machine/network namespace of the caller. WSL NAT and
mirrored networking do not turn a container's loopback into Windows loopback.
The setup uses Docker-published ports and does not require mirrored networking,
host networking, static WSL IPs, or a `netsh portproxy` rule. Mirrored mode,
VPNs, and firewall policies can affect connectivity; diagnose the failing hop
before changing machine-wide settings. See [Microsoft's WSL networking guide](https://learn.microsoft.com/en-us/windows/wsl/networking)
and [Docker Desktop networking](https://docs.docker.com/desktop/features/networking/networking-how-tos/).

The devcontainer retains the repositories' absolute WSL paths because backend
Compose uses files from the backend checkout. Bind sources are resolved by the
Docker daemon, not by the process calling Compose inside the devcontainer.
If a SQL/config mount is missing or becomes an empty directory, compare the
source path in `docker compose -f ../interop-be-monorepo/docker/docker-compose.yml config`
with the devcontainer's mounts from `docker inspect <container-id>`. Also check
that the same files exist in WSL. Do not replace the workspace target with
`/workspaces/...` without adapting these source paths. Historical Docker Desktop
versions have had [nested WSL bind-mount issues](https://github.com/devcontainers/features/issues/919);
update Docker Desktop and record its version before applying platform-specific
path workarounds.

After startup, these read-only checks inside the devcontainer isolate the hops:

```bash
getent ahostsv4 host.docker.internal
curl --fail http://localhost:5173/ui/it/
curl --fail http://host.docker.internal:3000/ui/it/
curl --fail http://localhost:3600/backend-for-frontend/0.0/status
```

The two frontend requests must return the PDND HTML shell. From PowerShell,
`curl.exe --fail http://localhost:3000/ui/it/` checks the Windows-side hop.
If internal Vite works but the published URL fails, inspect Docker publication
and host connectivity before investigating React or the API proxy.

## Browser tests and debugging

Run `pnpm local:test:e2e` in the devcontainer after startup reports `READY`.
The default is headless Chromium; no Windows browser installation, display
server, or WSLg integration is required. Setup installs Playwright's matching
Chromium separately from the system Chromium used by Puppeteer.

Chromium and Playwright's Node HTTP client resolve addresses separately.
Chromium's host resolver override preserves the `localhost:3000` browser origin
while connecting to the Docker host. The published-frontend HTTP check uses a
host-reachable URL instead of container `localhost:3000`, which would hit the
catalog service. Run the wrapper even when filtering a test; invoking Playwright
directly skips its environment preparation.

Automatic Docker-host routing applies only when `INTEROP_DEVCONTAINER=true`
and the browser base URL is the default `http://localhost:3000`. Native host
runs use localhost directly, even if the Docker hostname happens to resolve.
A custom `PLAYWRIGHT_BASE_URL` selects a different origin without automatic
gateway rewriting. Explicit `PLAYWRIGHT_HOST_GATEWAY` (Chromium's destination
IP) and `PLAYWRIGHT_PUBLIC_FRONTEND_URL` (the Node HTTP check's full URL) are
preserved; set both when manually overriding an unavailable Docker hostname.
Normally none of these overrides is needed inside the configured devcontainer.

`--headed` and `--debug` need a working display **inside the container**. WSLg
on the WSL host does not automatically configure display sockets and permissions
in this devcontainer. An Xvfb display can run headed tests without showing a
Windows window, but is not an interactive Inspector. Prefer the default headless
run and its retained failure traces until display forwarding is configured.
See [Playwright debugging](https://playwright.dev/docs/debug) and
[headed Linux execution](https://playwright.dev/docs/ci#running-headed).

For interactive inspection in the Windows browser without a container display,
start [Playwright UI mode](https://playwright.dev/docs/test-ui-mode#docker--github-codespaces):

```bash
pnpm local:test:e2e --ui-host=0.0.0.0 --ui-port=8077
```

Manually forward **only port 8077** in VS Code's Ports view, keeping the local
binding on loopback, then open the forwarded URL in Windows. Automatic
forwarding is intentionally disabled for additional ports. Close this forward
when finished; do not publish the test UI to the LAN. Tests still run in the
container and use the same wrapper networking settings. This optional mode also
needs verification on Windows.

## Troubleshooting by symptom

| Symptom | Check |
| --- | --- |
| Initialization cannot execute Bash / paths contain `C:\` | Reopen the workspace in WSL first; do not initialize from a native Windows terminal. |
| `bash\r`, `bad interpreter`, or `Permission denied` | Check CRLF and executable bits in the affected repo; use a Linux clone and preserve tracked permissions. |
| Docker socket unavailable / Windows container image mismatch | Check Docker Desktop Linux mode, WSL integration for this distro, and daemon/context selection. |
| Mount path missing / a file is reported as a directory | Check sibling repo paths and nested bind mounts as described above; do not recreate database volumes to fix a source path. |
| Install/build is very slow or killed | Check WSL memory/CPU/disk budget, Windows filesystem mounts, and dependency volumes. The first install/build is heavier than a restart. |
| Windows UI returns a catalog error such as missing correlation header | Stop a VS Code forward of container `3000`; inspect Docker's `3000:5173` publication. |
| Port binding fails although no process is apparent | Check Docker containers and Windows listeners; `Get-NetTCPConnection -LocalPort 3000` and `netsh interface ipv4 show excludedportrange protocol=tcp` in PowerShell can reveal listeners or reserved ranges. Do not delete system reservations blindly. |
| UI works but APIs fail | Confirm local mode, BFF readiness on container `3600`, infra relays, and dashboard service logs. |
| UI loads but edits do not reload | Check DevTools WebSocket connection to `localhost:3000`, source location, and Vite logs. A forward to `5173` does not replace HMR's configured public port. |
| WSL can connect but Windows cannot | Check Docker publication, Windows firewall/Hyper-V policy, VPN, and current NAT/mirrored mode. Microsoft documents [mirrored-mode Docker publication problems](https://learn.microsoft.com/en-us/windows/wsl/troubleshooting#docker-container-issues-in-wsl2-with-mirrored-networking-mode-enabled-when-running-under-the-default-networking-namespace); consult the current networking troubleshooting section before changing modes. |
| Browser tests hit the catalog / cannot resolve Docker host | Run the wrapper in the devcontainer; inspect `getent ahostsv4 host.docker.internal` and test the published frontend separately. Chromium DNS flags do not affect the Node request client. |
| Headed browser reports a missing X server | Use headless execution or explicitly configure a container display; installing a Windows browser does not fix a Linux display. |

## Windows acceptance procedure (pending execution)

Record Windows, WSL, Docker Desktop, VS Code/Dev Containers versions, networking
mode, both Git revisions, and whether a VPN is active. Do not mark this procedure
passed based only on Ubuntu tests.

1. Create/rebuild from the WSL filesystem following the steps above. Confirm
   dependency volumes mount, setup succeeds, and the dashboard reaches `READY`.
2. In Windows Edge/Chrome, open both documented URLs on `localhost:3000`.
   Confirm the dashboard shows services and logs, and the UI shows `Comune Demo`
   and the seeded `Catalogo Demo` e-service.
3. Switch tenant/user through the local identity page. Confirm API calls use
   the local Vite proxy successfully and browser requests do not go to shared dev.
4. Make a temporary visible frontend edit. Confirm HMR updates the Windows
   browser through port `3000`, then undo only that edit.
5. Run `pnpm local:smoke` and `pnpm local:test:e2e` inside the devcontainer.
   Both the Node HTTP publication check and Chromium UI checks must pass.
6. Stop/start the local stack and reopen the container. Confirm existing seed
   data remains usable and no stale VS Code forwards steal port `3000` or the
   infrastructure ports. Recheck HMR and the two browser URLs.

Repeat the relevant connectivity checks if using a VPN or mirrored networking;
record those as separate configurations. Native Linux remains a separate
regression target, not a substitute for this Windows run.
