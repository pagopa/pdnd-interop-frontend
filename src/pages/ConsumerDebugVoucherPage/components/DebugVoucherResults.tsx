import { Box, Button, Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { DebugVoucherResultsStepsSection } from './DebugVoucherResultsStepsSection'
import { DebugVoucherResultsRequestSection } from './DebugVoucherResultsRequestSection'
import DebugVoucherStepDrawer from './DebugVoucherStepDrawer'
import { useDebugVoucherContext } from '../DebugVoucherContext'
import DebugVoucherResultsAlert from './DebugVoucherResultsAlert'
import { Drawer } from '@/components/shared/Drawer'

export const DebugVoucherResults: React.FC = () => {
  const { t } = useTranslation('voucher', { keyPrefix: 'consumerDebugVoucher.result' })

  const {
    handleMakeNewRequest,
    debugVoucherStepDrawer,
    setDebugVoucherStepDrawer,
    response,
    goToNextStep,
  } = useDebugVoucherContext()

  const handleDrawerClose = () => {
    setDebugVoucherStepDrawer((prev) => ({ ...prev, isOpen: false }))
  }

  const isNotLastStep =
    (response.clientKind === 'CONSUMER' &&
      debugVoucherStepDrawer.selectedStep?.[0] !== 'platformStatesVerification') ||
    (response.clientKind !== 'CONSUMER' &&
      debugVoucherStepDrawer.selectedStep?.[0] !== 'clientAssertionSignatureVerification')

  return (
    <>
      <Stack spacing={4}>
        <DebugVoucherResultsAlert />

        <DebugVoucherResultsStepsSection />

        <DebugVoucherResultsRequestSection />

        <Drawer
          isOpen={debugVoucherStepDrawer.isOpen}
          onClose={handleDrawerClose}
          title={t(
            `stepDrawer.title.${debugVoucherStepDrawer.selectedStep?.[0]}` as unknown as TemplateStringsArray
          )}
          subtitle={t(
            `stepDrawer.description.${debugVoucherStepDrawer.selectedStep?.[0]}` as unknown as TemplateStringsArray
          )}
          buttonAction={
            isNotLastStep ? { label: t('stepDrawer.nextStepBtn'), action: goToNextStep } : undefined
          }
        >
          <DebugVoucherStepDrawer />
        </Drawer>
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'end', pt: 4 }}>
        <Button variant="contained" onClick={handleMakeNewRequest}>
          {t('newRequestBtn')}
        </Button>
      </Box>
    </>
  )
}
