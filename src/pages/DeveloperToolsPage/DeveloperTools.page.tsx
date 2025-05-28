import React from 'react'
import { PageContainer, SectionContainer } from '@/components/layout/containers'
import { Grid, Stack, Tooltip } from '@mui/material'
import { Link } from '@/router'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'

const DeveloperToolsPage: React.FC = () => {
  return (
    <PageContainer title={'Tool per sviluppatori'}>
      <Grid container>
        <Grid item xs={7}>
          <SectionContainer
            title="Export analisi del rischio"
            description="Esporta e importa in formato .json formattato l’analisi del rischio che compili, pronta per essere utilizzata nelle chiamate di creazione di una finalità nei flussi machine to machine."
          >
            <Stack direction="row" spacing={2}>
              {/** TODO - implement import functionality */}
              <Tooltip title={'Disponibile a breve'} arrow placement="bottom">
                <span>
                  <Link
                    startIcon={<UploadIcon />}
                    as="button"
                    variant="outlined"
                    size="medium"
                    disabled
                    to="NOT_FOUND"
                  >
                    Importa .json
                  </Link>
                </span>
              </Tooltip>
              <Link
                startIcon={<DownloadIcon />}
                as="button"
                variant="outlined"
                size="medium"
                to="RISK_ANALYSIS_EXPORTER_TOOL"
              >
                Esporta .json
              </Link>
            </Stack>
          </SectionContainer>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default DeveloperToolsPage
