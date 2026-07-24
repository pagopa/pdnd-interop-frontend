const STARTUP_CHECKS = [
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    running: '[3/7]',
    passed: 'Local infrastructure is ready',
  },
  {
    id: 'backend',
    label: 'Backend',
    running: 'Waiting for tenant process',
    passed: '[4/7] Backend services are ready',
  },
  { id: 'seed', label: 'Seed', running: '[5/7]', passed: 'Seed completed successfully' },
  { id: 'token', label: 'Local token', running: '[6/7]', passed: '[7/7]' },
  { id: 'frontend', label: 'Frontend', running: '[7/7]', passed: 'Frontend ready' },
  {
    id: 'smoke',
    label: 'Smoke checks',
    running: 'Running the full-stack smoke checks',
    passed: 'Local full-stack smoke checks passed',
  },
  {
    id: 'browser',
    label: 'Browser checks',
    running: 'Running the frontend browser checks',
    passed: 'FULL STACK READY',
  },
]

export function deriveOverallState({ startupState, processes, infrastructure }) {
  if (startupState !== 'ready') {
    return startupState
  }

  const hasStoppedProcess = processes.some(({ state }) => state !== 'running')
  const hasStoppedInfrastructure = infrastructure.some(({ state }) => state !== 'running')

  return hasStoppedProcess || hasStoppedInfrastructure ? 'degraded' : 'ready'
}

export function deriveStartupChecks(startupState, startupLog) {
  const checks = STARTUP_CHECKS.map((check) => ({
    id: check.id,
    label: check.label,
    state: startupLog.includes(check.passed)
      ? 'passed'
      : startupLog.includes(check.running)
        ? 'running'
        : 'pending',
  }))

  if (startupState === 'ready') {
    return checks.map((check) => ({ ...check, state: 'passed' }))
  }

  if (startupState === 'failed') {
    const failedIndex = checks.findLastIndex(({ state }) => state === 'running')
    if (failedIndex >= 0) {
      checks[failedIndex] = { ...checks[failedIndex], state: 'failed' }
    }
  }

  return checks
}

export function parseProcessRegistry(content, isRunning) {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const separator = line.lastIndexOf(' ')
      const name = line.slice(0, separator)
      const pid = Number(line.slice(separator + 1))
      if (separator < 1 || !Number.isInteger(pid)) {
        return []
      }

      return [{ name, pid, state: isRunning(pid) ? 'running' : 'stopped' }]
    })
}

export function parseComposeServices(output) {
  const trimmed = output.trim()
  if (!trimmed) {
    return []
  }

  let records
  if (trimmed.startsWith('[')) {
    records = JSON.parse(trimmed)
  } else {
    records = trimmed
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line))
  }

  return records.map((record) => ({
    name: record.Service,
    container: record.Name,
    state: record.State,
    health: record.Health || null,
  }))
}

export function searchLogEntries(
  logs,
  { query, level: selectedLevel, service: selectedService, limit }
) {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const normalizedLevel = selectedLevel.trim().toLocaleUpperCase()
  const normalizedService = selectedService.trim().toLocaleLowerCase()
  const entries = []

  for (const log of logs) {
    const lines = log.content.split('\n')
    let offset = log.startOffset ?? 0
    lines.forEach((message, index) => {
      const lineOffset = offset
      offset += Buffer.byteLength(message) + 1
      if (!message || (normalizedQuery && !message.toLocaleLowerCase().includes(normalizedQuery))) {
        return
      }

      const timestamp = message.match(/^\d{4}-\d{2}-\d{2}T[^ ]+/)?.[0] ?? null
      const level = message.match(/\b(TRACE|DEBUG|INFO|WARN|ERROR|FATAL)\b/)?.[1] ?? null
      const service =
        message.match(/\b(?:TRACE|DEBUG|INFO|WARN|ERROR|FATAL) \[([^\]]+)\]/)?.[1] ?? null
      const correlationId = message.match(/\[CID=([^\]]+)\]/)?.[1] ?? null
      if (normalizedLevel && level !== normalizedLevel) {
        return
      }
      if (normalizedService && service?.toLocaleLowerCase() !== normalizedService) {
        return
      }

      entries.push({
        source: log.source,
        line: index + 1,
        offset: lineOffset,
        timestamp,
        level,
        service,
        correlationId,
        message,
      })
    })
  }

  return entries.slice(-limit).reverse()
}
