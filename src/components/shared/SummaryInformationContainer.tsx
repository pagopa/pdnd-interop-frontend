import React from 'react'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { Stack } from '@mui/system'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

type SummaryInformationContainerProps = {
  label: string
  content?: string | JSX.Element
}

export const SummaryInformationContainer: React.FC<SummaryInformationContainerProps> = ({
  label,
  content,
}) => {
  const { t } = useTranslation('eservice')

  const hasContent = !!content

  return (
    <InformationContainer
      sx={{ alignItems: 'center' }}
      label={label}
      content={
        hasContent ? (
          content
        ) : (
          <Stack alignItems="center" spacing={1} direction="row">
            <ReportProblemOutlinedIcon fontSize="small" color="warning" />
            <Typography variant="body2" fontWeight={600}>
              {t('summary.documentationSummary.missingInfoLabel')}
            </Typography>
          </Stack>
        )
      }
    />
  )
}
