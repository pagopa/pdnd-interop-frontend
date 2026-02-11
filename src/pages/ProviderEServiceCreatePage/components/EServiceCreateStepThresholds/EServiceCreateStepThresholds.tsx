import { type ActiveStepProps } from '@/hooks/useActiveStep'
import { useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { EServiceMutations } from '@/api/eservice'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'
import React from 'react'
import { type AttributeKey } from '@/types/attribute.types'
import {
  type ProducerEServiceDescriptor,
  type DescriptorAttribute,
  type DescriptorAttributes,
  type UpdateEServiceDescriptorSeed,
} from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { Box, Stack } from '@mui/material'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { useActiveTab } from '@/hooks/useActiveTab'
import { AddAttributesToForm } from '@/components/shared/AddAttributesToForm'
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

export type CreateStepThresholdsFormValues = {
  dailyCallsPerConsumer?: number
  dailyCallsTotal?: number
  attributes: DescriptorAttributes
}

export const EServiceCreateStepThresholds: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const { descriptor, forward, back } = useEServiceCreateContext()
  const { activeTab, updateActiveTab } = useActiveTab('certified')

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

    // TODO: Check if it is correct to default some fields
    const payload: UpdateEServiceDescriptorSeed & {
      eserviceId: string
      descriptorId: string
    } = {
      audience: [],
      voucherLifespan: 0,
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
        <Box component={'form'} noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <SectionContainer title={t('step2.thresholdSection.title')} sx={{ mt: 3 }}>
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <RHFTextField
                size="small"
                name="dailyCallsPerConsumer"
                label={t('step2.thresholdSection.dailyCallsPerConsumerField.label')}
                type="number"
                inputProps={{ min: '1' }}
                rules={{ required: true, min: 1 }}
                sx={{ my: 0, flex: 1 }}
              />

              <RHFTextField
                size="small"
                name="dailyCallsTotal"
                label={t('step2.thresholdSection.dailyCallsTotalField.label')}
                type="number"
                inputProps={{ min: '1' }}
                sx={{ my: 0, flex: 1 }}
                rules={{
                  required: true,
                  min: {
                    value: dailyCallsPerConsumer ?? 1,
                    message: t('step2.thresholdSection.dailyCallsTotalField.validation.min'),
                  },
                }}
              />
            </Stack>
          </SectionContainer>

          <SectionContainer
            title={t('step3.attributesTitle', { versionNumber: descriptor?.version ?? '1' })}
            description={t('step3.attributesDescription')}
            sx={{ mt: 3 }}
          >
            <TabContext value={activeTab}>
              <TabList onChange={updateActiveTab} aria-label={t('step2.attributes.tabs.ariaLabel')}>
                <Tab label={t('step2.attributes.tabs.certified')} value="certified" />
                <Tab label={t('step2.attributes.tabs.verified')} value="verified" />
                <Tab label={t('step2.attributes.tabs.declared')} value="declared" />
              </TabList>
              <TabPanel value="certified">
                <AddAttributesToForm
                  attributeKey="certified"
                  readOnly={isEServiceCreatedFromTemplate}
                />
              </TabPanel>
              <TabPanel value="verified">
                <AddAttributesToForm
                  attributeKey="verified"
                  readOnly={isEServiceCreatedFromTemplate}
                  openCreateAttributeDrawer={handleOpenAttributeCreateDrawerFactory('verified')}
                />
              </TabPanel>
              <TabPanel value="declared">
                <AddAttributesToForm
                  attributeKey="declared"
                  readOnly={isEServiceCreatedFromTemplate}
                  openCreateAttributeDrawer={handleOpenAttributeCreateDrawerFactory('declared')}
                />
              </TabPanel>
            </TabContext>
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
      <CustomizeThresholdDrawer
        dailyCallsTotal={dailyCallsTotal}
        dailyCallsPerConsumer={dailyCallsPerConsumer}
        onSubmit={handleSubmitCustomizeThresholdDrawer}
      />
    </>
  )
}
