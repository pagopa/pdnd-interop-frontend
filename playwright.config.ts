import { defineConfig, devices } from '@playwright/test'

const hostGateway = process.env.PLAYWRIGHT_HOST_GATEWAY

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: {
    timeout: 30_000,
  },
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: hostGateway
          ? { args: [`--host-resolver-rules=MAP localhost ${hostGateway}`] }
          : undefined,
      },
    },
  ],
})
