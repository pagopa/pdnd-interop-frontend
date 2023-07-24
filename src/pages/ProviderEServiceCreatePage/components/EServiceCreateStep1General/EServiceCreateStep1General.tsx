import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Alert, Box } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { RHFRadioGroup, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { StepActions } from '@/components/shared/StepActions'
import { useNavigate } from '@/router'
import { EServiceMutations } from '@/api/eservice'
import { URL_FRAGMENTS } from '@/router/router.utils'
import type { EServiceTechnology } from '@/api/api.generatedTypes'
import { compareObjects } from '@/utils/common.utils'
import { AuthHooks } from '@/api/auth'
import SaveIcon from '@mui/icons-material/Save'

export type EServiceCreateStep1FormValues = {
  name: string
  description: string
  technology: EServiceTechnology
}

export const EServiceCreateStep1General: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { jwt } = AuthHooks.useJwt()
  const navigate = useNavigate()
  const { eservice, descriptor, isNewEService, forward } = useEServiceCreateContext()
  const { mutate: updateDraft } = EServiceMutations.useUpdateDraft()
  const { mutate: createDraft } = EServiceMutations.useCreateDraft()

  let defaultValues: EServiceCreateStep1FormValues = {
    name: '',
    description: '',
    technology: 'REST',
  }

  if (!isNewEService && eservice) {
    defaultValues = {
      name: eservice.name,
      description: eservice.description,
      technology: eservice.technology,
    }
  }

  const formMethods = useForm({
    defaultValues,
  })

  const onSubmit = (formValues: EServiceCreateStep1FormValues) => {
    if (isNewEService) {
      if (!jwt?.organizationId) return
      createDraft(
        { ...formValues },
        {
          onSuccess({ id }) {
            navigate('PROVIDE_ESERVICE_EDIT', {
              params: { eserviceId: id, descriptorId: URL_FRAGMENTS.FIRST_DRAFT },
              replace: true,
              state: { stepIndexDestination: 1 },
            })
            forward()
          },
        }
      )
      return
    }

    if (eservice) {
      // If nothing has changed skip the update call
      const isEServiceTheSame = compareObjects(formValues, eservice)

      if (isEServiceTheSame) {
        forward()
        return
      }

      updateDraft({ eserviceId: eservice.id, ...formValues }, { onSuccess: forward })
    }
  }

  const isEditable =
    // case 1: new service
    !eservice ||
    // case 2: already existing service but no versions created
    (eservice && !descriptor) ||
    // case 3: already existing service and version, but version is 1 and still a draft
    (eservice && descriptor && descriptor.version === '1' && descriptor.state === 'DRAFT')

  return (
    <FormProvider {...formMethods}>
      <Alert severity="info" sx={{ mb: 3 }}>
        {t('create.step1.firstVersionOnlyEditableInfo')}
      </Alert>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer newDesign title={t('create.step1.detailsTitle')} component="div">
          <RHFTextField
            label={t('create.step1.eserviceNameField.label')}
            name="name"
            disabled={!isEditable}
            rules={{ required: true, minLength: 5 }}
            focusOnMount
            inputProps={{ maxLength: 60 }}
            size="small"
            sx={{ width: '50%', my: 0, mt: 1 }}
          />

          <RHFTextField
            label={t('create.step1.eserviceDescriptionField.label')}
            name="description"
            multiline
            disabled={!isEditable}
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
            disabled={!isEditable}
            rules={{ required: true }}
            sx={{ mb: 0, mt: 3 }}
          />
        </SectionContainer>

        <StepActions
          forward={
            !isEditable
              ? {
                  label: t('create.forwardWithoutSaveBtn'),
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

export const EServiceCreateStep1GeneralSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={600} />
}
