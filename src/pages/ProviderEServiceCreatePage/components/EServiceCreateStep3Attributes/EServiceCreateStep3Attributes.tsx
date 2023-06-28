import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import type { RemappedEServiceAttributes } from '@/types/attribute.types'
import { Box, Button, Divider } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { AddAttributesToEServiceForm } from '../EServiceCreateStep1General/AddAttributesToEServiceForm'
import { remapEServiceAttributes } from '@/utils/attribute.utils'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { EServiceMutations } from '@/api/eservice'
import { useTranslation } from 'react-i18next'
import { remapRemappedEServiceAttributesToBackend } from '@/api/eservice/eservice.api.utils'
import { compareAttributesStep3IfEquals } from '../../utils/eservice-create.utils'
import { StepActions } from '@/components/shared/StepActions'
import type { UpdateEServiceDescriptorSeed } from '@/api/api.generatedTypes'

export type EServiceCreateStep3FormValues = {
  attributes: RemappedEServiceAttributes
}

export const EServiceCreateStep3Attributes: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { eservice, descriptor, forward, back } = useEServiceCreateContext()
  const { mutate: updateVersionDraft } = EServiceMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  let defaultValues: EServiceCreateStep3FormValues = {
    attributes: { certified: [], verified: [], declared: [] },
  }

  // Pre-fill if there is already a draft of the service available
  if (descriptor) {
    defaultValues = {
      attributes: remapEServiceAttributes(descriptor.attributes),
    }
  }

  const formMethods = useForm({
    defaultValues,
  })

  const onSubmit = (values: EServiceCreateStep3FormValues) => {
    if (!eservice) return
    const backendAttributes = remapRemappedEServiceAttributesToBackend(values.attributes)

    if (descriptor) {
      const nothingHasChanged = compareAttributesStep3IfEquals(
        values.attributes,
        descriptor.attributes
      )
      if (nothingHasChanged) {
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
      // forward()
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
          {/* TODO button pin 3383*/}
          {descriptor && descriptor?.version !== '1' && (
            <Button
              variant="text"
              onClick={() =>
                console.log(
                  'TODO: funzione che cambia i valori degli input con quelli della versione precedente'
                )
              }
            >
              Copia attributi dalla versione precedente
            </Button>
          )}
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
