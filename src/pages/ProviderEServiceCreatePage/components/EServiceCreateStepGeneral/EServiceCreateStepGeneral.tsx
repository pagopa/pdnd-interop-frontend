import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Alert, Box, Link, Stack, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import {
  RHFCheckbox,
  RHFRadioGroup,
  RHFSwitch,
  RHFTextField,
} from '@/components/shared/react-hook-form-inputs'
import { StepActions } from '@/components/shared/StepActions'
import { useNavigate, useParams } from '@/router'
import { EServiceMutations } from '@/api/eservice'
import type {
  EServiceMode,
  EServiceTechnology,
  EServiceTemplateDetails,
  InstanceEServiceSeed,
  ProducerEServiceDescriptor,
} from '@/api/api.generatedTypes'
import { compareObjects } from '@/utils/common.utils'
import { AxiosError } from 'axios'
import SaveIcon from '@mui/icons-material/Save'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { IconLink } from '@/components/shared/IconLink'
import LaunchIcon from '@mui/icons-material/Launch'
import {
  delegationEServiceGuideLink,
  delegationGuideLink,
  eserviceNamingBestPracticeLink,
  SIGNALHUB_GUIDE_URL,
} from '@/config/constants'
import { trackEvent } from '@/config/tracking'
import { AuthHooks } from '@/api/auth'
import {
  EServiceTemplateMutations,
  DUPLICATE_INSTANCE_LABEL_ERROR_CODE,
} from '@/api/eserviceTemplate'
import {
  FEATURE_FLAG_ESERVICE_PERSONAL_DATA,
  SIGNALHUB_PERSONAL_DATA_PROCESS_URL,
} from '@/config/env'
import { InstanceLabelSection } from './InstanceLabelSection'

export type EServiceCreateStepGeneralFormValues = {
  name: string
  description: string
  technology: EServiceTechnology
  mode: EServiceMode
  personalData: boolean | undefined
  isSignalHubEnabled: boolean
  isConsumerDelegable: boolean
  isClientAccessDelegable: boolean
  instanceLabel: string
}

type SignalHubSectionProps = {
  isSignalHubActivationEditable: boolean
}

export const EServiceCreateStepGeneral: React.FC = () => {
  const { isOrganizationAllowedToProduce } = AuthHooks.useJwt()

  const { t } = useTranslation('eservice')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'validation.mixed' })
  const navigate = useNavigate()

  const { eServiceTemplateId } = useParams<'PROVIDE_ESERVICE_FROM_TEMPLATE_CREATE'>()

  const {
    descriptor,
    areEServiceGeneralInfoEditable,
    forward,
    eserviceMode,
    onEserviceModeChange,
    eserviceTemplate,
  } = useEServiceCreateContext()

  const { mutate: updateDraft } = EServiceMutations.useUpdateDraft()
  const { mutate: createDraft } = EServiceMutations.useCreateDraft()
  const { mutate: createDraftFromTemplate } =
    EServiceTemplateMutations.useCreateInstanceFromEServiceTemplate()
  const { mutate: updateDraftFromTemplate } =
    EServiceTemplateMutations.useUpdateInstanceFromEServiceTemplate()

  const isEserviceFromTemplate = Boolean(descriptor?.templateRef) || !!eserviceTemplate
  const isInstanceLabelReadonly = Boolean(descriptor && descriptor.version !== '1')

  // If Template ID is present we are inheriting an e-service fields from a eserviceTemplate
  const defaultValues = evaluateFormDefaultValues(eserviceTemplate, descriptor, eserviceMode)
  const formMethods = useForm({ defaultValues })

  /**
   * Resolves the instanceLabel form value to the API payload value:
   * - non-empty string → trimmed string (BE validates the label)
   * - empty string, whitespace-only string → undefined (axios omits the key from JSON, BE validates the undefined value for the label)
   */
  const resolveInstanceLabel = (instanceLabelFormValue: string): string | undefined => {
    const trimmed = instanceLabelFormValue.trim()
    return trimmed === '' ? undefined : trimmed
  }

  /**
   * Handles duplicate instance label errors by showing an inline error on the field.
   * Other errors are handled by the mutation's errorToastLabel (generic toast).
   */
  const handleDuplicateInstanceLabelError = (error: unknown) => {
    if (!(error instanceof AxiosError)) return
    const errorCode = error.response?.data?.errors?.[0]?.code
    if (errorCode === DUPLICATE_INSTANCE_LABEL_ERROR_CODE) {
      const instanceLabelValue = formMethods.getValues('instanceLabel')
      formMethods.setError('instanceLabel', {
        message: instanceLabelValue
          ? t('create.step1.instanceLabelField.validation.duplicate')
          : t('create.step1.instanceLabelField.validation.emptyNotAvailable'),
      })
    }
  }

  const onSubmit = (formValues: EServiceCreateStepGeneralFormValues & InstanceEServiceSeed) => {
    // If we are editing an existing e-service, we update the draft
    if (descriptor) {
      // If nothing has changed skip the update call
      const isEServiceTheSame = compareObjects(formValues, descriptor?.eservice)

      if (!isEServiceTheSame) {
        isEserviceFromTemplate
          ? updateDraftFromTemplate(
              {
                eServiceId: descriptor.eservice.id,
                isClientAccessDelegable: formValues.isClientAccessDelegable,
                isConsumerDelegable: formValues.isConsumerDelegable,
                isSignalHubEnabled: formValues.isSignalHubEnabled,
                instanceLabel: resolveInstanceLabel(formValues.instanceLabel),
              },
              { onSuccess: forward, onError: handleDuplicateInstanceLabelError }
            )
          : updateDraft(
              { eserviceId: descriptor.eservice.id, ...formValues },
              { onSuccess: forward }
            )
      } else forward()

      return
    }

    onCreateDraft(formValues)
  }

  const onCreateDraft = (
    formValues: EServiceCreateStepGeneralFormValues & InstanceEServiceSeed
  ) => {
    // If we are creating a new e-service we need to understand if we are creating it from a eserviceTemplate or not
    if (!eserviceTemplate) {
      createDraft(formValues, {
        onSuccess({ id, descriptorId }) {
          navigate('PROVIDE_ESERVICE_EDIT', {
            params: { eserviceId: id, descriptorId },
            replace: true,
            state: { stepIndexDestination: 1 },
          })
          forward()
        },
      })
    } else {
      const body: InstanceEServiceSeed & { eServiceTemplateId: string } = {
        eServiceTemplateId: eServiceTemplateId,
        isClientAccessDelegable: formValues.isClientAccessDelegable,
        isConsumerDelegable: formValues.isConsumerDelegable,
        isSignalHubEnabled: formValues.isSignalHubEnabled,
        instanceLabel: resolveInstanceLabel(formValues.instanceLabel),
      }

      createDraftFromTemplate(body, {
        onSuccess({ id, descriptorId }) {
          navigate('PROVIDE_ESERVICE_EDIT', {
            params: { eserviceId: id, descriptorId },
            replace: true,
            state: { stepIndexDestination: 1 },
          })
          forward()
        },
        onError: handleDuplicateInstanceLabelError,
      })
    }
  }

  return (
    <FormProvider {...formMethods}>
      {!isEserviceFromTemplate && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {t('create.step1.firstVersionOnlyEditableInfo')}
        </Alert>
      )}
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer
          title={t('create.step1.detailsTitle')}
          description={
            <>
              {t('create.step1.detailsDescription.before')}{' '}
              <IconLink
                href={eserviceNamingBestPracticeLink}
                target="_blank"
                endIcon={<LaunchIcon fontSize="small" />}
                onClick={() =>
                  trackEvent('INTEROP_EXT_LINK_DTD_ESERVICE_GUIDE', {
                    src: 'CREATE_ESERVICE',
                  })
                }
              >
                {t('create.step1.detailsDescription.linkLabel')}
              </IconLink>{' '}
              {t('create.step1.detailsDescription.after')}
            </>
          }
          component="div"
        >
          <RHFTextField
            label={t('create.step1.eserviceNameField.label')}
            infoLabel={t('create.step1.eserviceNameField.infoLabel')}
            name="name"
            disabled={!areEServiceGeneralInfoEditable || isEserviceFromTemplate}
            rules={{ required: true, minLength: 5 }}
            focusOnMount
            inputProps={{ maxLength: 60 }}
            size="small"
            sx={{ width: '49%', my: 0, mt: 1 }}
          />

          <RHFTextField
            label={t('create.step1.eserviceDescriptionField.label')}
            infoLabel={t('create.step1.eserviceDescriptionField.infoLabel')}
            name="description"
            multiline
            disabled={!areEServiceGeneralInfoEditable || isEserviceFromTemplate}
            size="small"
            inputProps={{ maxLength: 250 }}
            rules={!eserviceTemplate ? { required: true, minLength: 10 } : undefined}
            sx={{ mb: 0, mt: 3 }}
          />

          <RHFRadioGroup
            name="technology"
            row
            label={t('create.step1.eserviceTechnologyField.label')}
            options={[
              { label: 'REST', value: 'REST' },
              { label: 'SOAP', value: 'SOAP' },
            ]}
            disabled={!areEServiceGeneralInfoEditable || isEserviceFromTemplate}
            rules={{ required: true }}
            sx={{ mb: 0, mt: 3 }}
          />

          <RHFRadioGroup
            name="mode"
            row
            label={t('create.step1.eserviceModeField.label')}
            options={[
              {
                label: t('create.step1.eserviceModeField.options.DELIVER'),
                value: 'DELIVER',
              },
              {
                label: t('create.step1.eserviceModeField.options.RECEIVE'),
                value: 'RECEIVE',
              },
            ]}
            disabled={!areEServiceGeneralInfoEditable || isEserviceFromTemplate}
            rules={{ required: true }}
            sx={{ mb: 0, mt: 3 }}
            onValueChange={(mode) => onEserviceModeChange!(mode as EServiceMode)}
          />
          {FEATURE_FLAG_ESERVICE_PERSONAL_DATA && (
            <>
              <RHFRadioGroup
                name="personalData"
                row
                label={t(`create.step1.eservicePersonalDataField.${eserviceMode}.label`)}
                options={[
                  {
                    label: t(`create.step1.eservicePersonalDataField.${eserviceMode}.options.true`),
                    value: true,
                  },
                  {
                    label: t(
                      `create.step1.eservicePersonalDataField.${eserviceMode}.options.false`
                    ),
                    value: false,
                  },
                ]}
                disabled={!areEServiceGeneralInfoEditable || isEserviceFromTemplate}
                rules={{
                  validate: (value) => value === true || value === false || tCommon('required'),
                }}
                sx={{ mb: 3, mt: 3 }}
                isOptionValueAsBoolean
              />
              {isEserviceFromTemplate && eserviceTemplate?.personalData === undefined && (
                <Alert severity="error" variant="outlined">
                  {t('create.step1.eservicePersonalDataField.alertMissingPersonalData', {
                    tenantName: eserviceTemplate?.creator.name,
                  })}
                </Alert>
              )}
            </>
          )}
        </SectionContainer>

        {isEserviceFromTemplate && (
          <InstanceLabelSection
            templateName={eserviceTemplate?.name ?? descriptor?.templateRef?.templateName ?? ''}
            instanceLabel={formMethods.watch('instanceLabel')}
            disabled={isInstanceLabelReadonly}
          />
        )}

        {/* Signalhub switch can be editable also if coming from a eservice eserviceTemplate */}
        <SignalHubSection isSignalHubActivationEditable={areEServiceGeneralInfoEditable} />

        {isOrganizationAllowedToProduce && (
          <SectionContainer
            title={t('create.step1.delegationSection.title')}
            description={
              <Trans
                components={{
                  1: <Link underline="hover" href={delegationGuideLink} target="_blank" />,
                }}
              >
                {t('create.step1.delegationSection.description')}
              </Trans>
            }
            component="div"
          >
            <SectionContainer
              innerSection
              title={t('create.step1.delegationSection.delegationField.label')}
              sx={{ mt: 3 }}
            >
              <RHFSwitch
                label={t('create.step1.delegationSection.delegationField.switchLabel')}
                name="isConsumerDelegable"
                disabled={!areEServiceGeneralInfoEditable}
                sx={{ my: 0, ml: 1 }}
              />
            </SectionContainer>

            {formMethods.watch('isConsumerDelegable') && (
              <SectionContainer
                innerSection
                title={t('create.step1.delegationSection.clientAccessDelegableField.label')}
                sx={{ mt: 3 }}
              >
                <RHFCheckbox
                  name="isClientAccessDelegable"
                  label={
                    <Trans
                      components={{
                        1: (
                          <Link
                            underline="hover"
                            href={delegationEServiceGuideLink}
                            target="_blank"
                          />
                        ),
                      }}
                    >
                      {t('create.step1.delegationSection.clientAccessDelegableField.checkboxLabel')}
                    </Trans>
                  }
                />
              </SectionContainer>
            )}
          </SectionContainer>
        )}

        <StepActions
          forward={
            !areEServiceGeneralInfoEditable
              ? {
                  label: t('create.forwardWithoutSaveBtn'),
                  endIcon: <ArrowForwardIcon />,
                  onClick: forward,
                  type: 'button',
                }
              : { label: t('create.forwardWithSaveBtn'), type: 'submit', startIcon: <SaveIcon /> }
          }
        />
      </Box>
    </FormProvider>
  )
}

export const EServiceCreateStepGeneralSkeleton: React.FC = () => {
  return (
    <>
      <SectionContainerSkeleton height={354} />
    </>
  )
}

const SignalHubSectionDescription: React.FC = () => {
  const { t } = useTranslation('eservice')
  return (
    <>
      <Stack spacing={1}>
        <Typography color="text.secondary" variant="body2">
          {t('create.step1.isSignalHubEnabled.description.firstParagraph.before')}{' '}
          <IconLink
            href={SIGNALHUB_GUIDE_URL}
            target="_blank"
            endIcon={<LaunchIcon fontSize="small" />}
          >
            {' '}
            {t('create.step1.isSignalHubEnabled.description.firstParagraph.linkLabel')}
          </IconLink>{' '}
          {t('create.step1.isSignalHubEnabled.description.firstParagraph.after')}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {t('create.step1.isSignalHubEnabled.description.secondParagraph.before')}{' '}
          <Link href={SIGNALHUB_PERSONAL_DATA_PROCESS_URL} target="_blank" underline="none">
            {t('create.step1.isSignalHubEnabled.description.secondParagraph.linkLabel')}
          </Link>{' '}
          {t('create.step1.isSignalHubEnabled.description.secondParagraph.after')}
        </Typography>
      </Stack>
    </>
  )
}

const SignalHubSection: React.FC<SignalHubSectionProps> = ({ isSignalHubActivationEditable }) => {
  const isAdmin = AuthHooks.useJwt().isAdmin
  const { t } = useTranslation('eservice')

  return (
    <SectionContainer
      title={t('create.step1.isSignalHubEnabled.title')}
      description={<SignalHubSectionDescription />}
      component="div"
    >
      {!isAdmin && <Alert severity="warning">{t('create.step1.isSignalHubEnabled.alert')}</Alert>}
      <SectionContainer innerSection sx={{ mt: 3 }}>
        <RHFSwitch
          label={t('create.step1.isSignalHubEnabled.switchLabel')}
          name="isSignalHubEnabled"
          disabled={!isSignalHubActivationEditable}
          sx={{ my: 0, ml: 1 }}
        />
      </SectionContainer>
    </SectionContainer>
  )
}

function evaluateFormDefaultValues(
  eserviceTemplate: EServiceTemplateDetails | undefined,
  descriptor: ProducerEServiceDescriptor | undefined,
  eserviceMode: EServiceMode
): EServiceCreateStepGeneralFormValues {
  if (!eserviceTemplate)
    return {
      name: descriptor?.eservice.name ?? '',
      description: descriptor?.eservice.description ?? '',
      technology: descriptor?.eservice.technology ?? 'REST',
      mode: eserviceMode,
      personalData: descriptor?.eservice.personalData,
      isSignalHubEnabled: descriptor?.eservice.isSignalHubEnabled ?? false,
      isConsumerDelegable: descriptor?.eservice.isConsumerDelegable ?? true,
      isClientAccessDelegable: descriptor?.eservice.isClientAccessDelegable ?? true,
      instanceLabel: descriptor?.eservice.instanceLabel ?? '',
    }

  return {
    name: eserviceTemplate?.name,
    description: eserviceTemplate?.description,
    technology: eserviceTemplate?.technology,
    mode: eserviceTemplate?.mode,
    personalData: eserviceTemplate?.personalData,
    isSignalHubEnabled: eserviceTemplate?.isSignalHubEnabled ?? false,
    isConsumerDelegable: true,
    isClientAccessDelegable: true,
    instanceLabel: '',
  }
}
