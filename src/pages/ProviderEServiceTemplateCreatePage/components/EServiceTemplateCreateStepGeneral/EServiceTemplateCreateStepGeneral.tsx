import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RHFRadioGroup, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { StepActions } from '@/components/shared/StepActions'
import { useNavigate } from '@/router'
import type { EServiceMode, EServiceTechnology } from '@/api/api.generatedTypes'
import { compareObjects } from '@/utils/common.utils'
import SaveIcon from '@mui/icons-material/Save'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { IconLink } from '@/components/shared/IconLink'
import LaunchIcon from '@mui/icons-material/Launch'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { TemplateMutations } from '@/api/template'
import { FEATURE_FLAG_SIGNALHUB_WHITELIST, SIGNALHUB_WHITELIST_PRODUCER } from '@/config/env'
import { AuthHooks } from '@/api/auth'

export type EServiceTemplateCreateStepGeneralFormValues = {
  name: string
  eserviceDescription: string
  audienceDescription: string
  technology: EServiceTechnology
  mode: EServiceMode
  isSignalHubEnabled: boolean
}

export const EServiceTemplateCreateStepGeneral: React.FC = () => {
  const { t } = useTranslation('template')
  const navigate = useNavigate()

  const producerId = AuthHooks.useJwt().jwt?.organizationId as string
  const isSignalHubFlagEnabled = FEATURE_FLAG_SIGNALHUB_WHITELIST
    ? SIGNALHUB_WHITELIST_PRODUCER.includes(producerId)
    : true

  const [isSignalHubSuggested, setIsSignalHubSuggested] = React.useState(true)

  const {
    template,
    areEServiceTemplateGeneralInfoEditable,
    forward,
    eserviceTemplateMode,
    onEserviceTemplateModeChange,
  } = useEServiceTemplateCreateContext()

  const { mutate: updateDraft } = TemplateMutations.useUpdateDraft()
  const { mutate: createDraft } = TemplateMutations.useCreateDraft()

  const defaultValues: EServiceTemplateCreateStepGeneralFormValues = {
    name: template?.eserviceTemplate.name ?? '',
    eserviceDescription: template?.eserviceTemplate.eserviceDescription ?? '',
    audienceDescription: template?.eserviceTemplate.audienceDescription ?? '',
    technology: template?.eserviceTemplate.technology ?? 'REST',
    mode: eserviceTemplateMode,
    isSignalHubEnabled: template?.eserviceTemplate.isSignalHubEnabled ?? false,
  }

  const formMethods = useForm({ defaultValues })

  const onSubmit = (formValues: EServiceTemplateCreateStepGeneralFormValues) => {
    // If we are editing an existing e-service, we update the draft
    if (template) {
      //TODO CONTROLLA
      // If nothing has changed skip the update call
      const isEServiceTemplateTheSame = compareObjects(formValues, template.eserviceTemplate)

      if (!isEServiceTemplateTheSame)
        updateDraft({ eserviceTemplateId: template.id, ...formValues }, { onSuccess: forward })
      else forward()

      return
    }

    // If we are creating a new e-service, we create a new draft
    /*createDraft(formValues, {
      onSuccess({ id }) {
        navigate('PROVIDE_ESERVICE_TEMPLATE_EDIT', {
          //TODO
          params: { templateId },
          replace: true,
          state: { stepIndexDestination: 1 },
        })
        forward()
      },
    })*/ //TODO
    forward()
  }

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer
          title={t('create.step1.detailsTitle')}
          description={t('create.step1.detailsDescription')}
          component="div"
        >
          <RHFTextField
            label={t('create.step1.eserviceTemplateNameField.label')}
            infoLabel={t('create.step1.eserviceTemplateNameField.infoLabel')}
            name="name"
            disabled={!areEServiceTemplateGeneralInfoEditable}
            rules={{ required: true, minLength: 5 }}
            focusOnMount
            inputProps={{ maxLength: 60 }}
            size="small"
            sx={{ width: '50%', my: 0, mt: 1 }}
          />

          <RHFTextField
            label={t('create.step1.audienceDescriptionField.label')}
            infoLabel={t('create.step1.audienceDescriptionField.infoLabel')}
            name="audienceDescription"
            multiline
            disabled={!areEServiceTemplateGeneralInfoEditable}
            size="small"
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 10 }}
            sx={{ mb: 0, mt: 3 }}
          />

          <RHFTextField
            label={t('create.step1.eserviceDescriptionField.label')}
            infoLabel={t('create.step1.eserviceDescriptionField.infoLabel')}
            name="eserviceDescription"
            multiline
            disabled={!areEServiceTemplateGeneralInfoEditable}
            size="small"
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 10 }}
            sx={{ mb: 0, mt: 3 }}
          />

          <RHFRadioGroup
            name="technology"
            row
            label={t('create.step1.eserviceTemplateTechnologyField.label')}
            options={[
              { label: 'REST', value: 'REST' },
              { label: 'SOAP', value: 'SOAP' },
            ]}
            disabled={!areEServiceTemplateGeneralInfoEditable}
            rules={{ required: true }}
            sx={{ mb: 0, mt: 3 }}
          />

          <RHFRadioGroup
            name="mode"
            row
            label={t('create.step1.eserviceTemplateModeField.label')}
            options={[
              {
                label: t('create.step1.eserviceTemplateModeField.options.DELIVER'),
                value: 'DELIVER',
              },
              {
                label: t('create.step1.eserviceTemplateModeField.options.RECEIVE'),
                value: 'RECEIVE',
              },
            ]}
            disabled={!areEServiceTemplateGeneralInfoEditable}
            rules={{ required: true }}
            sx={{ mb: 0, mt: 3 }}
            onValueChange={(mode) => onEserviceTemplateModeChange(mode as EServiceMode)}
          />
          {isSignalHubFlagEnabled && (
            <SectionContainer innerSection sx={{ mt: 3 }}>
              <FormControlLabel
                disabled={!areEServiceTemplateGeneralInfoEditable}
                control={
                  <Checkbox
                    checked={isSignalHubSuggested}
                    onClick={() => setIsSignalHubSuggested(!isSignalHubSuggested)}
                    name="isSignalHubEnabled"
                  />
                }
                label={
                  <>
                    {' '}
                    <span>
                      {' '}
                      {t('create.step1.eserviceTemplateModeField.isSignalHubEnabled.label')}{' '}
                    </span>
                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 0.5 }}>
                      {t(
                        'create.step1.eserviceTemplateModeField.isSignalHubEnabled.infoLabel.before'
                      )}{' '}
                      <IconLink
                        href={''} //TODO
                        target="_blank"
                        endIcon={<LaunchIcon fontSize="small" />}
                      >
                        {t(
                          'create.step1.eserviceTemplateModeField.isSignalHubEnabled.infoLabel.linkLabel'
                        )}
                      </IconLink>{' '}
                      {t(
                        'create.step1.eserviceTemplateModeField.isSignalHubEnabled.infoLabel.after'
                      )}
                    </Typography>
                  </>
                }
                sx={{ my: 0 }}
              />
            </SectionContainer>
          )}
        </SectionContainer>

        <StepActions
          forward={
            !areEServiceTemplateGeneralInfoEditable
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

export const EServiceTemplateCreateStepGeneralSkeleton: React.FC = () => {
  const { t } = useTranslation('eservice')

  return <SectionContainerSkeleton height={354} />
}
