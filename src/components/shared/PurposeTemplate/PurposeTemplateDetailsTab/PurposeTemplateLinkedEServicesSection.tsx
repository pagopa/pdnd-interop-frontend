import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useActiveTab } from '@/hooks/useActiveTab'

export const PurposeTemplateLinkedEServicesSection: React.FC = () => {
  const { t } = useTranslation('purposeTemplate', {
    keyPrefix: 'read.detailsTab.sections.linkedEservices',
  })

  const { updateActiveTab } = useActiveTab('details')

  const handleGoToLinkedEServicesTab = () => {
    updateActiveTab('', 'linkedEservices')
  }

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Button
        onClick={handleGoToLinkedEServicesTab}
        endIcon={<ChevronRightIcon fontSize="small" />}
        sx={{ fontWeight: 700, alignSelf: 'flex-start', padding: 0 }}
      >
        {t('linkedEservicesLink')}
      </Button>
    </SectionContainer>
  )
}

export const PurposeTemplateLinkedEServicesSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}
