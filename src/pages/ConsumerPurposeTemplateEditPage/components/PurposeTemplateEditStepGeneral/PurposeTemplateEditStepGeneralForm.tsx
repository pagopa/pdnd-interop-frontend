import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { RHFTextField, RHFRadioGroup } from '@/components/shared/react-hook-form-inputs'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { Box } from '@mui/system'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SaveIcon from '@mui/icons-material/Save'
import type {
  PurposeTemplateSeed,
  PurposeTemplateWithCompactCreator,
} from '@/api/api.generatedTypes'

export type PurposeTemplateEditStepGeneralFormValues = Omit<
  PurposeTemplateSeed,
  'purposeRiskAnalysisForm' | 'purposeIsFreeOfCharge'
> & {
  dailyCalls: number | undefined
  isFreeOfCharge: 'YES' | 'NO'
}

type PurposeTemplateEditStepGeneralFormProps = ActiveStepProps & {
  purposeTemplate: PurposeTemplateWithCompactCreator
  defaultValues: PurposeTemplateEditStepGeneralFormValues
}

const PurposeTemplateEditStepGeneralForm: React.FC<PurposeTemplateEditStepGeneralFormProps> = ({
  purposeTemplate,
  defaultValues,
  forward,
}) => {
  const { t } = useTranslation('purposeTemplate')
  const { mutate: updateDraft } = PurposeTemplateMutations.useUpdateDraft()

  const formMethods = useForm<PurposeTemplateEditStepGeneralFormValues>({
    defaultValues,
  })

  const onSubmit = (values: PurposeTemplateEditStepGeneralFormValues) => {
    const { dailyCalls, isFreeOfCharge, purposeFreeOfChargeReason, ...updateDraftPayload } = values
    const isFreeOfChargeBool = isFreeOfCharge === 'YES'
    const purposeTemplateId = purposeTemplate.id

    const requestPayload = {
      ...updateDraftPayload,
      isFreeOfCharge: isFreeOfChargeBool,
      purposeFreeOfChargeReason: isFreeOfChargeBool ? purposeFreeOfChargeReason : undefined,
      purposeTemplateId,
      dailyCalls: dailyCalls,
    }

    updateDraft(
      {
        ...requestPayload,
        purposeIsFreeOfCharge: purposeTemplate.purposeIsFreeOfCharge,
      },
      { onSuccess: forward }
    )
  }

  const isFreeOfCharge = formMethods.watch('isFreeOfCharge')

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer title={t('edit.step1.detailsTitle')}>
          <RHFTextField
            name="title"
            label={t('edit.step1.purposeTemplateNameField.label')}
            infoLabel={t('edit.step1.purposeTemplateNameField.infoLabel')}
            focusOnMount
            inputProps={{ maxLength: 60 }}
            rules={{ required: true, minLength: 5 }}
          />

          <RHFTextField
            name="description"
            label={t('edit.step1.purposeTemplateDescriptionField.label')}
            infoLabel={t('edit.step1.purposeTemplateDescriptionField.infoLabel')}
            multiline
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 10 }}
          />
          <RHFTextField
            name="intendedTarget"
            label={t('edit.step1.purposeTemplateIntendedTargetField.label')}
            infoLabel={t('edit.step1.purposeTemplateIntendedTargetField.infoLabel')}
            multiline
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 10 }}
          />

          <RHFRadioGroup
            name="isFreeOfCharge"
            label={t('edit.step1.purposeTemplateIsFreeOfCharge.radioButton.label')}
            options={[
              {
                label: t('edit.step1.purposeTemplateIsFreeOfCharge.radioButton.YES'),
                value: 'YES',
              },
              {
                label: t('edit.step1.purposeTemplateIsFreeOfCharge.radioButton.NO'),
                value: 'NO',
              },
            ]}
          />

          {isFreeOfCharge === 'YES' && (
            <RHFTextField
              name="freeOfChargeReason"
              label={t('edit.step1.purposeTemplateIsFreeOfCharge.reasonField.label')}
              infoLabel={t('edit.step1.purposeTemplateIsFreeOfCharge.reasonField.infoLabel')}
              multiline
              inputProps={{ maxLength: 250 }}
              rules={{ required: true, minLength: 10 }}
            />
          )}

          <RHFTextField
            name="dailyCalls"
            label={t('edit.step1.APICallsField.label')}
            type="number"
            inputProps={{ min: '1' }}
            sx={{ mb: 0 }}
            rules={{ required: true, min: 1 }}
          />
        </SectionContainer>
        <StepActions
          back={{ to: 'SUBSCRIBE_PURPOSE_TEMPLATE_LIST', label: t('backToListBtn'), type: 'link' }}
          forward={{
            label: t('edit.forwardWithSaveBtn'),
            type: 'submit',
            startIcon: <SaveIcon />,
          }}
        />
      </Box>
    </FormProvider>
  )
}

export const PurposeTemplateEditStepGeneralFormSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={680} />
}

export default PurposeTemplateEditStepGeneralForm
