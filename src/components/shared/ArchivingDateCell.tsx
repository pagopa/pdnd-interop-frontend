import { Chip, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getArchivingRelativeDate } from '@/utils/archiving.utils'
import { formatDateStringNumeric } from '@/utils/format.utils'

export function ArchivingDateCell({ archivableOn }: Readonly<{ archivableOn: string }>) {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.monitoring.archiving.relative' })
  const relative = getArchivingRelativeDate(archivableOn)
  if (!relative) throw new RangeError('Invalid backend archiving date')

  const label =
    relative.kind === 'inDays' ? t('inDays', { count: relative.count }) : t(relative.kind)
  const color = relative.kind === 'inDays' && relative.count > 10 ? 'info' : 'error'

  return (
    <Stack
      component="span"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      gap={1}
    >
      <Typography component="span" variant="body2">
        {formatDateStringNumeric(archivableOn)}
      </Typography>
      <Chip component="span" size="small" label={label} color={color} />
    </Stack>
  )
}
