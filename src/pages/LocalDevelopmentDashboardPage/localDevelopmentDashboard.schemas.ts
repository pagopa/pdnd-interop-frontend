import { z } from 'zod'

export const runtimeStateSchema = z.enum([
  'disabled',
  'stopped',
  'starting',
  'running',
  'pending',
  'passed',
  'ready',
  'healthy',
  'degraded',
  'failed',
  'exited',
])

const startupCheckSchema = z.object({
  id: z.string(),
  label: z.string(),
  state: runtimeStateSchema,
})

const processSchema = z.object({
  name: z.string(),
  pid: z.number().int(),
  port: z.number().int().nullable(),
  state: runtimeStateSchema,
})

const infrastructureSchema = z.object({
  name: z.string(),
  container: z.string(),
  state: runtimeStateSchema,
  health: z.string().nullable(),
})

export const localDevelopmentStatusSchema = z.object({
  timestamp: z.string(),
  overall: runtimeStateSchema,
  startup: z.object({
    state: runtimeStateSchema,
    checks: z.array(startupCheckSchema),
  }),
  sessions: z.array(
    z.object({
      name: z.string(),
      state: runtimeStateSchema,
    })
  ),
  processes: z.array(processSchema),
  infrastructure: z.array(infrastructureSchema),
  logs: z.array(
    z.object({
      source: z.string(),
      size: z.number(),
      updatedAt: z.string().nullable(),
    })
  ),
})

const logEntrySchema = z.object({
  source: z.string(),
  line: z.number().int(),
  offset: z.number().int().nonnegative(),
  timestamp: z.string().nullable(),
  level: z.string().nullable(),
  service: z.string().nullable(),
  correlationId: z.string().nullable(),
  message: z.string(),
})

export const localDevelopmentLogsSchema = z.object({
  query: z.string(),
  source: z.string().nullable(),
  level: z.string().nullable().optional(),
  service: z.string().nullable().optional(),
  results: z.array(logEntrySchema),
  cursors: z.record(z.string(), z.number().int().nonnegative()),
  resetSources: z.array(z.string()).default([]),
})

export type RuntimeState = z.infer<typeof runtimeStateSchema>
export type LocalDevelopmentStatus = z.infer<typeof localDevelopmentStatusSchema>
export type LocalDevelopmentLogs = z.infer<typeof localDevelopmentLogsSchema>
export type LocalDevelopmentLogEntry = z.infer<typeof logEntrySchema>
