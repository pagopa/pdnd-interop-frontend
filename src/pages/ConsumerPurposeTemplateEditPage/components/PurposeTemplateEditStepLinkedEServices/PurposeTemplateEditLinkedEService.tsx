import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { useTranslation } from 'react-i18next'
import SaveIcon from '@mui/icons-material/Save'
import { SectionContainer } from '@/components/layout/containers'
import { FormProvider, useForm } from 'react-hook-form'
import type { PurposeTemplateEditStepGeneralFormValues } from '../PurposeTemplateEditStepGeneral/PurposeTemplateEditStepGeneralForm'
import type { CompactEService } from '@/api/api.generatedTypes'
import { Box } from '@mui/material'

export type EditStepLinkedEServicesForm = {
  eservices: Array<CompactEService>
}

export const PurposeTemplateEditLinkedEService: React.FC<ActiveStepProps> = ({ forward }) => {
  const { t } = useTranslation('purposeTemplate')

  const defaultValues: EditStepLinkedEServicesForm = {
    eservices: [],
  }
  const formMethods = useForm<EditStepLinkedEServicesForm>({
    defaultValues,
  })

  const onSubmit = () => {
    forward()
  }

  return (
    <>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <SectionContainer
            title={t('edit.step2.detailsTitle')}
            description={t('edit.step2.detailsDescription')}
          >
            TODO
            <StepActions
              back={{
                to: 'SUBSCRIBE_PURPOSE_TEMPLATE_LIST',
                label: t('backToListBtn'),
                type: 'link',
              }}
              forward={{
                label: t('edit.forwardWithSaveBtn'),
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
