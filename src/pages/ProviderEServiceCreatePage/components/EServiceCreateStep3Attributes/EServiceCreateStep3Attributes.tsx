import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Box, Divider } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { AddAttributesToEServiceForm } from './AddAttributesToEServiceForm'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { EServiceMutations } from '@/api/eservice'
import { useTranslation } from 'react-i18next'
import { remapRemappedDescriptorAttributesToDescriptorAttributes } from '@/api/eservice/eservice.api.utils'
import { StepActions } from '@/components/shared/StepActions'
import type { UpdateEServiceDescriptorSeed } from '@/api/api.generatedTypes'
import type { RemappedDescriptorAttributes } from '@/types/attribute.types'
import { compareObjects } from '@/utils/common.utils'

export type EServiceCreateStep3FormValues = {
  attributes: RemappedDescriptorAttributes
}

export const EServiceCreateStep3Attributes: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { eservice, descriptor, attributes, forward, back } = useEServiceCreateContext()
  const { mutate: updateVersionDraft } = EServiceMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  const formMethods = useForm({
    defaultValues: { attributes: attributes ?? { certified: [], verified: [], declared: [] } },
  })

  const onSubmit = (values: EServiceCreateStep3FormValues) => {
    if (!eservice) return
    const backendAttributes = remapRemappedDescriptorAttributesToDescriptorAttributes(
      values.attributes
    )

    if (descriptor && attributes) {
      // Removes empty groups from the comparison
      const newAttributesToCompare = {
        certified: values.attributes.certified.filter((group) => group.attributes.length > 0),
        verified: values.attributes.verified.filter((group) => group.attributes.length > 0),
        declared: values.attributes.declared.filter((group) => group.attributes.length > 0),
      }

      const areAttributesEquals = compareObjects(newAttributesToCompare, attributes)

      if (areAttributesEquals) {
        forward()
        return
      }

      const payload: UpdateEServiceDescriptorSeed = {
        audience: descriptor.audience,
        voucherLifespan: descriptor.voucherLifespan,
        dailyCallsPerConsumer: descriptor.dailyCallsPerConsumer,
        dailyCallsTotal: descriptor.dailyCallsTotal,
        agreementApprovalPolicy: descriptor.agreementApprovalPolicy,
        attributes: backendAttributes,
      }

      updateVersionDraft(
        {
          ...payload,
          eserviceId: eservice.id,
          descriptorId: descriptor.id,
        },
        { onSuccess: forward }
      )
      return
    }
  }

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer
          newDesign
          title={t('create.step3.attributesTitle')}
          description={t('create.step3.attributesDescription')}
        >
          <Divider sx={{ my: 3 }} />
          <AddAttributesToEServiceForm attributeKey="certified" readOnly={false} />
          <Divider sx={{ my: 3 }} />
          <AddAttributesToEServiceForm attributeKey="verified" readOnly={false} />
          <Divider sx={{ my: 3 }} />
          <AddAttributesToEServiceForm attributeKey="declared" readOnly={false} />
        </SectionContainer>
        <StepActions
          back={{ label: t('create.backWithoutSaveBtn'), type: 'button', onClick: back }}
          forward={{ label: t('create.forwardWithSaveBtn'), type: 'submit' }}
        />
      </Box>
    </FormProvider>
  )
}

export const EServiceCreateStep3AttributesSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={600} />
}
