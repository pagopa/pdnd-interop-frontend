import { Link } from '@/router'
import { Alert, AlertTitle, Typography } from '@mui/material'
import { ButtonNaked } from '@pagopa/mui-italia'
import React from 'react'
import { useTranslation } from 'react-i18next'

type TemplateBannerProps = {
  templateProducerName: string
  templateName: string
  templateId: string
  templateVersionId: string
}

const TemplateBanner: React.FC<TemplateBannerProps> = ({
  templateProducerName,
  templateName,
  templateId,
  templateVersionId,
}) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'templateInstancesGroup.banner',
  })
  const id = React.useId()

  return (
    <Alert
      aria-label={id}
      severity="info"
      variant="outlined"
      sx={{ bgcolor: 'background.paper', border: 0 }}
      icon={false}
    >
      <AlertTitle id={id} sx={{ fontWeight: 700 }}>
        {t('title')}
      </AlertTitle>
      <Typography variant="body2">
        {t('description', {
          templateName: templateName,
          templateProducerName: templateProducerName,
        })}
      </Typography>
      <ButtonNaked
        component={Link}
        to="SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS"
        params={{
          eServiceTemplateId: templateId,
          eServiceTemplateVersionId: templateVersionId,
        }}
      >
        <Typography variant="body2" fontWeight={700} color={'primary.main'} mt={2}>
          {t('buttonLabel')}
        </Typography>
      </ButtonNaked>
    </Alert>
  )
}

export default TemplateBanner
