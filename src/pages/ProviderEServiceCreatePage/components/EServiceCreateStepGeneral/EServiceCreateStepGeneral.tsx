import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Alert, Box } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
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

export type EServiceCreateStepGeneralFormValues = {
  name: string
  description: string
  technology: EServiceTechnology
  mode: EServiceMode
  isSignalHubEnabled: boolean
}

export const EServiceCreateStepGeneral: React.FC = () => {
  const { t } = useTranslation('eservice')
  const navigate = useNavigate()

  const {
    descriptor,
    areEServiceGeneralInfoEditable,
    forward,
    eserviceMode,
    onEserviceModeChange,
  } = useEServiceCreateContext()

  const { mutate: updateDraft } = EServiceMutations.useUpdateDraft()
  const { mutate: createDraft } = EServiceMutations.useCreateDraft()

  const defaultValues: EServiceCreateStepGeneralFormValues = {
    name: descriptor?.eservice?.name ?? '',
    description: descriptor?.eservice?.description ?? '',
    technology: descriptor?.eservice?.technology ?? 'REST',
    mode: eserviceMode,
    isSignalHubEnabled: descriptor?.eservice?.isSignalHubEnabled ?? false,
  }

  const formMethods = useForm({ defaultValues })

  const onSubmit = (formValues: EServiceCreateStepGeneralFormValues) => {
    // If we are editing an existing e-service, we update the draft
    if (descriptor) {
      // If nothing has changed skip the update call
      const isEServiceTheSame = compareObjects(formValues, descriptor?.eservice)

      if (!isEServiceTheSame)
        updateDraft({ eserviceId: descriptor.eservice.id, ...formValues }, { onSuccess: forward })
      else forward()

      return
    }

    // If we are creating a new e-service, we create a new draft
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
  }

  return (
    <FormProvider {...formMethods}>
      <Alert severity="warning" sx={{ mb: 3 }}>
        {t('create.step1.firstVersionOnlyEditableInfo')}
      </Alert>
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
            disabled={!areEServiceGeneralInfoEditable}
            rules={{ required: true, minLength: 5 }}
            focusOnMount
            inputProps={{ maxLength: 60 }}
            size="small"
            sx={{ width: '50%', my: 0, mt: 1 }}
          />

          <RHFTextField
            label={t('create.step1.eserviceDescriptionField.label')}
            infoLabel={t('create.step1.eserviceDescriptionField.infoLabel')}
            name="description"
            multiline
            disabled={!areEServiceGeneralInfoEditable}
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
            disabled={!areEServiceGeneralInfoEditable}
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
            disabled={!areEServiceGeneralInfoEditable}
            rules={{ required: true }}
            sx={{ mb: 0, mt: 3 }}
            onValueChange={(mode) => onEserviceModeChange(mode as EServiceMode)}
          />
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
