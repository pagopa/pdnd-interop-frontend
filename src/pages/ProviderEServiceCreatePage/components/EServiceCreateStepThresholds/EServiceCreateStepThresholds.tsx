import { type ActiveStepProps } from '@/hooks/useActiveStep'
import { useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { EServiceMutations } from '@/api/eservice'
import { type SubmitHandler, useForm, FormProvider } from 'react-hook-form'
import React from 'react'
import { type AttributeKey } from '@/types/attribute.types'
import {
  type ProducerEServiceDescriptor,
  type DescriptorAttribute,
  type DescriptorAttributes,
  type UpdateEServiceDescriptorSeed,
} from '@/api/api.generatedTypes'
import { Box } from '@mui/material'
import { StepActions } from '@/components/shared/StepActions'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import { CreateAttributeDrawer } from '@/components/shared/CreateAttributeDrawer'
import { compareObjects } from '@/utils/common.utils'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'
import {
  CustomizeThresholdDrawer,
  useCustomizeThresholdDrawer,
} from '@/components/shared/CustomizeThresholdDrawer'
import { ThresholdSection } from '../sections/ThresholdSection'
import { AttributesSection } from '../sections/AttributesSection'
import { SectionContainerSkeleton } from '@/components/layout/containers'

export type CreateStepThresholdsFormValues = {
  dailyCallsPerConsumer?: number
  dailyCallsTotal?: number
  attributes: DescriptorAttributes
}

export const EServiceCreateStepThresholds: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const { descriptor, forward, back } = useEServiceCreateContext()

  const { mutate: updateVersionDraft } = EServiceMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  const formMethods = useForm({
    defaultValues: {
      dailyCallsPerConsumer: descriptor?.dailyCallsPerConsumer,
      dailyCallsTotal: descriptor?.dailyCallsTotal,
      attributes: descriptor?.attributes ?? { certified: [], verified: [], declared: [] },
    },
  })

  const {
    attribute,
    attributeGroupIndex,
    close: closeCustomizeThresholdDrawer,
  } = useCustomizeThresholdDrawer()

  const isEServiceCreatedFromTemplate = Boolean(descriptor?.templateRef?.templateVersionId)

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

  const handleSubmitCustomizeThresholdDrawer = (threshold: number) => {
    if (!attribute || attributeGroupIndex === undefined) return

    const attributes = formMethods.getValues('attributes')
    const groups = attributes['certified']
    const group = groups[attributeGroupIndex]

    groups[attributeGroupIndex] = group.map((att) =>
      att.id === attribute.id ? { ...att, dailyCallsPerConsumer: threshold } : att
    )

    formMethods.setValue(`attributes.certified`, groups, {
      shouldValidate: false,
    })
    closeCustomizeThresholdDrawer()
  }

  const dailyCallsPerConsumer = formMethods.watch('dailyCallsPerConsumer')
  const dailyCallsTotal = formMethods.watch('dailyCallsTotal')

  const onSubmit: SubmitHandler<CreateStepThresholdsFormValues> = (values) => {
    if (!descriptor) return

    const removeEmptyAttributeGroups = (attributes: Array<Array<DescriptorAttribute>>) => {
      return attributes.filter((group) => group.length > 0)
    }

    const attributes = {
      certified: removeEmptyAttributeGroups(values.attributes.certified),
      verified: removeEmptyAttributeGroups(values.attributes.verified),
      declared: removeEmptyAttributeGroups(values.attributes.declared),
    }

    const newDescriptorData: ProducerEServiceDescriptor = {
      ...descriptor,
      dailyCallsPerConsumer: values.dailyCallsPerConsumer ?? 1,
      dailyCallsTotal: values.dailyCallsTotal ?? 1,
      attributes,
    }

    const areDescriptorsEquals = compareObjects(newDescriptorData, descriptor)
    if (areDescriptorsEquals) {
      forward()
      return
    }

    const payload: UpdateEServiceDescriptorSeed & {
      eserviceId: string
      descriptorId: string
    } = {
      audience: descriptor.audience,
      voucherLifespan: descriptor.voucherLifespan,
      dailyCallsPerConsumer: values.dailyCallsPerConsumer ?? 1,
      dailyCallsTotal: values.dailyCallsTotal ?? 1,
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
        <Box component={'form'} noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <ThresholdSection />
          <AttributesSection
            title={t('step3.attributesTitle', { versionNumber: descriptor?.version ?? '1' })}
            isEServiceCreatedFromTemplate={isEServiceCreatedFromTemplate}
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
      <CustomizeThresholdDrawer
        dailyCallsTotal={dailyCallsTotal}
        dailyCallsPerConsumer={dailyCallsPerConsumer}
        onSubmit={handleSubmitCustomizeThresholdDrawer}
      />
    </>
  )
}

export const EServiceCreateStepThresholdsSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={354} />
}
