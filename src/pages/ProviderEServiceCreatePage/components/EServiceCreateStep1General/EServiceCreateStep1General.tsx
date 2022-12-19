import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { EServiceTechnologyType } from '@/types/eservice.types'
import { yupResolver } from '@hookform/resolvers/yup'
import { Alert, Box, Typography } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { object, string } from 'yup'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { RadioGroup, TextField } from '@/components/shared/ReactHookFormInputs'
import { StepActions } from '@/components/shared/StepActions'
import { useNavigateRouter } from '@/router'
import { EServiceMutations } from '@/api/eservice'
import { FrontendAttributes } from '@/types/attribute.types'
import { remapEServiceAttributes } from '@/utils/attribute.utils'
import { remapFrontendAttributesToBackend } from '@/api/eservice/eservice.api.utils'
import { URL_FRAGMENTS } from '@/router/router.utils'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { useJwt } from '@/hooks/useJwt'
import { getKeys } from '@/utils/array.utils'
import isEqual from 'lodash/isEqual'
import { AddAttributesToEServiceForm } from './AddAttributesToEServiceForm'

export type EServiceCreateStep1FormValues = {
  name: string
  description: string
  technology: EServiceTechnologyType
  attributes: FrontendAttributes
}

export const EServiceCreateStep1General: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { jwt } = useJwt()
  const { navigate } = useNavigateRouter()
  const currentLanguage = useCurrentLanguage()
  const { eservice, descriptor, isNewEService, forward } = useEServiceCreateContext()
  const { mutate: updateDraft } = EServiceMutations.useUpdateDraft()
  const { mutate: createDraft } = EServiceMutations.useCreateDraft()

  const validationSchema = object({
    name: string().required(),
    description: string().required(),
    technology: string().required(),
  })

  let defaultValues: EServiceCreateStep1FormValues = {
    name: '',
    description: '',
    technology: 'REST',
    attributes: { certified: [], verified: [], declared: [] },
  }

  if (!isNewEService && eservice) {
    defaultValues = {
      name: eservice.name,
      description: eservice.description,
      technology: eservice.technology,
      attributes: remapEServiceAttributes(eservice.attributes),
    }
  }

  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  })

  const onSubmit = (formValues: EServiceCreateStep1FormValues) => {
    const backendAttributes = remapFrontendAttributesToBackend(formValues.attributes)
    if (isNewEService) {
      if (!jwt?.organizationId) return
      createDraft(
        { producerId: jwt.organizationId, ...formValues, attributes: backendAttributes },
        {
          onSuccess({ id }) {
            navigate('PROVIDE_ESERVICE_EDIT', {
              params: { eserviceId: id, descriptorId: URL_FRAGMENTS.FIRST_DRAFT[currentLanguage] },
              replace: true,
              state: { stepIndexDestination: 1 },
            })
          },
        }
      )
    } else if (eservice) {
      // If nothing has changed skip the update call
      const eserviceToCompare = {
        ...eservice,
        attributes: remapEServiceAttributes(eservice.attributes),
      }
      const formValuesToCompare = {
        ...formValues,
        attributes: {
          certified: formValues.attributes.certified.filter((group) => group.attributes.length > 0),
          verified: formValues.attributes.verified.filter((group) => group.attributes.length > 0),
          declared: formValues.attributes.declared.filter((group) => group.attributes.length > 0),
        },
      }

      const isEServiceTheSame = getKeys(formValues).every((key) =>
        isEqual(formValuesToCompare[key], eserviceToCompare[key])
      )

      if (isEServiceTheSame) {
        forward()
        return
      }

      updateDraft(
        { eserviceId: eservice.id, ...formValues, attributes: backendAttributes },
        { onSuccess: forward }
      )
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
      <Box component="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer>
          <Typography component="h2" variant="h5">
            {t('create.step1.detailsTitle')}
          </Typography>

          <TextField
            name="name"
            focusOnMount
            label={t('create.step1.eserviceNameField.label')}
            infoLabel={t('create.step1.eserviceNameField.infoLabel')}
            inputProps={{ maxLength: 60 }}
            disabled={!isEditable}
          />

          <TextField
            name="description"
            multiline
            label={t('create.step1.eserviceDescriptionField.label')}
            infoLabel={t('create.step1.eserviceDescriptionField.infoLabel')}
            inputProps={{ maxLength: 250 }}
            disabled={!isEditable}
          />

          <RadioGroup
            name="technology"
            row
            label={t('create.step1.eserviceTechnologyField.label')}
            options={[
              { label: 'REST', value: 'REST' },
              { label: 'SOAP', value: 'SOAP' },
            ]}
            disabled={!isEditable}
          />
        </SectionContainer>

        <AddAttributesToEServiceForm attributeKey="certified" readOnly={!isEditable} />

        <AddAttributesToEServiceForm attributeKey="verified" readOnly={!isEditable} />

        <AddAttributesToEServiceForm attributeKey="declared" readOnly={!isEditable} />

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
