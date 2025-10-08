import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { useTranslation } from 'react-i18next'
import SaveIcon from '@mui/icons-material/Save'
import { SectionContainer } from '@/components/layout/containers'
import { FormProvider, useForm } from 'react-hook-form'
import { Box } from '@mui/material'
import { AddEServiceToForm } from './AddEServiceToForm'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@/router'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import type { EServiceWithDescriptor } from '@/types/eservice.types'

export type EditStepLinkedEServicesForm = {
  eservices: Array<EServiceWithDescriptor>
}

export const PurposeTemplateEditLinkedEService: React.FC<ActiveStepProps> = ({ forward }) => {
  const { t } = useTranslation('purposeTemplate')
  const { t: tCommon } = useTranslation('common')

  const [isWarningShown, setIsWarningShown] = useState(false)

  const { purposeTemplateId } = useParams<'SUBSCRIBE_PURPOSE_TEMPLATE_EDIT'>()
  const { data: purposeTemplate } = useQuery(PurposeTemplateQueries.getSingle(purposeTemplateId))

  const { data: purposeTemplateEServices } = useQuery({
    ...PurposeTemplateQueries.getEservicesLinkedToPurposeTemplatesList(purposeTemplateId, {
      producerIds: [],
      eserviceIds: [],
      offset: 0,
      limit: 50,
    }),
  })

  const eservicesGroup: EServiceWithDescriptor[] =
    purposeTemplateEServices?.results.map((item) => ({
      eservice: item.eservice,
      descriptor: item.descriptor,
    })) ?? []

  const navigate = useNavigate()

  const isInDraftState = purposeTemplate?.state === 'DRAFT'

  const defaultValues: EditStepLinkedEServicesForm = {
    eservices: [],
  }
  const formMethods = useForm<EditStepLinkedEServicesForm>({
    defaultValues,
  })

  const onSubmit = (data: EditStepLinkedEServicesForm) => {
    const invalidEServices = data.eservices.filter((eserviceWithDescriptor) => {
      const state = eserviceWithDescriptor.descriptor.state
      return state === 'ARCHIVED' || state === 'SUSPENDED'
    })

    if (invalidEServices.length > 0) {
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
              linkedEServices={eservicesGroup}
              showWarning={isWarningShown}
            />{' '}
            {/*TODO ADD LINKED ESERVICES PROP */}
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
