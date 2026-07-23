import React, { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import SearchIcon from '@mui/icons-material/Search'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import i18n from 'i18next'
import { useTranslation } from 'react-i18next'
import localDevelopmentDashboardEnNs from '@/static/locales/en/local-development-dashboard.json'
import localDevelopmentDashboardItNs from '@/static/locales/it/local-development-dashboard.json'
import {
  localDevelopmentStatusSchema,
  type RuntimeState,
} from './localDevelopmentDashboard.schemas'
import { useIncrementalLogs } from './useIncrementalLogs'
import VirtualizedLogList from './VirtualizedLogList'

type InventoryView = 'processes' | 'infrastructure'

const translationNamespace = 'local-development-dashboard'

i18n.addResourceBundle('it', translationNamespace, localDevelopmentDashboardItNs)
i18n.addResourceBundle('en', translationNamespace, localDevelopmentDashboardEnNs)

const statusEndpoint = '/__local-dashboard/api/status'
const logLevels = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']

const getChipColor = (state: RuntimeState) =>
  match(state)
    .with('ready', 'running', 'healthy', 'passed', () => 'success' as const)
    .with('starting', 'pending', () => 'warning' as const)
    .with('failed', 'degraded', 'stopped', 'exited', () => 'error' as const)
    .with('disabled', () => 'default' as const)
    .exhaustive()

const getStatus = async () => {
  const response = await fetch(statusEndpoint)
  if (!response.ok) throw new Error(`Status request failed with ${response.status}`)
  return localDevelopmentStatusSchema.parse(await response.json())
}

const LocalDevelopmentDashboardPage: React.FC = () => {
  const { t } = useTranslation(translationNamespace)
  const [inventoryView, setInventoryView] = useState<InventoryView>('processes')
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [source, setSource] = useState('')
  const [level, setLevel] = useState('')
  const [service, setService] = useState('')
  const [filteredLogsCopied, setFilteredLogsCopied] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query.trim()), 250)
    return () => window.clearTimeout(timeout)
  }, [query])

  useEffect(() => {
    if (!filteredLogsCopied) return
    const timeout = window.setTimeout(() => setFilteredLogsCopied(false), 2_000)
    return () => window.clearTimeout(timeout)
  }, [filteredLogsCopied])

  const statusQuery = useQuery({
    queryKey: ['local-development-dashboard', 'status'],
    queryFn: getStatus,
    refetchInterval: 3_000,
  })
  const logsQuery = useIncrementalLogs(debouncedQuery, source, level, service)

  const status = statusQuery.data
  const logEntries = logsQuery.data?.results ?? []
  const processes = [...(status?.processes ?? [])].sort((left, right) =>
    left.name.localeCompare(right.name)
  )
  const infrastructure = [...(status?.infrastructure ?? [])].sort((left, right) =>
    left.name.localeCompare(right.name)
  )
  const runningProcesses = status?.processes.filter(({ state }) => state === 'running').length ?? 0
  const runningInfrastructure =
    status?.infrastructure.filter(({ state }) => state === 'running').length ?? 0

  const copyFilteredLogs = async () => {
    if (logEntries.length === 0) return

    try {
      await navigator.clipboard.writeText(logEntries.map(({ message }) => message).join('\n'))
      setFilteredLogsCopied(true)
    } catch {
      setFilteredLogsCopied(false)
    }
  }

  const clearLogFilters = () => {
    setQuery('')
    setDebouncedQuery('')
    setSource('')
    setLevel('')
    setService('')
  }

  const hasActiveLogFilters = Boolean(query || source || level || service)

  return (
    <Box
      id="local-development-dashboard"
      data-testid="local-development-dashboard"
      sx={{
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'grey.50',
        color: 'text.primary',
      }}
    >
      <Box
        component="header"
        sx={{
          flexShrink: 0,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Stack direction="row" minHeight={64} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                aria-hidden="true"
                sx={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  borderRadius: 1,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                IO
              </Box>
              <Typography fontWeight={700}>PDND Interop</Typography>
              <Chip label="local" size="small" variant="outlined" />
            </Stack>
            <Button
              component={Link}
              href="/ui/it/"
              target="_blank"
              rel="noreferrer"
              endIcon={<OpenInNewIcon />}
            >
              {t('openFrontend')}
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container
        component="main"
        maxWidth="xl"
        sx={{ flex: 1, minHeight: 0, overflowY: 'auto', py: { xs: 3, md: 5 } }}
      >
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ md: 'flex-end' }}
          >
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography component="h1" variant="h4" fontWeight={700}>
                  {t('title')}
                </Typography>
                {status && (
                  <Chip
                    label={t(`states.${status.overall}`)}
                    color={getChipColor(status.overall)}
                    size="small"
                  />
                )}
              </Stack>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {t('description')}
              </Typography>
              {status && (
                <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                  {t('runtimeSummary', {
                    runningProcesses,
                    processCount: status.processes.length,
                    runningInfrastructure,
                    infrastructureCount: status.infrastructure.length,
                  })}
                </Typography>
              )}
            </Box>
            {status && (
              <Typography color="text.secondary" variant="caption">
                {t('lastUpdated', {
                  time: new Intl.DateTimeFormat(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  }).format(new Date(status.timestamp)),
                })}
              </Typography>
            )}
          </Stack>

          {(statusQuery.isError || logsQuery.isError) && (
            <Alert severity="error">{t('connectionError')}</Alert>
          )}

          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2.5 }}>
              <Typography component="h2" variant="h6" fontWeight={700}>
                {t('startupTitle')}
              </Typography>
              {statusQuery.isFetching && <CircularProgress size={20} />}
            </Stack>
            {status ? (
              <Stepper
                alternativeLabel
                activeStep={status.startup.checks.findIndex(({ state }) => state !== 'passed')}
              >
                {status.startup.checks.map((check) => (
                  <Step key={check.id} completed={check.state === 'passed'}>
                    <StepLabel error={check.state === 'failed'}>
                      <Stack alignItems="center" spacing={0.5}>
                        <span>{check.label}</span>
                        <Chip
                          label={t(`states.${check.state}`)}
                          color={getChipColor(check.state)}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            ) : (
              <CircularProgress size={24} />
            )}
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'minmax(0, 1fr)',
                  md: 'repeat(2, minmax(0, 1fr))',
                  xl: 'minmax(280px, 1fr) 180px 160px 280px auto',
                },
                gap: 2,
                alignItems: 'center',
              }}
            >
              <TextField
                fullWidth
                type="search"
                label={t('searchLabel')}
                placeholder={t('searchPlaceholder')}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                InputProps={{ startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} /> }}
              />
              <FormControl fullWidth>
                <InputLabel id="log-source-label">{t('sourceLabel')}</InputLabel>
                <Select
                  labelId="log-source-label"
                  label={t('sourceLabel')}
                  value={source}
                  onChange={(event) => setSource(event.target.value)}
                >
                  <MenuItem value="">{t('allLogs')}</MenuItem>
                  {status?.logs.map((log) => (
                    <MenuItem key={log.source} value={log.source}>
                      {log.source}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="log-level-label">{t('levelLabel')}</InputLabel>
                <Select
                  labelId="log-level-label"
                  label={t('levelLabel')}
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                >
                  <MenuItem value="">{t('allLevels')}</MenuItem>
                  {logLevels.map((logLevel) => (
                    <MenuItem key={logLevel} value={logLevel}>
                      {logLevel}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="log-service-label">{t('processLabel')}</InputLabel>
                <Select
                  labelId="log-service-label"
                  label={t('processLabel')}
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                >
                  <MenuItem value="">{t('allProcesses')}</MenuItem>
                  {processes.map((process) => {
                    const processService = process.name.replace(/^pagopa-interop-/, '')
                    return (
                      <MenuItem key={process.name} value={processService}>
                        {process.name}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                startIcon={<FilterAltOffIcon />}
                disabled={!hasActiveLogFilters}
                onClick={clearLogFilters}
                sx={{ minHeight: 56, whiteSpace: 'nowrap' }}
              >
                {t('clearLogFilters')}
              </Button>
            </Box>
          </Paper>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'minmax(0, 1fr)',
                lg: 'minmax(0, 5fr) minmax(0, 7fr)',
              },
              gap: 3,
              alignItems: 'stretch',
            }}
          >
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                px={2.5}
                pt={2}
              >
                <Typography component="h2" variant="h6" fontWeight={700}>
                  {t('servicesTitle')}
                </Typography>
                <Tabs
                  value={inventoryView}
                  onChange={(_, value: InventoryView) => setInventoryView(value)}
                  aria-label={t('servicesTitle')}
                >
                  <Tab
                    value="processes"
                    label={`${t('processesTab')} ${status?.processes.length ?? 0}`}
                  />
                  <Tab
                    value="infrastructure"
                    label={`${t('infrastructureTab')} ${status?.infrastructure.length ?? 0}`}
                  />
                </Tabs>
              </Stack>
              <TableContainer sx={{ maxHeight: 560 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('serviceColumn')}</TableCell>
                      <TableCell>{t('stateColumn')}</TableCell>
                      {inventoryView === 'processes' ? (
                        <>
                          <TableCell>{t('portColumn')}</TableCell>
                          <TableCell>{t('pidColumn')}</TableCell>
                        </>
                      ) : (
                        <TableCell>{t('detailColumn')}</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventoryView === 'processes'
                      ? processes.map((process) => (
                          <TableRow key={process.name} hover>
                            <TableCell>
                              <Link
                                component="button"
                                type="button"
                                variant="caption"
                                fontFamily="monospace"
                                textAlign="left"
                                onClick={() =>
                                  setService(process.name.replace(/^pagopa-interop-/, ''))
                                }
                              >
                                {process.name}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={t(`states.${process.state}`)}
                                color={getChipColor(process.state)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{process.port ?? '—'}</TableCell>
                            <TableCell>{process.pid}</TableCell>
                          </TableRow>
                        ))
                      : infrastructure.map((infrastructureService) => (
                          <TableRow key={infrastructureService.container} hover>
                            <TableCell>
                              <Typography variant="caption" fontFamily="monospace">
                                {infrastructureService.name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  infrastructureService.health ??
                                  t(`states.${infrastructureService.state}`)
                                }
                                color={getChipColor(
                                  infrastructureService.health === 'healthy'
                                    ? 'healthy'
                                    : infrastructureService.state
                                )}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" color="text.secondary">
                                {infrastructureService.container}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" p={2.5}>
                <Typography component="h2" variant="h6" fontWeight={700}>
                  {t('logsTitle')}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  {logsQuery.isFetching && <CircularProgress size={18} />}
                  <Typography color="text.secondary" variant="caption" aria-live="polite">
                    {logEntries.length} {t('lines')}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={
                      filteredLogsCopied ? (
                        <CheckIcon fontSize="small" />
                      ) : (
                        <ContentCopyIcon fontSize="small" />
                      )
                    }
                    disabled={logEntries.length === 0}
                    onClick={copyFilteredLogs}
                  >
                    {t(filteredLogsCopied ? 'filteredLogsCopied' : 'copyFilteredLogs')}
                  </Button>
                </Stack>
              </Stack>
              <Divider />
              {logEntries.length > 0 ? (
                <VirtualizedLogList
                  entries={logEntries}
                  label={t('logsTitle')}
                  copyCorrelationIdLabel={t('copyCorrelationId')}
                />
              ) : (
                <Stack minHeight={240} alignItems="center" justifyContent="center" p={3}>
                  <Typography color="text.secondary">{t('noLogs')}</Typography>
                </Stack>
              )}
            </Paper>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default LocalDevelopmentDashboardPage
