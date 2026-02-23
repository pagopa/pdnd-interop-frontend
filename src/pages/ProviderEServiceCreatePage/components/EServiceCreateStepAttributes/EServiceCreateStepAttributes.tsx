import { SectionContainerSkeleton } from '@/components/layout/containers'
import { Box } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
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
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { CreateAttributeDrawer } from '../../../../components/shared/CreateAttributeDrawer'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'
import { AttributesSection } from '../sections/AttributesSection'

export type CreateStepAttributesFormValues = {
  attributes: DescriptorAttributes
}

export const EServiceCreateStepAttributes: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const { descriptor, forward, back } = useEServiceCreateContext()

  const { mutate: updateVersionDraft } = EServiceMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  const isReadOnly = Boolean(descriptor?.templateRef?.templateVersionId)

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

  const defaultValues: CreateStepAttributesFormValues = {
    attributes: descriptor?.attributes ?? { certified: [], verified: [], declared: [] },
  }

  const formMethods = useForm({ defaultValues })

  const onSubmit = (values: CreateStepAttributesFormValues) => {
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
          <AttributesSection
            isEServiceCreatedFromTemplate={isReadOnly}
            handleOpenAttributeCreateDrawerFactory={handleOpenAttributeCreateDrawerFactory}
          />
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
