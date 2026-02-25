import React from 'react'
import { Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from '@/router'
import { ThankYouPage } from '@/components/shared/ThankYouPage'

const ProviderEServiceTemplatePublishThankYouPage: React.FC = () => {
  const { t } = useTranslation('eserviceTemplate', { keyPrefix: 'publishThankYou' })
  const { eServiceTemplateId, eServiceTemplateVersionId } =
    useParams<'PROVIDE_ESERVICE_TEMPLATE_PUBLISH_THANK_YOU'>()
  const navigate = useNavigate()

  const handleClose = () => {
    navigate('PROVIDE_ESERVICE_TEMPLATE_DETAILS', {
      params: { eServiceTemplateId, eServiceTemplateVersionId },
    })
  }

  return (
    <ThankYouPage
      icon={CheckIcon}
      title={t('title')}
      description={<Typography variant="body1">{t('description')}</Typography>}
      buttonLabel={t('action')}
      onButtonClick={handleClose}
    />
  )
}

export default ProviderEServiceTemplatePublishThankYouPage
