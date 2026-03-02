import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Box, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RHFRadioGroup, RHFSwitch, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { StepActions } from '@/components/shared/StepActions'
import { useNavigate } from '@/router'
import type { EServiceMode, EServiceTechnology } from '@/api/api.generatedTypes'
import { compareObjects } from '@/utils/common.utils'
import SaveIcon from '@mui/icons-material/Save'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { IconLink } from '@/components/shared/IconLink'
import LaunchIcon from '@mui/icons-material/Launch'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'
import { ESERVICE_TEMPLATE_NAME_MAX_LENGTH, SIGNALHUB_GUIDE_URL } from '@/config/constants'
import { FEATURE_FLAG_ESERVICE_PERSONAL_DATA } from '@/config/env'

export type EServiceTemplateCreateStepGeneralFormValues = {
  name: string
  description: string
  intendedTarget: string
  technology: EServiceTechnology
  mode: EServiceMode
  isSignalHubEnabled?: boolean
  personalData?: boolean
}

export const EServiceTemplateCreateStepGeneral: React.FC = () => {
  const { t } = useTranslation('eserviceTemplate')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'validation.mixed' })
  const navigate = useNavigate()

  const {
    eserviceTemplateVersion,
    areEServiceTemplateGeneralInfoEditable,
    forward,
    eserviceTemplateMode,
    onEserviceTemplateModeChange,
  } = useEServiceTemplateCreateContext()

  const { mutate: updateDraft } = EServiceTemplateMutations.useUpdateDraft()
  const { mutate: createDraft } = EServiceTemplateMutations.useCreateDraft()

  const defaultValues: EServiceTemplateCreateStepGeneralFormValues = {
    name: eserviceTemplateVersion?.eserviceTemplate.name ?? '',
    description: eserviceTemplateVersion?.eserviceTemplate.description ?? '',
    intendedTarget: eserviceTemplateVersion?.eserviceTemplate.intendedTarget ?? '',
    technology: eserviceTemplateVersion?.eserviceTemplate.technology ?? 'REST',
    mode: eserviceTemplateMode,
    isSignalHubEnabled: eserviceTemplateVersion?.eserviceTemplate.isSignalHubEnabled ?? false,
    personalData: eserviceTemplateVersion?.eserviceTemplate.personalData,
  }

  const formMethods = useForm({ defaultValues })

  const onSubmit = (formValues: EServiceTemplateCreateStepGeneralFormValues) => {
    // If we are editing an existing e-service eserviceTemplateVersion, we update the draft
    if (eserviceTemplateVersion) {
      // If nothing has changed skip the update call
      const isEServiceTemplateTheSame = compareObjects(
        formValues,
        eserviceTemplateVersion.eserviceTemplate
      )

      if (!isEServiceTemplateTheSame)
        updateDraft(
          { eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id, ...formValues },
          { onSuccess: forward }
        )
      else forward()

      return
    }

    // If we are creating a new e-service eserviceTemplateVersion, we create a new draft
    createDraft(formValues, {
      onSuccess({ id, versionId }) {
        navigate('PROVIDE_ESERVICE_TEMPLATE_EDIT', {
          params: { eServiceTemplateId: id, eServiceTemplateVersionId: versionId },
          replace: true,
          state: { stepIndexDestination: 1 },
        })
        forward()
      },
    })
  }

  const signalHubLabel = (
    <>
      {' '}
      <span> {t('create.step1.eserviceTemplateModeField.isSignalHubEnabled.label')} </span>
      <Typography variant="body2" color="textSecondary" sx={{ marginTop: 0.5 }}>
        {t('create.step1.eserviceTemplateModeField.isSignalHubEnabled.infoLabel.before')}{' '}
        <IconLink
          href={SIGNALHUB_GUIDE_URL}
          target="_blank"
          endIcon={<LaunchIcon fontSize="small" />}
        >
          {t('create.step1.eserviceTemplateModeField.isSignalHubEnabled.infoLabel.linkLabel')}
        </IconLink>{' '}
        {t('create.step1.eserviceTemplateModeField.isSignalHubEnabled.infoLabel.after')}
      </Typography>
    </>
  ) as unknown as string

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
            rules={{ required: true, minLength: 5, maxLength: ESERVICE_TEMPLATE_NAME_MAX_LENGTH }}
            focusOnMount
            inputProps={{ maxLength: ESERVICE_TEMPLATE_NAME_MAX_LENGTH }}
            size="small"
            sx={{ width: '50%', my: 0, mt: 1 }}
          />

          <RHFTextField
            label={t('create.step1.intendedTargetField.label')}
            infoLabel={t('create.step1.intendedTargetField.infoLabel')}
            name="intendedTarget"
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
            name="description"
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
          {FEATURE_FLAG_ESERVICE_PERSONAL_DATA && (
            <RHFRadioGroup
              name="personalData"
              row
              label={t(`create.step1.eservicePersonalDataField.${eserviceTemplateMode}.label`)}
              options={[
                {
                  label: t(
                    `create.step1.eservicePersonalDataField.${eserviceTemplateMode}.options.true`
                  ),
                  value: true,
                },
                {
                  label: t(
                    `create.step1.eservicePersonalDataField.${eserviceTemplateMode}.options.false`
                  ),
                  value: false,
                },
              ]}
              disabled={!areEServiceTemplateGeneralInfoEditable}
              rules={{
                validate: (value) => value === true || value === false || tCommon('required'),
              }}
              sx={{ mb: 0, mt: 3 }}
              isOptionValueAsBoolean
            />
          )}

          <SectionContainer innerSection sx={{ mt: 3 }}>
            <SectionContainer innerSection sx={{ mt: 3, ml: 1 }}>
              <RHFSwitch
                disabled={!areEServiceTemplateGeneralInfoEditable}
                name="isSignalHubEnabled"
                label={signalHubLabel}
              />
            </SectionContainer>
          </SectionContainer>
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
  return <SectionContainerSkeleton height={354} />
}
