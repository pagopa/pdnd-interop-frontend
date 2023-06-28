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
import { useJwt } from '@/hooks/useJwt'
import { getKeys } from '@/utils/array.utils'
import isEqual from 'lodash/isEqual'
import type { EServiceTechnology } from '@/api/api.generatedTypes'

export type EServiceCreateStep1FormValues = {
  name: string
  description: string
  technology: EServiceTechnology
}

export const EServiceCreateStep1General: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { jwt } = useJwt()
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
    } else if (eservice) {
      // If nothing has changed skip the update call
      const isEServiceTheSame = getKeys(formValues).every((key) =>
        isEqual(formValues[key], eservice[key])
      )

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
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer newDesign title={t('create.step1.detailsTitle')} component="div">
          <RHFTextField
            name="name"
            focusOnMount
            label={t('create.step1.eserviceNameField.label')}
            infoLabel={t('create.step1.eserviceNameField.infoLabel')}
            inputProps={{ maxLength: 60 }}
            disabled={!isEditable}
            rules={{ required: true, minLength: 5 }}
          />

          <RHFTextField
            name="description"
            multiline
            label={t('create.step1.eserviceDescriptionField.label')}
            infoLabel={t('create.step1.eserviceDescriptionField.infoLabel')}
            inputProps={{ maxLength: 250 }}
            disabled={!isEditable}
            rules={{ required: true, minLength: 10 }}
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
          />
        </SectionContainer>

        {!isEditable && (
          <Alert severity="info" sx={{ mt: 4 }}>
            {t('create.step1.firstVersionOnlyEditableInfo')}
          </Alert>
        )}

        <StepActions
          back={{
            label: t('backToListBtn'),
            type: 'link',
            to: 'PROVIDE_ESERVICE_LIST',
          }}
          forward={
            !isEditable
              ? {
                  label: t('create.forwardWithoutSaveBtn'),
                  onClick: forward,
                  type: 'button',
                }
              : { label: t('create.forwardWithSaveBtn'), type: 'submit' }
          }
        />
      </Box>
    </FormProvider>
  )
}

export const EServiceCreateStep1GeneralSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={600} />
}
