import type { Purpose } from '@/api/api.generatedTypes'
import { PurposeMutations } from '@/api/purpose'
import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { purposeUpgradeGuideLink } from '@/config/constants'
import { Link, Typography } from '@mui/material'
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
  const { t: tCommon } = useTranslation('common', {
    keyPrefix: 'actions',
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
            {t('subtitle', {
              dailyCalls: purpose.currentVersion?.dailyCalls,
            })}
          </Trans>
        }
        buttonAction={{
          label: tCommon('upgrade'),
          action: formMethods.handleSubmit(onSubmit),
        }}
        onTransitionExited={handleTransitionExited}
      >
        <RHFTextField
          type="number"
          name="dailyCalls"
          label={t('dailyCallsFormField.label')}
          infoLabel={t('dailyCallsFormField.infoLable')}
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
      </Drawer>
    </FormProvider>
  )
}
