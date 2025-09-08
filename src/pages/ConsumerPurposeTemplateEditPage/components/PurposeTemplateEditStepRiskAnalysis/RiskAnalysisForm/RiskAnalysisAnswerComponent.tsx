import { RHFSwitch } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add'
import { ButtonNaked } from '@pagopa/mui-italia'

export const RiskAnalysisAnswerComponent: React.FC = () => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'edit.step3' })

  return (
    <>
      <RHFSwitch
        label={t('switchLabel')}
        name="assignToTemplateUser"
        disabled={false}
        sx={{ my: 2, ml: 2 }}
      />
      <ButtonNaked
        color="primary"
        type="button"
        sx={{ fontWeight: 700 }}
        //readOnly={readOnly}
        startIcon={<AddIcon fontSize="small" />}
        //onClick={() => setIsAttributeAutocompleteShown(true)}
      >
        {t('addAnnotationBtn')}
      </ButtonNaked>
    </>
  )
}
