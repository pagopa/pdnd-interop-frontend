import React from 'react'
import { Box, Typography, Link } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import { CodeSnippetPreview } from './CodeSnippetPreview'
import { SectionContainer } from '@/components/layout/containers'

type Props = {
  fileUrl: string
  previewUrl: string
  fileName: string
  substitutions: Record<string, string>
  keyPrefix?: string
}

export const VoucherScriptPreviewSection: React.FC<Props> = ({
  fileUrl,
  previewUrl,
  fileName,
  substitutions,
  keyPrefix,
}) => {
  const { t } = useTranslation('voucher', { keyPrefix })

  return (
    <SectionContainer title={t('assertionScript.title')}>
      <Box sx={{ pl: 2 }} component="ol">
        <Typography component="li" variant="body2">
          <Trans components={{ 1: <Link download href={fileUrl} /> }}>
            {t('assertionScript.steps.1', { filename: `${fileName}.py` })}
          </Trans>
        </Typography>

        <Typography component="li" variant="body2">
          <Trans components={{ 1: <Link download href={fileUrl} /> }}>
            {t('assertionScript.steps.2', { filename: `${fileName}.py` })}
          </Trans>
        </Typography>

        <Typography component="li" variant="body2" sx={{ whiteSpace: 'break-spaces' }}>
          {t('assertionScript.steps.3')}
        </Typography>

        <Typography component="li" variant="body2">
          {t('assertionScript.steps.4')}
        </Typography>

        <Typography component="li" variant="body2">
          {t('assertionScript.steps.5')}
        </Typography>
      </Box>

      <CodeSnippetPreview
        sx={{ mt: 2 }}
        title={t('assertionScript.exampleLabel')}
        activeLang="python"
        entries={[
          {
            url: previewUrl,
            value: 'python',
          },
        ]}
        scriptSubstitutionValues={substitutions}
      />
      <Typography sx={{ mt: 2 }} variant="body2">
        {t('assertionScript.steps.result')}
      </Typography>
    </SectionContainer>
  )
}
