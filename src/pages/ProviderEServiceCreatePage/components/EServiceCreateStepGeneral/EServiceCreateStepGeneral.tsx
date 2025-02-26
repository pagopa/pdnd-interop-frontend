import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Alert, Box, Link } from '@mui/material'
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
  InstanceEServiceSeed,
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
import { TemplateMutations, TemplateQueries } from '@/api/template'
import { useQuery } from '@tanstack/react-query'

export type EServiceCreateStepGeneralFormValues = {
  name: string
  description: string
  technology: EServiceTechnology
  mode: EServiceMode
  isSignalHubEnabled: boolean
  isConsumerDelegable: boolean
  isClientAccessDelegable: boolean
}

export const EServiceCreateStepGeneral: React.FC = () => {
  const producerId = AuthHooks.useJwt().jwt?.organizationId as string
  const isSignalHubFlagEnabled = FEATURE_FLAG_SIGNALHUB_WHITELIST
    ? SIGNALHUB_WHITELIST_PRODUCER.includes(producerId)
    : true

  const { t } = useTranslation('eservice')
  const navigate = useNavigate()

  const { eServiceTemplateId } = useParams<
    'PROVIDE_ESERVICE_FROM_TEMPLATE_CREATE' | 'PROVIDE_ESERVICE_TEMPLATE_EDIT'
  >()

  const {
    descriptor,
    areEServiceGeneralInfoEditable,
    forward,
    eserviceMode,
    onEserviceModeChange,
    isEServiceFromTemplate,
    template,
  } = useEServiceCreateContext()

  const { mutate: updateDraft } = EServiceMutations.useUpdateDraft()
  const { mutate: createDraft } = EServiceMutations.useCreateDraft()
  const { mutate: createDraftFromTemplate } =
    TemplateMutations.useCreateInstanceFromEServiceTemplate()

  const eServiceDefaultValues: EServiceCreateStepGeneralFormValues = {
    name: descriptor?.eservice.name ?? '',
    description: descriptor?.eservice.description ?? '',
    technology: descriptor?.eservice.technology ?? 'REST',
    mode: eserviceMode,
    isSignalHubEnabled: descriptor?.eservice.isSignalHubEnabled ?? false,
    isConsumerDelegable: descriptor?.eservice.isConsumerDelegable ?? false,
    isClientAccessDelegable: descriptor?.eservice.isClientAccessDelegable ?? false,
  }

  const fromTemplateDefaultValues: EServiceCreateStepGeneralFormValues = {
    name: template?.name ?? '',
    description: template?.eserviceDescription ?? '',
    technology: template?.technology ?? 'REST',
    mode: template?.mode ?? 'RECEIVE',
    isSignalHubEnabled: template?.isSignalHubEnabled ?? false,
    isConsumerDelegable: false,
    isClientAccessDelegable: false,
  }

  // If Template ID is present we are inheriting an e-service fields from a template
  const defaultValues = eServiceTemplateId ? fromTemplateDefaultValues : eServiceDefaultValues

  const formMethods = useForm({ defaultValues })

  const onSubmit = (formValues: EServiceCreateStepGeneralFormValues & InstanceEServiceSeed) => {
    // If we are editing an existing e-service, we update the draft
    if (descriptor) {
      // If nothing has changed skip the update call
      const isEServiceTheSame = compareObjects(formValues, descriptor?.eservice)

      if (!isEServiceTheSame)
        updateDraft({ eserviceId: descriptor.eservice.id, ...formValues }, { onSuccess: forward })
      else forward()

      return
    }

    onCreateDraft(formValues)
  }

  const onCreateDraft = (
    formValues: EServiceCreateStepGeneralFormValues & InstanceEServiceSeed
  ) => {
    console.log('formValues', formValues)
    // If we are creating a new e-service we need to understand if we are creating it from a template or not
    if (!isEServiceFromTemplate) {
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
        instanceId: formValues.instanceId,
        eServiceTemplateId: eServiceTemplateId,
      }

      createDraftFromTemplate(body, {
        onSuccess({ id, descriptorId }) {
          navigate('PROVIDE_ESERVICE_FROM_TEMPLATE_EDIT', {
            params: { eserviceId: id, descriptorId, eServiceTemplateId: eServiceTemplateId },
            replace: true,
            state: { stepIndexDestination: 1 },
          })
          forward()
        },
      })
    }
  }

  return (
    <FormProvider {...formMethods}>
      {!isEServiceFromTemplate && (
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
            disabled={!areEServiceGeneralInfoEditable || isEServiceFromTemplate}
            rules={{ required: true, minLength: 5 }}
            focusOnMount
            inputProps={{ maxLength: 60 }}
            size="small"
            sx={{ width: '49%', my: 0, mt: 1 }}
          />
          <RHFTextField
            label={t('create.step1.istanceNameField.label')}
            infoLabel={t('create.step1.eserviceNameField.infoLabel')}
            name="instanceId"
            disabled={!areEServiceGeneralInfoEditable}
            rules={{ minLength: 5 }}
            focusOnMount
            inputProps={{ maxLength: 60 }}
            size="small"
            sx={{ width: '49%', my: 0, mt: 1, ml: 2 }}
          />

          <RHFTextField
            label={t('create.step1.eserviceDescriptionField.label')}
            infoLabel={t('create.step1.eserviceDescriptionField.infoLabel')}
            name="description"
            multiline
            disabled={!areEServiceGeneralInfoEditable || isEServiceFromTemplate}
            size="small"
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 10 }}
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
            disabled={!areEServiceGeneralInfoEditable || isEServiceFromTemplate}
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
            disabled={!areEServiceGeneralInfoEditable || isEServiceFromTemplate}
            rules={{ required: true }}
            sx={{ mb: 0, mt: 3 }}
            onValueChange={(mode) => onEserviceModeChange(mode as EServiceMode)}
          />
          {isSignalHubFlagEnabled && (
            <SectionContainer
              innerSection
              title={t('create.step1.eserviceModeField.isSignalHubEnabled.label')}
              sx={{ mt: 3 }}
            >
              <RHFSwitch
                label={t('create.step1.eserviceModeField.isSignalHubEnabled.switchLabel')}
                name="isSignalHubEnabled"
                disabled={!areEServiceGeneralInfoEditable}
                sx={{ my: 0 }}
              />
            </SectionContainer>
          )}
        </SectionContainer>

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
