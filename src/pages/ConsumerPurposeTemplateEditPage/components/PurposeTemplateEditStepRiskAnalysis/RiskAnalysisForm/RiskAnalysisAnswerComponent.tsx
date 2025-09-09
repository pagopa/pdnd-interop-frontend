import { RHFSwitch } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add'
import { ButtonNaked } from '@pagopa/mui-italia'
import { useDrawerState } from '@/hooks/useDrawerState'
import { AddAnnotationDrawer } from '@/components/shared/AddAnnotationDrawer'

export const RiskAnalysisAnswerComponent: React.FC<{ questionId: string }> = ({ questionId }) => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'edit.step3' })

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const handleClick = () => {
    openDrawer()
  }

  return (
    <>
      <RHFSwitch
        id={questionId}
        label={t('switchLabel')}
        name={`assignToTemplateUsers.${questionId}`}
        disabled={false}
        sx={{ my: 2, ml: 2 }}
      />
      <ButtonNaked
        color="primary"
        type="button"
        sx={{ fontWeight: 700 }}
        startIcon={<AddIcon fontSize="small" />}
        onClick={handleClick}
      >
        {t('addAnnotationBtn')}
      </ButtonNaked>
      <AddAnnotationDrawer isOpen={isOpen} onClose={closeDrawer} onSubmit={() => {}} />
    </>
  )
}
