import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { EServiceMutations } from '@/api/eservice'
import { compareObjects } from '@/utils/common.utils'
import {
  UpdateEServiceDescriptorSeed,
  UpdateEServiceDescriptorTemplateInstanceSeed,
} from '@/api/api.generatedTypes'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'
import { Box } from '@mui/material'
import { SectionContainer } from '@/components/layout/containers'

type EServiceCreateStepVersionFormValues = {
  description: string
  agreementApprovalPolicy: boolean
}

export const EServiceCreateStepInfoVersion: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })

  const { descriptor, forward, back } = useEServiceCreateContext()

  const { mutate: updateVersionDraft } = EServiceMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  const { mutate: updateInstanceVersionDraft } = EServiceMutations.useUpdateInstanceVersionDraft({
    suppressSuccessToast: true,
  })

  const formMethods = useForm<EServiceCreateStepVersionFormValues>({
    defaultValues: {
      description: descriptor?.description ?? '',
      agreementApprovalPolicy: descriptor ? descriptor.agreementApprovalPolicy === 'MANUAL' : false,
    },
  })

  const isEServiceCreatedFromTemplate = Boolean(descriptor?.templateRef?.templateVersionId)

  const onSubmit: SubmitHandler<EServiceCreateStepVersionFormValues> = (values) => {
    if (!descriptor) return

    const newDescriptorData = {
      ...descriptor,
      description: values.description,
      agreementApprovalPolicy: values.agreementApprovalPolicy
        ? ('MANUAL' as const)
        : ('AUTOMATIC' as const),
    }

    // If nothing has changed skip the update call
    const areDescriptorsEquals = compareObjects(newDescriptorData, descriptor)
    if (areDescriptorsEquals) {
      forward()
      return
    }

    if (isEServiceCreatedFromTemplate) {
      const payload: UpdateEServiceDescriptorTemplateInstanceSeed = {
        agreementApprovalPolicy: newDescriptorData.agreementApprovalPolicy,
        audience: descriptor.audience,
        dailyCallsPerConsumer: descriptor.dailyCallsPerConsumer,
        dailyCallsTotal: descriptor.dailyCallsTotal,
      }

      updateInstanceVersionDraft(
        {
          ...payload,
          eserviceId: descriptor.eservice.id,
          descriptorId: descriptor.id,
        },
        { onSuccess: forward }
      )
    } else {
      const payload: UpdateEServiceDescriptorSeed & {
        eserviceId: string
        descriptorId: string
      } = {
        audience: descriptor.audience,
        voucherLifespan: descriptor.voucherLifespan,
        dailyCallsPerConsumer: descriptor.dailyCallsPerConsumer,
        dailyCallsTotal: descriptor.dailyCallsTotal,
        agreementApprovalPolicy: newDescriptorData.agreementApprovalPolicy,
        description: newDescriptorData.description,
        attributes: remapDescriptorAttributesToDescriptorAttributesSeed(descriptor.attributes),
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
      }
      updateVersionDraft(
        {
          ...payload,
          descriptorId: descriptor.id,
        },
        { onSuccess: forward }
      )
    }
  }
  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}></Box>
    </FormProvider>
  )
}
