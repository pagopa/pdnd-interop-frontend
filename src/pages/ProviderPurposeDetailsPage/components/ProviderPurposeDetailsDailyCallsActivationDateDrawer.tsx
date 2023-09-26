import type { Purpose } from '@/api/api.generatedTypes'
import { PurposeMutations } from '@/api/purpose'
import { Drawer } from '@/components/shared/Drawer'
import { RHFDatePicker } from '@/components/shared/react-hook-form-inputs'
import { purposeUpgradeGuideLink } from '@/config/constants'
import { Alert, Link, Stack } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'

type ProviderPurposeDetailsDailyCallsActivationDateDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  purpose: Purpose
}

type ExpectedApprovalDateFormValues = {
  expectedApprovalDate: Date | undefined
}

export const ProviderPurposeDetailsDailyCallsActivationDateDrawer: React.FC<
  ProviderPurposeDetailsDailyCallsActivationDateDrawerProps
> = ({ isOpen, onClose, purpose }) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'providerView.sections.loadEstimate.drawer',
  })

  const { t: tCommon } = useTranslation('common')

  const { mutate: updateWaitingForApprovalDate } =
    PurposeMutations.useUpdateVersionWaitingForApproval()

  const waitingForApprovalVersion = purpose.waitingForApprovalVersion

  const title = waitingForApprovalVersion?.expectedApprovalDate
    ? t('title.modify')
    : t('title.insert')

  const buttonActionLabel = waitingForApprovalVersion?.expectedApprovalDate
    ? t('buttonActionLabel.modify')
    : tCommon('actions.insert')

  const formMethods = useForm<ExpectedApprovalDateFormValues>()

  const expectedApprovalDate = purpose.waitingForApprovalVersion?.expectedApprovalDate

  React.useEffect(() => {
    expectedApprovalDate &&
      formMethods.setValue('expectedApprovalDate', new Date(expectedApprovalDate))
  }, [expectedApprovalDate, formMethods])

  const onSubmit = async ({ expectedApprovalDate }: ExpectedApprovalDateFormValues) => {
    if (!waitingForApprovalVersion) return null
    updateWaitingForApprovalDate(
      {
        purposeId: purpose.id,
        versionId: waitingForApprovalVersion.id,
        expectedApprovalDate: expectedApprovalDate ? expectedApprovalDate.toISOString() : '',
      },
      { onSuccess: onClose }
    )
  }

  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        subtitle={
          <Trans
            components={{
              1: <Link underline="hover" href={purposeUpgradeGuideLink} target="_blank" />,
            }}
          >
            {t('subtitle')}
          </Trans>
        }
        buttonAction={{ label: buttonActionLabel, action: formMethods.handleSubmit(onSubmit) }}
      >
        <Stack spacing={3}>
          <RHFDatePicker sx={{ my: 0 }} name="expectedApprovalDate" />
          <Alert severity="info" variant="outlined">
            {t('alert')}
          </Alert>
        </Stack>
      </Drawer>
    </FormProvider>
  )
}
