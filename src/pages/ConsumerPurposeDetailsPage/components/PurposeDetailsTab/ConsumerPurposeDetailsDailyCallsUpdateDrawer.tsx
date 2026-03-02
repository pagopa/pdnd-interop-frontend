import type { Purpose } from '@/api/api.generatedTypes'
import { PurposeMutations } from '@/api/purpose'
import { SectionContainer } from '@/components/layout/containers'
import { Drawer } from '@/components/shared/Drawer'
import { GreyAlert } from '@/components/shared/GreyAlert'
import { RHFCheckbox, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { purposeUpgradeGuideLink } from '@/config/constants'
import { useGetConsumerPurposeEditPageInfoAlertProps } from '@/pages/ConsumerPurposeEditPage/hooks/useGetConsumerPurposeEditPageInfoAlertProps'
import { Alert, AlertTitle, Link, Stack, Typography } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'

type UpdateDailyCallsFormValues = { dailyCalls: number }

type ConsumerPurposeDetailsDailyCallsUpdateDrawerProps = {
  purpose: Purpose
  isOpen: boolean
  onClose: VoidFunction
}

export const ConsumerPurposeDetailsDailyCallsUpdateDrawer: React.FC<
  ConsumerPurposeDetailsDailyCallsUpdateDrawerProps
> = ({ purpose, isOpen, onClose }) => {
  const { t } = useTranslation('purpose', {
    keyPrefix: 'consumerView.sections.loadEstimate.drawer',
  })

  const { mutate: updateDailyCalls } = PurposeMutations.useUpdateDailyCalls()

  const defaultValues: UpdateDailyCallsFormValues = {
    dailyCalls: purpose.currentVersion?.dailyCalls ?? 1,
  }

  const formMethods = useForm<UpdateDailyCallsFormValues>({
    defaultValues,
  })

  const onSubmit = ({ dailyCalls }: UpdateDailyCallsFormValues) => {
    updateDailyCalls({ purposeId: purpose.id, dailyCalls }, { onSuccess: onClose })
  }

  const handleTransitionExited = () => {
    formMethods.reset(defaultValues)
  }

  const dailyCalls = formMethods.watch('dailyCalls')

  const alertProps = useGetConsumerPurposeEditPageInfoAlertProps(
    dailyCalls,
    purpose.dailyCallsPerConsumer,
    purpose.dailyCallsTotal
  )

  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={t('title')}
        subtitle={
          <Trans
            components={{
              1: <Link underline="hover" href={purposeUpgradeGuideLink} target="_blank" />,
              strong: <Typography component="span" variant="inherit" fontWeight={700} />,
            }}
          >
            {t('subtitle')}
          </Trans>
        }
        buttonAction={{
          label: t('submitButton.label'),
          action: formMethods.handleSubmit(onSubmit),
        }}
        onTransitionExited={handleTransitionExited}
      >
        <Typography variant="body2" sx={{ mb: 2 }}>
          <Trans
            components={{
              strong: <Typography component="span" variant="inherit" fontWeight={600} />,
            }}
          >
            {t('currentDailyCalls', { dailyCalls: purpose.currentVersion?.dailyCalls })}
          </Trans>
        </Typography>
        <RHFTextField
          type="number"
          name="dailyCalls"
          label={t('dailyCallsFormField.label')}
          infoLabel={t('dailyCallsFormField.infoLabel')}
          focusOnMount={true}
          inputProps={{ min: '1' }}
          rules={{
            required: true,
            min: 1,
            validate: (value) =>
              value !== purpose.currentVersion?.dailyCalls ||
              t('dailyCallsFormField.validation.sameValue'),
          }}
        />
        {alertProps && <Alert {...alertProps} sx={{ mb: 4 }} />}
        <Stack direction="column" gap={3} sx={{ mt: 2 }}>
          <GreyAlert>
            <Stack direction="column" gap={1}>
              <AlertTitle sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                {t('providerThresholdsInfo.label')}
              </AlertTitle>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="caption">
                  {t('providerThresholdsInfo.dailyCallsPerConsumer.label')}
                </Typography>
                <Typography variant="caption" fontWeight={600}>
                  {t('providerThresholdsInfo.dailyCallsPerConsumer.value', {
                    min: '#' /* @TODO - add residual threshold */,
                    max: purpose.dailyCallsPerConsumer,
                  })}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="caption">
                  {t('providerThresholdsInfo.dailyCallsTotal.label')}
                </Typography>
                <Typography variant="caption" fontWeight={600}>
                  {t('providerThresholdsInfo.dailyCallsTotal.value', {
                    min: '#' /* @TODO - add residual threshold */,
                    max: purpose.dailyCallsTotal,
                  })}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                {t('providerThresholdsInfo.description')}
              </Typography>
            </Stack>
          </GreyAlert>
          <SectionContainer
            innerSection
            title={t('riskAnalysisSection.title')}
            description={t('riskAnalysisSection.description')}
          >
            <RHFCheckbox
              name="riskAnalysisUnchanged"
              label={t('riskAnalysisSection.checkbox.label')}
              rules={{
                validate: (value) =>
                  value === true || t('riskAnalysisSection.checkbox.requiredValidation'),
              }}
              sx={{
                mt: 0,
              }}
            />
          </SectionContainer>
        </Stack>
      </Drawer>
    </FormProvider>
  )
}
