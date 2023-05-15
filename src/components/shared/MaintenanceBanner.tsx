import React, { useRef } from 'react'
import { Alert, AlertTitle, Box, IconButton, Snackbar, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
  type MaintenanceData,
  useMaintenanceBanner,
  useGetMaintenanceJson,
} from '@/hooks/useMaintenanceBanner'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import CloseIcon from '@mui/icons-material/Close'

const singleDateFormatter = new Intl.DateTimeFormat('it', {
  day: '2-digit',
  month: '2-digit',
})
const multipleDateFormatter = new Intl.DateTimeFormat('it', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})
function formatDateString(dateString: string | undefined, type: 'single' | 'multiple') {
  if (dateString === undefined) return ''
  if (type === 'single') {
    return singleDateFormatter.format(new Date(dateString))
  }
  if (type === 'multiple') {
    return multipleDateFormatter.format(new Date(dateString))
  }
}

export const MaintenanceBanner: React.FC = () => {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'maintenanceBanner',
  })
  const id = React.useId()

  const { data, isFetching } = useGetMaintenanceJson({
    suspense: false,
    keepPreviousData: true,
  })
  const firstFetch = useRef<boolean>(true)

  const { isSingleOrMultipleDays, isOpen, closeBanner, durationInHours, openBanner } =
    useMaintenanceBanner(data)

  if (data && !isFetching) {
    if (firstFetch.current) {
      openBanner()
      console.log('OPEN BANNER CALLED', data)
      firstFetch.current = false
    }
  }
  console.log('AAAAAAAAAAAAA', isOpen, durationInHours)

  const text =
    isSingleOrMultipleDays === 'single'
      ? t('bodySingleDay', {
          maintenanceStartDay: formatDateString(data?.start.date, 'single'),
          maintenanceStartHour: data?.start.time,
          hoursDuration: durationInHours,
        })
      : t('bodyMultipleDay', {
          maintenanceStartHour: data?.start.time,
          maintenanceStartDay: formatDateString(data?.start.date, 'multiple'),
          maintenanceEndHour: data?.end.time,
          maintenanceEndDay: formatDateString(data?.end.date, 'multiple'),
        })

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        aria-labelledby={id}
        severity="info"
        onClose={closeBanner}
        variant="filled"
        sx={{ width: 720, pt: 12, pb: 12 }}
      >
        <AlertTitle sx={{ fontWeight: 700 }}>{t('title')}</AlertTitle>
        {text}
      </Alert>
      {/* <Box
        sx={{
          flexGrow: 0,
          width: 720,
          py: '12px',
          px: '24px',
          display: 'flex',
          flexDirection: 'row',
          borderRadius: 4,
          bgcolor: 'info.extraLight',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <InfoIcon fontSize="medium" color="primary" />
        <Stack direction="column" sx={{ px: '12px' }}>
          <Typography color="darkblue" fontWeight={700}>
            {t('title')}
          </Typography>
          <Typography color="darkblue">{text}</Typography>
        </Stack>
        <IconButton onClick={closeBanner} aria-label={'closeBannerIcon'}>
          <CloseIcon fontSize="medium" color="primary" />
        </IconButton>
      </Box> */}
    </Snackbar>
  )
}
