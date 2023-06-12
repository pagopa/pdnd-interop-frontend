import { Box, Button, Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { DebugVoucherResultsStepsSection } from './DebugVoucherResultsStepsSection'
import { DebugVoucherResultsRequestSection } from './DebugVoucherResultsRequestSection'
import DebugVoucherStepDrawer from './DebugVoucherStepDrawer'
import { useDebugVoucherContext } from '../DebugVoucherContext'
import DebugVoucherResultsAlert from './DebugVoucherResultsAlert'

export const DebugVoucherResults: React.FC = () => {
  const { t } = useTranslation('voucher', { keyPrefix: 'consumerDebugVoucher.result' })

  const { handleMakeNewRequest } = useDebugVoucherContext()

  return (
    <>
      <Stack spacing={4}>
        <DebugVoucherResultsAlert />

        <DebugVoucherResultsStepsSection />

        <DebugVoucherResultsRequestSection />

        <DebugVoucherStepDrawer />
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'end', pt: 4 }}>
        <Button variant="contained" onClick={handleMakeNewRequest}>
          {t('newRequestBtn')}
        </Button>
      </Box>
    </>
  )
}
