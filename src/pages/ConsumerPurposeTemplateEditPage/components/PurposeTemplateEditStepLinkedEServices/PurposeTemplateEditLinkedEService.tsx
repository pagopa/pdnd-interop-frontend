import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { useTranslation } from 'react-i18next'
import SaveIcon from '@mui/icons-material/Save'
import { SectionContainer } from '@/components/layout/containers'
import { FormProvider, useForm } from 'react-hook-form'
import type { CatalogEService } from '@/api/api.generatedTypes'
import { Box } from '@mui/material'
import { AddEServiceToForm, type LinkedEServiceWithDescriptor } from './AddEServiceToForm'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@/router'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export type EditStepLinkedEServicesForm = {
  eservices: Array<CatalogEService>
}

export const PurposeTemplateEditLinkedEService: React.FC<ActiveStepProps> = ({ forward }) => {
  const { t } = useTranslation('purposeTemplate')
  const { t: tCommon } = useTranslation('common')

  const [isWarningShown, setIsWarningShown] = useState(false)

  const { purposeTemplateId } = useParams<'SUBSCRIBE_PURPOSE_TEMPLATE_EDIT'>()
  const { data: purposeTemplate } = useQuery(PurposeTemplateQueries.getSingle(purposeTemplateId))
  const { data: eservicesData } = useQuery({
    ...PurposeTemplateQueries.getEservicesLinkedToPurposeTemplatesList({
      purposeTemplateId,
      offset: 0,
      limit: 50,
    }),
    enabled: Boolean(purposeTemplateId),
  })

  // Create a map of EServices with their descriptors
  const linkedEServices: LinkedEServiceWithDescriptor[] =
    eservicesData?.results?.map((item) => ({
      eservice: item.eservice,
      descriptor: item.descriptor,
    })) || []

  const navigate = useNavigate()

  const isInDraftState = purposeTemplate?.state === 'DRAFT'

  const defaultValues: EditStepLinkedEServicesForm = {
    eservices: [],
  }
  const formMethods = useForm<EditStepLinkedEServicesForm>({
    defaultValues,
  })

  const onSubmit = (data: EditStepLinkedEServicesForm) => {
    // Check both form EServices and linked EServices for invalid states
    const formInvalidEServices = data.eservices.filter((eservice) => {
      const state = eservice.activeDescriptor?.state
      return state === 'ARCHIVED' || state === 'SUSPENDED'
    })

    const linkedInvalidEServices = linkedEServices.filter((linkedItem) => {
      const state = linkedItem.descriptor.state
      return state === 'ARCHIVED' || state === 'SUSPENDED'
    })

    if (formInvalidEServices.length > 0 || linkedInvalidEServices.length > 0) {
      setIsWarningShown(true)
      return
    }

    if (isInDraftState) {
      forward()
    } else {
      navigate('NOT_FOUND') // TODO: Replace with details page route
    }
  }

  if (!purposeTemplate) return

  return (
    <>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <SectionContainer
            title={t('edit.step2.detailsTitle')}
            description={t('edit.step2.detailsDescription')}
          >
            <AddEServiceToForm
              readOnly={false}
              purposeTemplate={purposeTemplate}
              linkedEServices={linkedEServices}
              showWarning={isWarningShown}
            />{' '}
            <StepActions
              back={{
                to: isInDraftState ? 'SUBSCRIBE_PURPOSE_TEMPLATE_LIST' : 'NOT_FOUND', //TODO: REPLACE WITH DETAILS PAGE RUOTE
                label: isInDraftState ? t('backToListBtn') : tCommon('actions.cancel'),
                type: 'link',
              }}
              forward={{
                label: isInDraftState
                  ? t('edit.forwardWithSaveBtn')
                  : t('edit.step2.editLinkedEservices'),
                type: 'submit',
                startIcon: <SaveIcon />,
              }}
            />
          </SectionContainer>
        </Box>
      </FormProvider>
    </>
  )
}
