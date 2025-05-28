import React from 'react'
import { SectionContainer } from '@/components/layout/containers'
import { Alert, Box, Button, Stack } from '@mui/material'
import { CodeBlock } from '@pagopa/interop-fe-commons'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useRiskAnalysisExporterToolContext } from './RiskAnalysisExporterToolContext'
import { useTranslation } from 'react-i18next'
import CopyIcon from '@mui/icons-material/ContentCopy'

export function RiskAnalysisToolJsonExportStep() {
  const { t } = useTranslation('developer-tools', {
    keyPrefix: 'riskAnalysisExporterTool.jsonExportStep',
  })
  const { t: tCommon } = useTranslation('common')
  const { errors, output, back } = useRiskAnalysisExporterToolContext()

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(output, null, 2))
  }

  return (
    <>
      <SectionContainer title={t('title')}>
        {errors.length === 0 ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            {t('successAlert')}
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <strong>{t('warningAlertTitle')}</strong>
            <Box component="ul" sx={{ my: 0 }}>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </Box>
          </Alert>
        )}

        <Stack direction="row" spacing={4}>
          <Box flex={1}>
            <CodeBlock code={output} hideCopyButton />
          </Box>
          <Button onClick={handleCopyToClipboard} startIcon={<CopyIcon />} variant="contained">
            {tCommon('actions.copy')}
          </Button>
        </Stack>
      </SectionContainer>
      <Button startIcon={<ArrowBackIcon />} sx={{ mt: 2 }} variant="outlined" onClick={back}>
        {t('backButton')}
      </Button>
    </>
  )
}
