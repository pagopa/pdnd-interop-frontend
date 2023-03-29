import { EServiceMutations } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { RHFSwitch, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { useNavigateRouter } from '@/router'
import { minutesToSeconds, secondsToMinutes } from '@/utils/format.utils'
import { Box } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import omit from 'lodash/omit'
import isEqual from 'lodash/isEqual'
import { getKeys } from '@/utils/array.utils'
import type { AgreementApprovalPolicy } from '@/api/api.generatedTypes'

type EServiceCreateStep2FormValues = {
  audience: string
  version: string
  voucherLifespan: number
  description: string
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
  agreementApprovalPolicy: boolean
}

export const EServiceCreateStep2Version: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eservice')
  const { navigate } = useNavigateRouter()
  const { eservice, descriptor, forward, back } = useEServiceCreateContext()
  const { mutate: createVersionDraft } = EServiceMutations.useCreateVersionDraft({
    suppressSuccessToast: true,
    showConfirmationDialog: false,
  })
  const { mutate: updateVersionDraft } = EServiceMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  let defaultValues: EServiceCreateStep2FormValues = {
    version: '1',
    audience: '',
    voucherLifespan: 1,
    description: '',
    dailyCallsPerConsumer: 1,
    dailyCallsTotal: 1,
    agreementApprovalPolicy: true,
  }

  // Pre-fill if there is already a draft of the service available
  if (descriptor) {
    defaultValues = {
      version: descriptor.version,
      audience: descriptor.audience.length > 0 ? descriptor.audience[0] : '',
      voucherLifespan: secondsToMinutes(descriptor.voucherLifespan),
      description: descriptor?.description ?? '',
      dailyCallsPerConsumer: descriptor.dailyCallsPerConsumer || 1,
      dailyCallsTotal: descriptor.dailyCallsTotal || 1,
      agreementApprovalPolicy: descriptor.agreementApprovalPolicy === 'MANUAL',
    }
  }

  const formMethods = useForm({
    defaultValues,
  })

  const onSubmit = (values: EServiceCreateStep2FormValues) => {
    if (!eservice) return
    const newDescriptorData = {
      ...values,
      voucherLifespan: minutesToSeconds(values.voucherLifespan),
      audience: [values.audience],
      agreementApprovalPolicy: (values.agreementApprovalPolicy
        ? 'MANUAL'
        : 'AUTOMATIC') as AgreementApprovalPolicy,
    }

    // If nothing has changed skip the update call
    if (descriptor) {
      const descriptorDataToCompare = {
        voucherLifespan: descriptor.voucherLifespan,
        audience: descriptor.audience,
        agreementApprovalPolicy: descriptor.agreementApprovalPolicy,
        version: descriptor.version,
        description: descriptor?.description ?? '',
        dailyCallsPerConsumer: descriptor.dailyCallsPerConsumer,
        dailyCallsTotal: descriptor.dailyCallsTotal,
      }

      if (
        getKeys(newDescriptorData).every((key) =>
          isEqual(newDescriptorData[key], descriptorDataToCompare[key])
        )
      ) {
        forward()
        return
      }
    }

    const payload = { eserviceId: eservice.id, ...omit(newDescriptorData, ['version']) }

    if (descriptor) {
      updateVersionDraft({ ...payload, descriptorId: descriptor.id }, { onSuccess: forward })
      return
    }
    createVersionDraft(payload, {
      onSuccess(data) {
        navigate('PROVIDE_ESERVICE_EDIT', {
          params: { eserviceId: eservice.id, descriptorId: data.id },
          replace: true,
        })
        forward()
      },
    })
  }

  const dailyCallsPerConsumer = formMethods.watch('dailyCallsPerConsumer')

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer>
          <RHFTextField
            sx={{ mt: 0 }}
            name="version"
            label={t('create.step2.versionField.label')}
            infoLabel={t('create.step2.versionField.infoLabel')}
            disabled
            rules={{ required: true }}
          />

          <RHFTextField
            name="description"
            label={t('create.step2.descriptionField.label')}
            infoLabel={t('create.step2.descriptionField.infoLabel')}
            multiline
            focusOnMount
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 10 }}
          />

          <RHFTextField
            name="audience"
            label={t('create.step2.audienceField.label')}
            infoLabel={t('create.step2.audienceField.infoLabel')}
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 1 }}
          />

          <RHFTextField
            name="voucherLifespan"
            label={t('create.step2.voucherLifespanField.label')}
            infoLabel={t('create.step2.voucherLifespanField.infoLabel')}
            type="number"
            inputProps={{ min: 1, max: 1440 }}
            rules={{ required: true, min: 1, max: 1440 }}
          />

          <RHFTextField
            name="dailyCallsPerConsumer"
            label={t('create.step2.dailyCallsPerConsumerField.label')}
            infoLabel={t('create.step2.dailyCallsPerConsumerField.infoLabel')}
            type="number"
            inputProps={{ min: '1' }}
            rules={{ required: true, min: 1 }}
          />

          <RHFTextField
            name="dailyCallsTotal"
            label={t('create.step2.dailyCallsTotalField.label')}
            infoLabel={t('create.step2.dailyCallsTotalField.infoLabel')}
            type="number"
            inputProps={{ min: '1' }}
            sx={{ mb: 3 }}
            rules={{
              required: true,
              min: {
                value: dailyCallsPerConsumer,
                message: t('create.step2.dailyCallsTotalField.validation.min'),
              },
            }}
          />

          <RHFSwitch
            label={t('create.step2.agreementApprovalPolicyField.label')}
            vertical
            name="agreementApprovalPolicy"
          />
        </SectionContainer>
        <StepActions
          back={{ label: t('create.backWithoutSaveBtn'), type: 'button', onClick: back }}
          forward={{ label: t('create.forwardWithSaveBtn'), type: 'submit' }}
        />
      </Box>
    </FormProvider>
  )
}

export const EServiceCreateStep2VersionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={1010} />
}
