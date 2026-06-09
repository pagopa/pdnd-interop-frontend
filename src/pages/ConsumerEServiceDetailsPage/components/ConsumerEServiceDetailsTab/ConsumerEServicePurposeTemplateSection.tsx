import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Button, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useActiveTab } from '@/hooks/useActiveTab'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

export const ConsumerLinkedPurposeTemplatesSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.linkedPurposeTemplates',
  })

  const { updateActiveTab } = useActiveTab('linkedPurposeTemplates')

  const handleGoToLinkedEServicesTab = () => {
    updateActiveTab('', 'linkedPurposeTemplates')
  }

  return (
    <>
      <SectionContainer title={t('title')} description={t('description')}>
        <SectionContainer innerSection>
          <Stack spacing={2}>
            <Button
              onClick={handleGoToLinkedEServicesTab}
              endIcon={<ChevronRightIcon fontSize="small" />}
              sx={{ fontWeight: 700, alignSelf: 'flex-start', padding: 0 }}
            >
              {t('linkedPurposeTabLink')}
            </Button>
          </Stack>
        </SectionContainer>
      </SectionContainer>
    </>
  )
}

export const ConsumerLinkedPurposeTemplatesSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}
