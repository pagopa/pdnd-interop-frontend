import React from 'react'
import { SectionContainer } from '@/components/layout/containers'
import { Alert, Box, Button } from '@mui/material'
import { CodeBlock } from '@pagopa/interop-fe-commons'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useRiskAnalysisExporterToolContext } from './RiskAnalysisExporterToolContext'

export function RiskAnalysisToolJsonExportStep() {
  const { errors, output, back } = useRiskAnalysisExporterToolContext()

  return (
    <>
      <SectionContainer title="Il tuo export JSON">
        {errors.length === 0 ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            {
              'L’analisi del rischio è stata compilata in ogni sua parte e ha generato un output formattato correttamente.'
            }
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <strong>L’analisi del rischio è stata compilata parzialmente.</strong>
            <Box component="ul" sx={{ my: 0 }}>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </Box>
          </Alert>
        )}

        <Box>
          <CodeBlock code={output} />
        </Box>
      </SectionContainer>
      <Button startIcon={<ArrowBackIcon />} sx={{ mt: 2 }} variant="outlined" onClick={back}>
        Indietro
      </Button>
    </>
  )
}
