import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Alert, Box, FormControlLabel, Link, Typography } from '@mui/material'
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
import { EServiceMutations, EServiceQueries } from '@/api/eservice'
import type {
  EServiceMode,
  EServiceTechnology,
  EServiceTemplateDetails,
  InstanceEServiceSeed,
  ProducerEServiceDescriptor,
} from '@/api/api.generatedTypes'
import { compareObjects } from '@/utils/common.utils'
import SaveIcon from '@mui/icons-material/Save'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { IconLink } from '@/components/shared/IconLink'
import LaunchIcon from '@mui/icons-material/Launch'
import {
  delegationEServiceGuideLink,
  delegationGuideLink,
  eserviceNamingBestPracticeLink,
} from '@/config/constants'
import { FEATURE_FLAG_SIGNALHUB_WHITELIST, SIGNALHUB_WHITELIST_PRODUCER } from '@/config/env'
import { trackEvent } from '@/config/tracking'
import { AuthHooks } from '@/api/auth'
import { TemplateMutations } from '@/api/template'
import { useQuery } from '@tanstack/react-query'

export type EServiceCreateStepGeneralFormValues = {
  name: string
  description: string
  technology: EServiceTechnology
  mode: EServiceMode
  isSignalHubEnabled: boolean
  isConsumerDelegable: boolean
  isClientAccessDelegable: boolean
  instanceLabel?: string
}

export const EServiceCreateStepGeneral: React.FC = () => {
  const producerId = AuthHooks.useJwt().jwt?.organizationId as string
  const isSignalHubFlagEnabled = FEATURE_FLAG_SIGNALHUB_WHITELIST
    ? SIGNALHUB_WHITELIST_PRODUCER.includes(producerId)
    : true

  const { isOrganizationAllowedToProduce } = AuthHooks.useJwt()

  const { t } = useTranslation('eservice')
  const navigate = useNavigate()

  const { eServiceTemplateId } = useParams<'PROVIDE_ESERVICE_FROM_TEMPLATE_CREATE'>()

  const {
    descriptor,
    areEServiceGeneralInfoEditable,
    forward,
    eserviceMode,
    onEserviceModeChange,
    template,
  } = useEServiceCreateContext()

  const { mutate: updateDraft } = EServiceMutations.useUpdateDraft()
  const { mutate: createDraft } = EServiceMutations.useCreateDraft()
  const { mutate: createDraftFromTemplate } =
    TemplateMutations.useCreateInstanceFromEServiceTemplate()
  const { mutate: updateDraftFromTemplate } =
    TemplateMutations.useUpdateInstanceFromEServiceTemplate()

  const isEserviceFromTemplate = Boolean(descriptor?.templateRef) || !!template

  // If Template ID is present we are inheriting an e-service fields from a template
  const defaultValues = evaluateFormDefaultValues(template, descriptor, eserviceMode)
  const formMethods = useForm({ defaultValues })

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
                instanceLabel: formValues.instanceLabel,
                isClientAccessDelegable: formValues.isClientAccessDelegable,
                isConsumerDelegable: formValues.isConsumerDelegable,
                isSignalHubEnabled: formValues.isSignalHubEnabled,
              },
              { onSuccess: forward }
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
    // If we are creating a new e-service we need to understand if we are creating it from a template or not
    if (!template) {
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
        instanceLabel: formValues.instanceLabel,
        eServiceTemplateId: eServiceTemplateId,
        isClientAccessDelegable: formValues.isClientAccessDelegable,
        isConsumerDelegable: formValues.isConsumerDelegable,
        isSignalHubEnabled: formValues.isSignalHubEnabled,
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
      })
    }
  }

  const templateName = template?.name || descriptor?.templateRef?.templateName

  const { data: isEserviceNameAvailable } = useQuery({
    ...EServiceQueries.getIsEServiceNameAvailable(templateName as string),
    enabled: isEserviceFromTemplate,
  })

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
          {!isEserviceNameAvailable && isEserviceFromTemplate && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {t('create.step1.alertInstanceLabelRequired')}
            </Alert>
          )}
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
          {isEserviceFromTemplate && (
            <RHFTextField
              label={t('create.step1.istanceNameField.label')}
              infoLabel={t('create.step1.eserviceNameField.infoLabel')}
              name="instanceLabel"
              rules={{ required: isEserviceNameAvailable ? undefined : true, minLength: 5 }}
              focusOnMount
              inputProps={{ maxLength: 60 }}
              size="small"
              sx={{ width: '49%', my: 0, mt: 1, ml: 2 }}
            />
          )}

          <RHFTextField
            label={t('create.step1.eserviceDescriptionField.label')}
            infoLabel={t('create.step1.eserviceDescriptionField.infoLabel')}
            name="description"
            multiline
            disabled={!areEServiceGeneralInfoEditable || isEserviceFromTemplate}
            size="small"
            inputProps={{ maxLength: 250 }}
            rules={!template ? { required: true, minLength: 10 } : undefined}
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
          {isSignalHubFlagEnabled && (
            <SectionContainer innerSection sx={{ mt: 3 }}>
              <FormControlLabel
                disabled={!areEServiceGeneralInfoEditable || !!template}
                name="isSignalHubEnabled"
                control={
                  <RHFCheckbox
                    name="isSignalHubEnabled"
                    label={
                      <>
                        {' '}
                        <span> {t('create.step1.isSignalHubEnabled.label')}</span>
                        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 0.5 }}>
                          {t('create.step1.isSignalHubEnabled.infoLabel.before')}{' '}
                          <IconLink
                            href={''} //TODO
                            target="_blank"
                            endIcon={<LaunchIcon fontSize="small" />}
                          >
                            {t('create.step1.isSignalHubEnabled.infoLabel.linkLabel')}
                          </IconLink>{' '}
                          {t('create.step1.isSignalHubEnabled.infoLabel.after')}
                        </Typography>
                      </>
                    }
                  />
                }
                label={undefined}
                sx={{ my: 0 }}
              />
            </SectionContainer>
          )}
        </SectionContainer>

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
                sx={{ my: 0 }}
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
  const { t } = useTranslation('eservice')

  return (
    <>
      <Alert severity="warning" sx={{ mb: 3 }}>
        {t('create.step1.firstVersionOnlyEditableInfo')}
      </Alert>
      <SectionContainerSkeleton height={354} />
    </>
  )
}

function evaluateFormDefaultValues(
  template: EServiceTemplateDetails | undefined,
  descriptor: ProducerEServiceDescriptor | undefined,
  eserviceMode: EServiceMode
): EServiceCreateStepGeneralFormValues {
  if (!template)
    return {
      name: descriptor?.eservice.name ?? '',
      description: descriptor?.eservice.description ?? '',
      technology: descriptor?.eservice.technology ?? 'REST',
      mode: eserviceMode,
      isSignalHubEnabled: descriptor?.eservice.isSignalHubEnabled ?? false,
      isConsumerDelegable: descriptor?.eservice.isConsumerDelegable ?? false,
      isClientAccessDelegable: descriptor?.eservice.isClientAccessDelegable ?? false,
      instanceLabel: descriptor?.templateRef?.instanceLabel ?? undefined,
    }

  return {
    instanceLabel: descriptor?.templateRef?.instanceLabel ?? '',
    name: template?.name,
    description: template?.description,
    technology: template?.technology,
    mode: template?.mode,
    isSignalHubEnabled: template?.isSignalHubEnabled ?? false,
    isConsumerDelegable: false,
    isClientAccessDelegable: false,
  }
}
