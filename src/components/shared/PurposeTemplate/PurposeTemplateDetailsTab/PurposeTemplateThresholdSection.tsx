import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { Box, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material'
import { formatThousands } from '@/utils/format.utils'
import type { PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'

type PurposeTemplateThresholdSectionProps = {
  purposeTemplate: PurposeTemplateWithCompactCreator
}

export const PurposeTemplateThresholdSection: React.FC<PurposeTemplateThresholdSectionProps> = ({
  purposeTemplate,
}) => {
  const { t } = useTranslation('purposeTemplate', {
    keyPrefix: 'read.detailsTab.sections.thresholds',
  })

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack spacing={2}>
        <PurposeTemplateSuggestedPlanCard purposeTemplate={purposeTemplate} />
      </Stack>
    </SectionContainer>
  )
}

export const PurposeTemplateThresholdSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}

const PurposeTemplateSuggestedPlanCard: React.FC<PurposeTemplateThresholdSectionProps> = ({
  purposeTemplate,
}) => {
  const { t } = useTranslation('purposeTemplate', {
    keyPrefix: 'read.detailsTab.sections.thresholds.planCard',
  })
  if (!purposeTemplate.purposeDailyCalls) return
  return (
    <Card
      elevation={8}
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
      }}
    >
      <CardHeader
        sx={{ px: 3, pt: 3, pb: 1 }}
        titleTypographyProps={{ variant: 'sidenav' }}
        title={t('title')}
        subheaderTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
        subheader={t('subtitle')}
      />
      <CardContent sx={{ px: 3, pt: 1, display: 'flex', flexGrow: 1 }}>
        <Stack direction="column" spacing={2} flexGrow={1}>
          <Box flexGrow={1}>
            <Typography variant="h4">
              {formatThousands(purposeTemplate.purposeDailyCalls)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
