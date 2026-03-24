import { type ActiveStepProps } from '@/hooks/useActiveStep'
import { Trans, useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { EServiceMutations } from '@/api/eservice'
import { type SubmitHandler, useForm, FormProvider, useWatch } from 'react-hook-form'
import React from 'react'
import { type AttributeKey } from '@/types/attribute.types'
import {
  type ProducerEServiceDescriptor,
  type DescriptorAttribute,
  type DescriptorAttributes,
  type UpdateEServiceDescriptorSeed,
} from '@/api/api.generatedTypes'
import { useAttributesCountersAlert } from './useAttributesCountersAlert'
import { Alert, Box } from '@mui/material'
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
import { EServiceThresholdSection } from '../sections/EServiceThresholdSection'
import { EServiceAttributesSection } from '../sections/EServiceAttributesSection'
import { SectionContainerSkeleton } from '@/components/layout/containers'

export type CreateStepThresholdsFormValues = {
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
  attributes: DescriptorAttributes
}

export const EServiceCreateStepThresholds: React.FC<ActiveStepProps> = () => {
  const { t, i18n } = useTranslation('eservice', { keyPrefix: 'create' })
  const { descriptor, forward, back } = useEServiceCreateContext()

  const { mutate: updateVersionDraft } = EServiceMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  const formMethods = useForm({
    defaultValues: {
      dailyCallsPerConsumer: descriptor!.dailyCallsPerConsumer,
      dailyCallsTotal: descriptor!.dailyCallsTotal,
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
    formMethods.trigger('dailyCallsTotal')
    closeCustomizeThresholdDrawer()
  }

  const dailyCallsPerConsumer = formMethods.watch('dailyCallsPerConsumer')
  const dailyCallsTotal = formMethods.watch('dailyCallsTotal')
  const certifiedAttributes = useWatch({
    control: formMethods.control,
    name: 'attributes.certified',
  })
  const watchedAttributes = formMethods.watch('attributes')

  const { totalRequirements, attributeTypesWithRequirements } = useAttributesCountersAlert({
    attributes: watchedAttributes,
    t,
  })

  const maxCustomThreshold = certifiedAttributes
    .flat()
    .reduce(
      (max, attr) =>
        attr.dailyCallsPerConsumer !== undefined ? Math.max(max, attr.dailyCallsPerConsumer) : max,
      0
    )

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
      dailyCallsPerConsumer: values.dailyCallsPerConsumer,
      dailyCallsTotal: values.dailyCallsTotal,
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
      dailyCallsPerConsumer: values.dailyCallsPerConsumer,
      dailyCallsTotal: values.dailyCallsTotal,
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
          <EServiceThresholdSection
            limitsSuggestions={
              isEServiceCreatedFromTemplate
                ? {
                    dailyCallsTotal: descriptor?.dailyCallsTotal ?? 1,
                    dailyCallsPerConsumer: descriptor?.dailyCallsPerConsumer ?? 1,
                  }
                : undefined
            }
            maxCustomThreshold={maxCustomThreshold || undefined}
          />
          <EServiceAttributesSection
            isEServiceCreatedFromTemplate={isEServiceCreatedFromTemplate}
            handleOpenAttributeCreateDrawerFactory={handleOpenAttributeCreateDrawerFactory}
          />
          {totalRequirements > 1 && (
            <Alert severity="info" sx={{ mt: 3 }}>
              <Trans
                ns="eservice"
                i18nKey="create.requirementsSummaryAlert"
                values={{
                  count: totalRequirements,
                  attributeTypes: new Intl.ListFormat(i18n.language, {
                    type: 'conjunction',
                  }).format(attributeTypesWithRequirements),
                }}
                components={{ 1: <strong />, 3: <strong /> }}
              />
            </Alert>
          )}
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
        title={t('step2.attributes.customizeThresholdDrawer.title')}
        subtitle={
          <Trans
            ns="eservice"
            i18nKey="create.step2.attributes.customizeThresholdDrawer.subtitle"
            values={{ name: attribute?.name }}
            components={{ 1: <strong /> }}
          />
        }
        alertLabel={t('step2.attributes.customizeThresholdDrawer.alert')}
        submitButtonLabel={t('step2.attributes.customizeThresholdDrawer.submitBtnLabel')}
      />
    </>
  )
}

export const EServiceCreateStepThresholdsSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={354} />
}
