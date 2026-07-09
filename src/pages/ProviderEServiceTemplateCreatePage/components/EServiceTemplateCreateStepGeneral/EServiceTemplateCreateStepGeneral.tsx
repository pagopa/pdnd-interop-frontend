import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Box, Stack, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RHFSwitch, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { StepActions } from '@/components/shared/StepActions'
import { useNavigate } from '@/router'
import type { EServiceMode, EServiceTechnology } from '@/api/api.generatedTypes'
import SaveIcon from '@mui/icons-material/Save'
import { IconLink } from '@/components/shared/IconLink'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'
import {
  ESERVICE_DESCRIPTION_MAX_LENGTH,
  ESERVICE_TEMPLATE_NAME_MAX_LENGTH,
  SIGNALHUB_GUIDE_URL,
} from '@/config/constants'
import { EServiceTemplateDetailsSection } from '@/pages/ProviderEServiceCreatePage/components/sections/EServiceTemplateDetailsSection'
import { EServiceDetailsSectionBase } from '@/pages/ProviderEServiceCreatePage/components/sections/EServiceDetailsSectionBase'
import { compareObjects } from '@/utils/common.utils'

export type EServiceTemplateCreateStepGeneralFormValues = {
  name: string
  description: string
  intendedTarget: string
  technology: EServiceTechnology
  mode: EServiceMode
  asyncExchange: boolean
  isSignalHubEnabled?: boolean
  personalData?: boolean
}

export const EServiceTemplateCreateStepGeneral: React.FC = () => {
  const { t } = useTranslation('eserviceTemplate')
  const navigate = useNavigate()

  const {
    eserviceTemplateVersion,
    areEServiceTemplateGeneralInfoEditable,
    forward,
    eserviceTemplateMode,
    onEserviceTemplateModeChange,
  } = useEServiceTemplateCreateContext()

  const { mutate: createDraft } = EServiceTemplateMutations.useCreateDraft()
  const { mutate: updateDraft } = EServiceTemplateMutations.useUpdateDraft()

  const defaultValues: EServiceTemplateCreateStepGeneralFormValues = {
    name: eserviceTemplateVersion?.eserviceTemplate.name ?? '',
    description: eserviceTemplateVersion?.eserviceTemplate.description ?? '',
    intendedTarget: eserviceTemplateVersion?.eserviceTemplate.intendedTarget ?? '',
    technology: eserviceTemplateVersion?.eserviceTemplate.technology ?? 'REST',
    mode: eserviceTemplateVersion?.eserviceTemplate.asyncExchange
      ? 'DELIVER'
      : eserviceTemplateMode,
    asyncExchange: eserviceTemplateVersion?.eserviceTemplate.asyncExchange ?? false,
    isSignalHubEnabled: eserviceTemplateVersion?.eserviceTemplate.isSignalHubEnabled ?? false,
    personalData: eserviceTemplateVersion?.eserviceTemplate.personalData,
  }

  const formMethods = useForm({ defaultValues })

  const onSubmit = (formValues: EServiceTemplateCreateStepGeneralFormValues) => {
    if (eserviceTemplateVersion) {
      //if we are editing the first version of an existing draft of the eservice template, we update the draft
      if (eserviceTemplateVersion.version === 1 && eserviceTemplateVersion.state === 'DRAFT') {
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
      }
      //if the version is not the first one or the state is not DRAFT, we just forward to the next step because there aren't editable fields in this step
      forward()
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

  const signalHubLabel = (disabled: boolean) =>
    (
      <>
        {' '}
        <span> {t('create.step1.eserviceTemplateModeField.isSignalHubEnabled.label')} </span>
        <Typography
          variant="body2"
          color={disabled ? 'text.disabled' : 'text.secondary'}
          sx={{ marginTop: 0.5 }}
        >
          {t('create.step1.eserviceTemplateModeField.isSignalHubEnabled.infoLabel.before')}{' '}
          <IconLink
            href={SIGNALHUB_GUIDE_URL}
            target="_blank"
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : undefined}
          >
            {t('create.step1.eserviceTemplateModeField.isSignalHubEnabled.infoLabel.linkLabel')}
          </IconLink>{' '}
          {t('create.step1.eserviceTemplateModeField.isSignalHubEnabled.infoLabel.after')}
        </Typography>
      </>
    ) as unknown as string

  if (!areEServiceTemplateGeneralInfoEditable && eserviceTemplateVersion) {
    return (
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <SectionContainer
            title={t('create.step1.readOnlyTemplateInfoTitle')}
            description={t('create.step1.readOnlyDescription')}
            component="div"
          >
            <Stack spacing={2}>
              <InformationContainer
                sx={{ '& > :first-of-type': { maxWidth: 340 } }}
                label={t('create.step1.readOnlyNameLabel')}
                content={eserviceTemplateVersion.eserviceTemplate.name}
              />
              <InformationContainer
                sx={{ '& > :first-of-type': { maxWidth: 340 } }}
                label={t('create.step1.readOnlyIntendedTargetLabel')}
                content={eserviceTemplateVersion.eserviceTemplate.intendedTarget}
              />
              <InformationContainer
                sx={{ '& > :first-of-type': { maxWidth: 340 } }}
                label={t('create.step1.readOnlyDescriptionLabel')}
                content={eserviceTemplateVersion.eserviceTemplate.description}
              />
            </Stack>
          </SectionContainer>

          <EServiceTemplateDetailsSection
            eserviceTemplate={eserviceTemplateVersion.eserviceTemplate}
          />

          <SectionContainer title={t('create.step1.signalHubTitle')} component="div">
            <RHFSwitch
              name="isSignalHubEnabled"
              label={signalHubLabel(!areEServiceTemplateGeneralInfoEditable)}
              disabled={!areEServiceTemplateGeneralInfoEditable}
            />
          </SectionContainer>

          <StepActions
            forward={{
              label: t('create.forwardWithSaveBtn'),
              type: 'submit',
              startIcon: <SaveIcon />,
            }}
          />
        </Box>
      </FormProvider>
    )
  }

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer title={t('create.step1.templateInfoTitle')} component="div">
          <RHFTextField
            label={t('create.step1.eserviceTemplateNameField.label')}
            infoLabel={t('create.step1.eserviceTemplateNameField.infoLabel')}
            name="name"
            required
            disabled={!areEServiceTemplateGeneralInfoEditable}
            rules={{ required: true, minLength: 5, maxLength: ESERVICE_TEMPLATE_NAME_MAX_LENGTH }}
            focusOnMount
            inputProps={{ maxLength: ESERVICE_TEMPLATE_NAME_MAX_LENGTH }}
            size="small"
            sx={{ my: 0, mt: 1 }}
          />

          <RHFTextField
            label={t('create.step1.intendedTargetField.label')}
            infoLabel={t('create.step1.intendedTargetField.infoLabel')}
            name="intendedTarget"
            required
            multiline
            size="small"
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 10 }}
            sx={{ mb: 0, mt: 3 }}
          />

          <RHFTextField
            label={t('create.step1.eserviceDescriptionField.label')}
            infoLabel={t('create.step1.eserviceDescriptionField.infoLabel', {
              ESERVICE_DESCRIPTION_MAX_LENGTH: ESERVICE_DESCRIPTION_MAX_LENGTH,
            })}
            name="description"
            required
            multiline
            size="small"
            inputProps={{ maxLength: ESERVICE_DESCRIPTION_MAX_LENGTH }}
            rules={{ required: true, minLength: 10, maxLength: ESERVICE_DESCRIPTION_MAX_LENGTH }}
            sx={{ mb: 0, mt: 3 }}
          />
        </SectionContainer>

        <EServiceDetailsSectionBase
          isEditable={areEServiceTemplateGeneralInfoEditable}
          eserviceMode={eserviceTemplateMode}
          onEserviceModeChange={onEserviceTemplateModeChange}
        />

        <SectionContainer title={t('create.step1.signalHubTitle')} component="div">
          <RHFSwitch name="isSignalHubEnabled" label={signalHubLabel(false)} />
        </SectionContainer>

        <StepActions
          forward={{
            label: t('create.forwardWithSaveBtn'),
            type: 'submit',
            startIcon: <SaveIcon />,
          }}
        />
      </Box>
    </FormProvider>
  )
}

export const EServiceTemplateCreateStepGeneralSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={354} />
}
