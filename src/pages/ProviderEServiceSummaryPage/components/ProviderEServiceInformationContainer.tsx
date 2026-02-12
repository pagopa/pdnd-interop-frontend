import React from 'react'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { Stack } from '@mui/system'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

type ProviderEServiceInformationContainerProps = {
  label: string
  content?: string
  children?: React.ReactNode
}

export const ProviderEServiceInformationContainer: React.FC<
  ProviderEServiceInformationContainerProps
> = ({ label, content, children }) => {
  const { t } = useTranslation('eservice')

  if (children) {
    return (
      <InformationContainer sx={{ alignItems: 'center' }} label={label} content={<>{children}</>} />
    )
  }

  if (content) {
    return <InformationContainer label={label} content={content} />
  }

  return (
    <InformationContainer
      label={label}
      content={
        <Stack alignItems="center" spacing={1} direction="row">
          <ReportProblemOutlinedIcon fontSize="small" color="warning" />
          <Typography variant="body2" fontWeight={600}>
            {t('summary.documentationSummary.missingInfoLabel')}
          </Typography>
        </Stack>
      }
    />
  )
}
