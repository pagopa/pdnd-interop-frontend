import React, { useCallback, useRef } from 'react'
import { Box, Chip, Divider, IconButton, ListItem, Stack, Tooltip, Typography } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { LocalDevelopmentLogEntry } from './localDevelopmentDashboard.schemas'

type VirtualizedLogListProps = {
  entries: LocalDevelopmentLogEntry[]
  label: string
  copyCorrelationIdLabel: string
}

const VirtualizedLogList: React.FC<VirtualizedLogListProps> = ({
  entries,
  label,
  copyCorrelationIdLabel,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const getItemKey = useCallback(
    (index: number) => {
      const entry = entries[index]
      return entry ? `${entry.source}:${entry.offset}` : index
    },
    [entries]
  )
  const virtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () => scrollContainerRef.current,
    getItemKey,
    estimateSize: () => 92,
    overscan: 6,
    initialRect: { width: 800, height: 560 },
    useFlushSync: false,
  })

  return (
    <Box
      ref={scrollContainerRef}
      role="list"
      aria-label={label}
      sx={{ height: 560, overflow: 'auto', contain: 'strict' }}
    >
      <Box sx={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const entry = entries[virtualItem.index]
          if (!entry) return null

          return (
            <Box
              key={virtualItem.key}
              ref={virtualizer.measureElement}
              role="listitem"
              data-index={virtualItem.index}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <ListItem component="div" alignItems="flex-start" sx={{ gap: 1.5, py: 1.5 }}>
                <Typography color="text.secondary" variant="caption" sx={{ minWidth: 66, pt: 0.5 }}>
                  {entry.timestamp
                    ? new Intl.DateTimeFormat(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      }).format(new Date(entry.timestamp))
                    : `#${entry.line}`}
                </Typography>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5 }}>
                    {entry.level && (
                      <Chip
                        label={entry.level}
                        color={
                          entry.level === 'ERROR' || entry.level === 'FATAL' ? 'error' : 'default'
                        }
                        size="small"
                        variant="outlined"
                      />
                    )}
                    <Typography color="text.secondary" variant="caption">
                      {entry.source}
                    </Typography>
                    {entry.service && (
                      <Typography color="primary.main" variant="caption" fontFamily="monospace">
                        {entry.service}
                      </Typography>
                    )}
                  </Stack>
                  <Typography
                    component="code"
                    variant="caption"
                    sx={{
                      display: 'block',
                      overflowWrap: 'anywhere',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {entry.message}
                  </Typography>
                </Box>
                {entry.correlationId && (
                  <Tooltip title={copyCorrelationIdLabel}>
                    <IconButton
                      size="small"
                      aria-label={copyCorrelationIdLabel}
                      onClick={() => navigator.clipboard.writeText(entry.correlationId ?? '')}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </ListItem>
              <Divider />
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default VirtualizedLogList
