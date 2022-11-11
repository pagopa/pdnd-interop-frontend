import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { EServiceTechnologyType } from '@/types/eservice.types'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Typography } from '@mui/material'
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
import { URL_FRAGMENTS } from '@/router/utils'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { useJwt } from '@/hooks/useJwt'

type EServiceCreateStep1FormValues = {
  name: string
  description: string
  technology: EServiceTechnologyType
  attributes: FrontendAttributes
}

let defaultValues: EServiceCreateStep1FormValues = {
  name: '',
  description: '',
  technology: 'REST',
  attributes: { certified: [], verified: [], declared: [] },
}

export const EServiceCreateStep1General: React.FC = () => {
  const { t } = useTranslation('eservice')
  const { jwt } = useJwt()
  const { navigate } = useNavigateRouter()
  const currentLanguage = useCurrentLanguage()
  const { eservice, isNewEService, forward } = useEServiceCreateContext()
  const { mutate: updateDraft } = EServiceMutations.useUpdateDraft()
  const { mutate: createDraft } = EServiceMutations.useCreateDraft()

  const validationSchema = object({
    name: string().required(),
    description: string().required(),
    technology: string().required(),
  })

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

  const onSubmit = ({ attributes: _attributes, ...values }: EServiceCreateStep1FormValues) => {
    const attributes = remapFrontendAttributesToBackend(_attributes)
    if (isNewEService) {
      if (!jwt?.organizationId) return
      createDraft(
        { attributes, producerId: jwt.organizationId, ...values },
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
      updateDraft({ eserviceId: eservice.id, attributes, ...values }, { onSuccess: forward })
    }
  }

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
          />

          <TextField
            name="description"
            multiline
            label={t('create.step1.eserviceDescriptionField.label')}
            infoLabel={t('create.step1.eserviceDescriptionField.infoLabel')}
            inputProps={{ maxLength: 250 }}
          />

          <RadioGroup
            name="technology"
            row
            label={t('create.step1.eserviceTechnologyField.label')}
            options={[
              { label: 'REST', value: 'REST' },
              { label: 'SOAP', value: 'SOAP' },
            ]}
          />
        </SectionContainer>

        <StepActions
          back={{
            label: t('backToListBtn'),
            type: 'link',
            to: 'PROVIDE_ESERVICE_LIST',
          }}
          forward={{ label: t('create.forwardWithSaveBtn'), type: 'submit' }}
        />
      </Box>
    </FormProvider>
  )
}

export const EServiceCreateStep1GeneralSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={600} />
}
