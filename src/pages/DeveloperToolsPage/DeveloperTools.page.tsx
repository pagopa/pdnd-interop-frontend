import React from 'react'
import { PageContainer, SectionContainer } from '@/components/layout/containers'
import { Grid, Stack, Tooltip } from '@mui/material'
import { Link } from '@/router'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import { useTranslation } from 'react-i18next'

const DeveloperToolsPage: React.FC = () => {
  const { t } = useTranslation('developer-tools', { keyPrefix: 'developerTools.page' })

  const renderDebugClientAssertionSection = () => {
    return (
      <SectionContainer
        title={t('sectionDebugClientAssertion.title')}
        description={t('sectionDebugClientAssertion.description')}
      >
        <Stack direction="row" spacing={2}>
          <Link
            startIcon={<DownloadIcon />}
            as="button"
            variant="outlined"
            size="medium"
            to="SUBSCRIBE_DEBUG_VOUCHER"
          >
            {t('sectionDebugClientAssertion.button')}
          </Link>
        </Stack>
      </SectionContainer>
    )
  }

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
          {renderDebugClientAssertionSection()}
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default DeveloperToolsPage
