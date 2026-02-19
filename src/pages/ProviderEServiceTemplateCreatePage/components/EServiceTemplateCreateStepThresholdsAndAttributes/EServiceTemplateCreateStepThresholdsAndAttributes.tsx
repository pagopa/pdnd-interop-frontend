import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { RHFSwitch, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { Alert, Box, Link, Stack, Tab, Typography } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { compareObjects } from '@/utils/common.utils'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'
import type {
  DescriptorAttribute,
  DescriptorAttributes,
  UpdateEServiceTemplateVersionSeed,
} from '@/api/api.generatedTypes'
import { attributesHelpLink } from '@/config/constants'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useActiveTab } from '@/hooks/useActiveTab'
import { AddAttributesToForm } from '@/components/shared/AddAttributesToForm'
import { CreateAttributeDrawer } from '@/components/shared/CreateAttributeDrawer'
import type { AttributeKey } from '@/types/attribute.types'

type EServiceTemplateCreateStepThresholdsAndAttributesFormValues = {
  dailyCallsPerConsumer?: number
  dailyCallsTotal?: number
  thresholdsSection: boolean
  attributes: DescriptorAttributes
}

export const EServiceTemplateCreateStepThresholdsAndAttributes: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eserviceTemplate', { keyPrefix: 'create' })

  const { eserviceTemplateVersion, forward, back } = useEServiceTemplateCreateContext()

  const { mutate: updateVersionDraft } = EServiceTemplateMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  const defaultValues: EServiceTemplateCreateStepThresholdsAndAttributesFormValues = {
    thresholdsSection:
      eserviceTemplateVersion?.dailyCallsPerConsumer && eserviceTemplateVersion.dailyCallsTotal
        ? true
        : false,
    dailyCallsPerConsumer: eserviceTemplateVersion?.dailyCallsPerConsumer,
    dailyCallsTotal: eserviceTemplateVersion?.dailyCallsTotal,
    attributes: eserviceTemplateVersion?.attributes ?? {
      certified: [],
      verified: [],
      declared: [],
    },
  }

  const formMethods = useForm({ defaultValues })
  const isThresholdSectionVisible = formMethods.watch('thresholdsSection')

  const { activeTab, updateActiveTab } = useActiveTab('certified')

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

  const onSubmit = (values: EServiceTemplateCreateStepThresholdsAndAttributesFormValues) => {
    if (!eserviceTemplateVersion) return

    const removeEmptyAttributeGroups = (attributes: Array<Array<DescriptorAttribute>>) => {
      return attributes.filter((group) => group.length > 0)
    }

    const attributes = {
      certified: removeEmptyAttributeGroups(values.attributes.certified),
      verified: removeEmptyAttributeGroups(values.attributes.verified),
      declared: removeEmptyAttributeGroups(values.attributes.declared),
    }

    const newData = {
      thresholdsSection: values.thresholdsSection,
      dailyCallsPerConsumer: values.thresholdsSection ? values.dailyCallsPerConsumer : undefined,
      dailyCallsTotal: values.thresholdsSection ? values.dailyCallsTotal : undefined,
      attributes,
    }

    const currentData = {
      thresholdsSection: defaultValues.thresholdsSection,
      dailyCallsPerConsumer: defaultValues.thresholdsSection
        ? defaultValues.dailyCallsPerConsumer
        : undefined,
      dailyCallsTotal: defaultValues.thresholdsSection ? defaultValues.dailyCallsTotal : undefined,
      attributes: eserviceTemplateVersion.attributes,
    }

    if (compareObjects(newData, currentData)) {
      forward()
      return
    }

    const payload: UpdateEServiceTemplateVersionSeed = {
      description: eserviceTemplateVersion.description,
      attributes: remapDescriptorAttributesToDescriptorAttributesSeed(attributes),
      voucherLifespan: eserviceTemplateVersion.voucherLifespan,
      agreementApprovalPolicy: eserviceTemplateVersion.agreementApprovalPolicy,
      dailyCallsPerConsumer: newData.dailyCallsPerConsumer,
      dailyCallsTotal: newData.dailyCallsTotal,
    }

    updateVersionDraft(
      {
        ...payload,
        eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
        eServiceTemplateVersionId: eserviceTemplateVersion.id,
      },
      { onSuccess: forward }
    )
  }

  const dailyCallsPerConsumer = formMethods.watch('dailyCallsPerConsumer')

  return (
    <>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <SectionContainer
            title={t('stepThresholdsAndAttributes.thresholdsTitle')}
            component="div"
          >
            <RHFSwitch
              label={t('stepThresholdsAndAttributes.thresholdsSwitch.label')}
              name="thresholdsSection"
              sx={{ my: 0, ml: 1 }}
            />
            {isThresholdSectionVisible && (
              <>
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <RHFTextField
                    size="small"
                    name="dailyCallsPerConsumer"
                    label={t('stepThresholdsAndAttributes.dailyCallsPerConsumerField.label')}
                    infoLabel={t(
                      'stepThresholdsAndAttributes.dailyCallsPerConsumerField.infoLabel'
                    )}
                    type="number"
                    inputProps={{ min: '1' }}
                    rules={{ required: true, min: 1 }}
                    sx={{ my: 0, flex: 1 }}
                    required
                  />
                  <RHFTextField
                    size="small"
                    name="dailyCallsTotal"
                    label={t('stepThresholdsAndAttributes.dailyCallsTotalField.label')}
                    infoLabel={t('stepThresholdsAndAttributes.dailyCallsTotalField.infoLabel')}
                    type="number"
                    inputProps={{ min: '1' }}
                    sx={{ my: 0, flex: 1 }}
                    rules={{
                      required: true,
                      min: {
                        value: dailyCallsPerConsumer ?? 1,
                        message: t(
                          'stepThresholdsAndAttributes.dailyCallsTotalField.validation.min'
                        ),
                      },
                    }}
                    required
                  />
                </Stack>
                <Alert severity="info" sx={{ mt: 3 }}>
                  {t('stepThresholdsAndAttributes.thresholdsInfoAlert')}
                </Alert>
              </>
            )}
          </SectionContainer>

          <SectionContainer
            title={t('stepThresholdsAndAttributes.accessRequirements.title')}
            description={
              <>
                {t('stepThresholdsAndAttributes.accessRequirements.description')}{' '}
                <Link href={attributesHelpLink} target="_blank" underline="hover">
                  {t('stepThresholdsAndAttributes.accessRequirements.learnMoreLink')}
                </Link>
              </>
            }
            component="div"
            sx={{ mt: 4 }}
          >
            <TabContext value={activeTab}>
              <Box sx={{ borderBottom: 2, borderColor: 'divider', width: 'fit-content' }}>
                <TabList onChange={updateActiveTab} sx={{ mb: '-2px' }}>
                  <Tab
                    label={t('stepThresholdsAndAttributes.accessRequirements.tabs.certified')}
                    value="certified"
                  />
                  <Tab
                    label={t('stepThresholdsAndAttributes.accessRequirements.tabs.verified')}
                    value="verified"
                  />
                  <Tab
                    label={t('stepThresholdsAndAttributes.accessRequirements.tabs.declared')}
                    value="declared"
                  />
                </TabList>
              </Box>
              <TabPanel value="certified" sx={{ px: 0, pb: 0 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <Trans
                    ns="eserviceTemplate"
                    i18nKey="create.stepThresholdsAndAttributes.accessRequirements.tabs.certifiedDescription"
                    components={{
                      1: <Link underline="hover" href={attributesHelpLink} target="_blank" />,
                    }}
                  />
                </Typography>
                <AddAttributesToForm
                  attributeKey="certified"
                  readOnly={false}
                  hideTitle
                  addGroupLabel={t(
                    'stepThresholdsAndAttributes.accessRequirements.createRequirementBtn'
                  )}
                />
              </TabPanel>
              <TabPanel value="verified" sx={{ px: 0, pb: 0 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <Trans
                    ns="eserviceTemplate"
                    i18nKey="create.stepThresholdsAndAttributes.accessRequirements.tabs.verifiedDescription"
                    components={{
                      1: <Link underline="hover" href={attributesHelpLink} target="_blank" />,
                    }}
                  />
                </Typography>
                <AddAttributesToForm
                  attributeKey="verified"
                  readOnly={false}
                  hideTitle
                  addGroupLabel={t(
                    'stepThresholdsAndAttributes.accessRequirements.createRequirementBtn'
                  )}
                  createAttributeLabel={t('step3.attributesCreateBtn')}
                  openCreateAttributeDrawer={handleOpenAttributeCreateDrawerFactory('verified')}
                />
              </TabPanel>
              <TabPanel value="declared" sx={{ px: 0, pb: 0 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {t('stepThresholdsAndAttributes.accessRequirements.tabs.declaredDescription')}
                </Typography>
                <AddAttributesToForm
                  attributeKey="declared"
                  readOnly={false}
                  hideTitle
                  addGroupLabel={t(
                    'stepThresholdsAndAttributes.accessRequirements.createRequirementBtn'
                  )}
                  createAttributeLabel={t('step3.attributesCreateBtn')}
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
    </>
  )
}

export const EServiceTemplateCreateStepThresholdsAndAttributesSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={550} />
}
