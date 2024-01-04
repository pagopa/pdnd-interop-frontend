import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Box, Button, Divider, Stack } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { AddAttributesToEServiceForm } from './AddAttributesToEServiceForm'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { EServiceMutations } from '@/api/eservice'
import { useTranslation } from 'react-i18next'
import { StepActions } from '@/components/shared/StepActions'
import type {
  DescriptorAttribute,
  DescriptorAttributes,
  UpdateEServiceDescriptorSeed,
} from '@/api/api.generatedTypes'
import type { AttributeKey } from '@/types/attribute.types'
import { compareObjects } from '@/utils/common.utils'
import { useClonePreviousDescriptorAttributes } from '../../hooks/useClonePreviousDescriptorAttributes'
import { InfoTooltip } from '@/components/shared/InfoTooltip'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { CreateAttributeDrawer } from './CreateAttributeDrawer'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'

export type EServiceCreateStepAttributesFormValues = {
  attributes: DescriptorAttributes
}

export const EServiceCreateStepAttributes: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const { descriptor, forward, back } = useEServiceCreateContext()

  const { mutate: updateVersionDraft } = EServiceMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  const [createAttributeCreateDrawerState, setCreateAttributeCreateDrawerState] = React.useState<{
    attributeKey: Exclude<AttributeKey, 'certified'>
    isOpen: boolean
  }>({
    attributeKey: 'verified',
    isOpen: false,
  })

  const handleCloseAttributeCreateDrawer = () => {
    setCreateAttributeCreateDrawerState((prevState) => ({ ...prevState, isOpen: false }))
  }

  const handleOpenAttributeCreateDrawerFactory =
    (attributeKey: Exclude<AttributeKey, 'certified'>) => () => {
      setCreateAttributeCreateDrawerState({ attributeKey, isOpen: true })
    }

  const defaultValues: EServiceCreateStepAttributesFormValues = {
    attributes: descriptor?.attributes ?? { certified: [], verified: [], declared: [] },
  }

  const formMethods = useForm({ defaultValues })

  const { handleClonePreviousDescriptorAttributes, hasPreviousVersionNoAttributes } =
    useClonePreviousDescriptorAttributes(descriptor, formMethods.setValue)

  const onSubmit = (values: EServiceCreateStepAttributesFormValues) => {
    if (!descriptor) return

    const removeEmptyAttributeGroups = (attributes: Array<Array<DescriptorAttribute>>) => {
      return attributes.filter((group) => group.length > 0)
    }

    const attributes = {
      certified: removeEmptyAttributeGroups(values.attributes.certified),
      verified: removeEmptyAttributeGroups(values.attributes.verified),
      declared: removeEmptyAttributeGroups(values.attributes.declared),
    }

    const areAttributesEquals = compareObjects(attributes, descriptor.attributes)

    if (areAttributesEquals) {
      forward()
      return
    }

    const payload: UpdateEServiceDescriptorSeed & {
      eserviceId: string
      descriptorId: string
    } = {
      audience: descriptor.audience,
      voucherLifespan: descriptor.voucherLifespan,
      dailyCallsPerConsumer: descriptor.dailyCallsPerConsumer,
      dailyCallsTotal: descriptor.dailyCallsTotal,
      agreementApprovalPolicy: descriptor.agreementApprovalPolicy,
      description: descriptor.description,
      attributes: remapDescriptorAttributesToDescriptorAttributesSeed(attributes),
      eserviceId: descriptor.eservice.id,
      descriptorId: descriptor.id,
    }

    updateVersionDraft(payload, { onSuccess: forward })
  }

  return (
    <>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <SectionContainer
            title={t('step3.attributesTitle', { versionNumber: descriptor?.version ?? '1' })}
            description={t('step3.attributesDescription')}
          >
            {descriptor && descriptor.version > '1' && (
              <Stack direction="row" alignItems="center">
                <Button
                  variant="naked"
                  disabled={hasPreviousVersionNoAttributes}
                  onClick={handleClonePreviousDescriptorAttributes}
                >
                  {t('step3.attributeCloneBtn')}
                </Button>
                {hasPreviousVersionNoAttributes && (
                  <InfoTooltip label={t('step3.attributeCloneNoAttributesLabel')} />
                )}
              </Stack>
            )}
            <Divider sx={{ my: 3 }} />
            <AddAttributesToEServiceForm attributeKey="certified" readOnly={false} />
            <Divider sx={{ my: 3 }} />
            <AddAttributesToEServiceForm
              attributeKey="verified"
              readOnly={false}
              openCreateAttributeDrawer={handleOpenAttributeCreateDrawerFactory('verified')}
            />
            <Divider sx={{ my: 3 }} />
            <AddAttributesToEServiceForm
              attributeKey="declared"
              readOnly={false}
              openCreateAttributeDrawer={handleOpenAttributeCreateDrawerFactory('declared')}
            />
          </SectionContainer>
          <StepActions
            back={{
              label: t('backWithoutSaveBtn'),
              type: 'button',
              onClick: back,
              startIcon: <ArrowBackIcon />,
            }}
            forward={{ label: t('forwardWithSaveBtn'), type: 'submit', startIcon: <SaveIcon /> }}
          />
        </Box>
      </FormProvider>
      <CreateAttributeDrawer
        {...createAttributeCreateDrawerState}
        onClose={handleCloseAttributeCreateDrawer}
      />
    </>
  )
}

export const EServiceCreateStepAttributesSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={924} />
}
