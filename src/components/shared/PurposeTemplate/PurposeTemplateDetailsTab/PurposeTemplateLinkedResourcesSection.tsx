import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useActiveTab } from '@/hooks/useActiveTab'

export const PurposeTemplateLinkedResourcesSection: React.FC = () => {
  const { t } = useTranslation('purposeTemplate', {
    keyPrefix: 'read.detailsTab.sections.linkedResources',
  })

  const { updateActiveTab } = useActiveTab('details')

  const handleGoToLinkedResourcesTab = () => {
    updateActiveTab('', 'linkedResources')
  }

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Button
        onClick={handleGoToLinkedResourcesTab}
        endIcon={<ChevronRightIcon fontSize="small" />}
        sx={{ fontWeight: 700, alignSelf: 'flex-start', padding: 0 }}
      >
        {t('link')}
      </Button>
    </SectionContainer>
  )
}

export const PurposeTemplateLinkedResourcesSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}
