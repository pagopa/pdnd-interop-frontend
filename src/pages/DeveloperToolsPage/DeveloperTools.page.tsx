import React from 'react'
import { PageContainer, SectionContainer } from '@/components/layout/containers'
import { Box, Button, Grid, Stack, Tooltip } from '@mui/material'
import { Link } from '@/router'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import LaunchIcon from '@mui/icons-material/Launch'
import { useTranslation } from 'react-i18next'
import { openApiCheckerLink, schemaEditorLink } from '@/config/constants'

const DeveloperToolsPage: React.FC = () => {
  const { t } = useTranslation('developer-tools', { keyPrefix: 'developerTools.page' })

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <Grid container>
        <Grid item xs={7}>
          <SectionContainer
            title={t('sectionRiskAnalysisExport.title')}
            description={t('sectionRiskAnalysisExport.description')}
          >
            <Stack direction="row" spacing={2}>
              {/** TODO - implement import functionality */}
              <Tooltip
                title={t('sectionRiskAnalysisExport.importTooltip')}
                arrow
                placement="bottom"
              >
                <span>
                  <Link
                    startIcon={<UploadIcon />}
                    as="button"
                    variant="outlined"
                    size="medium"
                    disabled
                    to="NOT_FOUND"
                  >
                    {t('sectionRiskAnalysisExport.importButton')}
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
                {t('sectionRiskAnalysisExport.exportButton')}
              </Link>
            </Stack>
          </SectionContainer>
        </Grid>
        <Grid item xs={7}>
          <SectionContainer
            title={t('sectionVoucherSimulation.title')}
            description={t('sectionVoucherSimulation.description')}
          >
            <Stack direction="row" spacing={2}>
              <Link
                as="button"
                variant="contained"
                size="medium"
                to="SIMULATE_GET_VOUCHER_CONSUMER"
              >
                {t('sectionVoucherSimulation.firstButton')}
              </Link>
              <Link as="button" variant="outlined" size="medium" to="SIMULATE_GET_VOUCHER_API">
                {t('sectionVoucherSimulation.secondButton')}
              </Link>
            </Stack>
          </SectionContainer>
        </Grid>
        <Grid item xs={7}>
          <SectionContainer
            title={t('sectionDebugClientAssertion.title')}
            description={t('sectionDebugClientAssertion.description')}
          >
            <Stack direction="row" spacing={2}>
              <Link as="button" variant="outlined" size="medium" to="SUBSCRIBE_DEBUG_VOUCHER">
                {t('sectionDebugClientAssertion.button')}
              </Link>
            </Stack>
          </SectionContainer>
        </Grid>
        <Grid item xs={7}>
          <SectionContainer
            title={t('sectionOpenApiAnalysis.title')}
            description={
              <Box>
                {t('sectionOpenApiAnalysis.description')}
                <Box component="ul" sx={{ m: 0, pl: 3 }}>
                  <li>{t('sectionOpenApiAnalysis.openApiCheckerDescription')}</li>
                  <li>{t('sectionOpenApiAnalysis.schemaEditorDescription')}</li>
                </Box>
              </Box>
            }
            descriptionTypographyProps={{ component: 'div' }}
          >
            <Stack direction="row" spacing={2}>
              <Button
                component="a"
                variant="contained"
                size="medium"
                href={openApiCheckerLink}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<LaunchIcon />}
              >
                {t('sectionOpenApiAnalysis.openApiCheckerButton')}
              </Button>
              <Button
                component="a"
                variant="outlined"
                size="medium"
                href={schemaEditorLink}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<LaunchIcon />}
              >
                {t('sectionOpenApiAnalysis.schemaEditorButton')}
              </Button>
            </Stack>
          </SectionContainer>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default DeveloperToolsPage
