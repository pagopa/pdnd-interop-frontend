import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Alert, Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RHFRadioGroup, RHFSwitch, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { StepActions } from '@/components/shared/StepActions'
import { useNavigate } from '@/router'
import { EServiceMutations } from '@/api/eservice'
import type { EServiceMode, EServiceTechnology } from '@/api/api.generatedTypes'
import { compareObjects } from '@/utils/common.utils'
import SaveIcon from '@mui/icons-material/Save'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { IconLink } from '@/components/shared/IconLink'
import LaunchIcon from '@mui/icons-material/Launch'
import { eserviceNamingBestPracticeLink } from '@/config/constants'
import { STAGE } from '@/config/env'
import type { PagoPAEnvVars } from '@/types/common.types'
import { trackEvent } from '@/config/tracking'
import { useCreateContext } from '../CreateContext'
import { TemplateMutations } from '@/api/template'

export type CreateStepGeneralFormValues = {
  name: string
  description: string
  technology: EServiceTechnology
  mode: EServiceMode
  isSignalHubEnabled: boolean
}

export const CreateStepGeneral: React.FC = () => {
  const signalHubFlagDisabledStage: PagoPAEnvVars['STAGE'][] = ['PROD', 'UAT']
  const isSignalHubFlagDisabled = signalHubFlagDisabledStage.includes(STAGE) //check on the environment for signal hub flag
  const navigate = useNavigate()

  const [isSignalHubSuggested, setIsSignalHubSuggested] = React.useState(false)

  const {
    descriptor,
    template,
    formKind,
    areGeneralInfoEditable,
    forward,
    eserviceMode,
    onEserviceModeChange,
  } = useCreateContext()

  const { t } = useTranslation(formKind) //TODO

  const { mutate: updateEServiceDraft } = EServiceMutations.useUpdateDraft()
  const { mutate: createEServiceDraft } = EServiceMutations.useCreateDraft()
  const { mutate: updateTemplateDraft } = TemplateMutations.useUpdateDraft()
  const { mutate: createTemplateDraft } = TemplateMutations.useCreateDraft()

  const defaultValues: CreateStepGeneralFormValues = {
    name: (descriptor?.eservice?.name || template?.eservice.name) ?? '',
    description: (descriptor?.eservice?.description || template?.eservice.description) ?? '',
    technology: (descriptor?.eservice?.technology || template?.eservice.technology) ?? 'REST',
    mode: eserviceMode,
    isSignalHubEnabled: descriptor?.eservice?.isSignalHubEnabled ?? false,
  }

  const formMethods = useForm({ defaultValues })

  const onSubmit = (formValues: CreateStepGeneralFormValues) => {
    // If we are editing an existing e-service, we update the draft
    if (descriptor) {
      // If nothing has changed skip the update call
      const isEServiceTheSame = compareObjects(formValues, descriptor?.eservice)

      if (!isEServiceTheSame)
        updateEServiceDraft(
          { eserviceId: descriptor.eservice.id, ...formValues },
          { onSuccess: forward }
        )
      else forward()

      return
    }

    if (template) {
      // If nothing has changed skip the update call
      const isTemplateTheSame = compareObjects(formValues, template?.eservice)

      if (!isTemplateTheSame)
        updateTemplateDraft(
          { eserviceId: template.eservice.id, ...formValues },
          { onSuccess: forward }
        )
      else forward()

      return
    }

    // If we are creating a new e-service, we create a new draft
    if (!descriptor && formKind === 'eservice') {
      createEServiceDraft(formValues, {
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
    if (!template && formKind === 'template') {
      //TODO CONTROLLARE CHECK
      createTemplateDraft(formValues, {
        onSuccess({ id }) {
          navigate('PROVIDE_ESERVICE_TEMPLATE_EDIT', {
            params: { eserviceTemplateId: id }, //TODO ALTRI PARAMETRI
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
      {formKind === 'eservice' && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {t('create.step1.firstVersionOnlyEditableInfo')}
        </Alert>
      )}
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer
          title={t('create.step1.detailsTitle')}
          description={
            formKind === 'eservice' ? (
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
            ) : (
              t('create.step1.detailsDescription')
            )
          }
          component="div"
        >
          <RHFTextField
            label={t('create.step1.eserviceNameField.label')}
            infoLabel={t('create.step1.eserviceNameField.infoLabel')}
            name="name"
            disabled={!areGeneralInfoEditable}
            rules={{ required: true, minLength: 5 }}
            focusOnMount
            inputProps={{ maxLength: 60 }}
            size="small"
            sx={{ width: '50%', my: 0, mt: 1 }}
          />

          {formKind === 'template' && (
            <RHFTextField
              label={t('create.step1.eserviceAudienceDescriptionField.label')}
              infoLabel={t('create.step1.eserviceAudienceDescriptionField.infoLabel')}
              name="audienceDescription"
              multiline
              disabled={!areGeneralInfoEditable}
              size="small"
              inputProps={{ maxLength: 250 }}
              rules={{ required: true, minLength: 10 }}
              sx={{ mb: 0, mt: 3 }}
            />
          )}

          <RHFTextField
            label={t('create.step1.eserviceDescriptionField.label')}
            infoLabel={t('create.step1.eserviceDescriptionField.infoLabel')}
            name="description"
            multiline
            disabled={!areGeneralInfoEditable}
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
            disabled={!areGeneralInfoEditable}
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
            disabled={!areGeneralInfoEditable}
            rules={{ required: true }}
            sx={{ mb: 0, mt: 3 }}
            onValueChange={(mode) => onEserviceModeChange(mode as EServiceMode)}
          />
          {!isSignalHubFlagDisabled && formKind === 'eservice' ? (
            <SectionContainer
              innerSection
              title={t('create.step1.eserviceModeField.isSignalHubEnabled.label')}
              sx={{ mt: 3 }}
            >
              <RHFSwitch
                label={t('create.step1.eserviceModeField.isSignalHubEnabled.switchLabel')}
                name="isSignalHubEnabled"
                disabled={!areGeneralInfoEditable}
                sx={{ my: 0 }}
              />
            </SectionContainer>
          ) : (
            <>
              <SectionContainer innerSection sx={{ mt: 3 }}>
                <FormControlLabel
                  disabled={false}
                  key={''} //TODO
                  value={false}
                  control={
                    <Checkbox
                      checked={isSignalHubSuggested}
                      onChange={() => {
                        setIsSignalHubSuggested((prev) => !prev)
                      }}
                      name={'name'}
                    />
                  }
                  label={
                    <>
                      {' '}
                      <span>
                        {' '}
                        {t('create.step1.eserviceModeField.isSignalHubSuggested.label')}{' '}
                      </span>
                      <Typography variant="body2" color="textSecondary" sx={{ marginTop: 0.5 }}>
                        {t('create.step1.eserviceModeField.isSignalHubSuggested.infoLabel.before')}{' '}
                        <IconLink
                          href={''} //TODO
                          target="_blank"
                          endIcon={<LaunchIcon fontSize="small" />}
                        >
                          {t(
                            'create.step1.eserviceModeField.isSignalHubSuggested.infoLabel.linkLabel'
                          )}
                        </IconLink>{' '}
                        {t('create.step1.eserviceModeField.isSignalHubSuggested.infoLabel.after')}
                      </Typography>
                    </>
                  }
                  sx={{ mr: 3 }}
                />
              </SectionContainer>
            </>
          )}
        </SectionContainer>

        <StepActions
          forward={
            !areGeneralInfoEditable
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

export const CreateStepGeneralSkeleton: React.FC = () => {
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
