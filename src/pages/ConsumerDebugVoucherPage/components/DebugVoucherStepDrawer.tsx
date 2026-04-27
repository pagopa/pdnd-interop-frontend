import { Chip, List, ListItem, Stack, Typography } from '@mui/material'
import React from 'react'
import { useDebugVoucherContext } from '../DebugVoucherContext'
import { useTranslation } from 'react-i18next'
import { useGetDebugVoucherResultChipProps } from '../hooks/useGetDebugVoucherResultChipProps'
import { Drawer } from '@/components/shared/Drawer'

const DebugVoucherStepDrawer: React.FC = () => {
  const { t } = useTranslation('voucher', { keyPrefix: 'consumerDebugVoucher.result' })
  const { debugVoucherStepDrawer, stepOrder, goToNextStep, setDebugVoucherStepDrawer } =
    useDebugVoucherContext()

  const selectedStep = debugVoucherStepDrawer.selectedStep

  const chipProps = useGetDebugVoucherResultChipProps(selectedStep?.[1])

  const handleDrawerClose = () => {
    setDebugVoucherStepDrawer((prev) => ({ ...prev, isOpen: false }))
  }

  const currentStep = debugVoucherStepDrawer.selectedStep?.[0]
  const stepIndex = currentStep ? stepOrder.indexOf(currentStep) : -1

  const isLastStep = stepIndex !== -1 && stepIndex === stepOrder.length - 1

  return (
    <Drawer
      isOpen={debugVoucherStepDrawer.isOpen}
      onClose={handleDrawerClose}
      title={t(
        `stepDrawer.title.${debugVoucherStepDrawer.selectedStep?.[0]}` as unknown as TemplateStringsArray,
        { index: stepIndex + 1 }
      )}
      subtitle={t(
        `stepDrawer.description.${debugVoucherStepDrawer.selectedStep?.[0]}` as unknown as TemplateStringsArray
      )}
      buttonAction={
        isLastStep ? undefined : { label: t('stepDrawer.nextStepBtn'), action: goToNextStep }
      }
    >
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2">{t('stepDrawer.stepResultLabel')}</Typography>
          {chipProps && <Chip size="small" label={chipProps.label} color={chipProps.color} />}
        </Stack>

        <List sx={{ listStyleType: 'disc', pl: 4 }}>
          {selectedStep?.[1].failures.map((failure, index) => (
            <ListItem key={index} sx={{ display: 'list-item', px: 0 }}>
              <Typography variant="body2">{t(`errors.${failure.code}`, failure.reason)}</Typography>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Drawer>
  )
}

export default DebugVoucherStepDrawer
