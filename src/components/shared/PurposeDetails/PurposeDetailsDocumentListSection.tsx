import React from 'react'
import { PurposeDownloads } from '@/api/purpose'
import { SectionContainerSkeleton } from '@/components/layout/containers'
import { DownloadableDocumentsList } from '@/components/shared/DownloadableDocumentsList'
import { useTranslation } from 'react-i18next'
import type { EServiceDoc, Purpose } from '@/api/api.generatedTypes'

interface PurposeDetailsDocumentListSectionProps {
  purpose: Purpose
}

export const PurposeDetailsDocumentListSection: React.FC<
  PurposeDetailsDocumentListSectionProps
> = ({ purpose }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'view.sections.downloadDocuments' })
  const downloadRiskAnalysis = PurposeDownloads.useDownloadRiskAnalysis()

  const docs: Array<EServiceDoc> = [
    {
      id: 'riskAnalysis',
      prettyName: `${t('downloadRiskAnalysisLabel')}`,
      name: `${t('downloadRiskAnalysisLabel')}.pdf`,
      contentType: '',
    },
  ]

  const handleDownloadDocument = (document: EServiceDoc) => {
    if (!purpose.currentVersion || !purpose.currentVersion.riskAnalysisDocument) return
    if (document.id === 'riskAnalysis') {
      downloadRiskAnalysis(
        {
          purposeId: purpose.id,
          versionId: purpose.currentVersion.id,
          documentId: purpose.currentVersion.riskAnalysisDocument.id,
        },
        document.name
      )
    }
  }

  return (
    <DownloadableDocumentsList
      sectionTitle={t('label')}
      docs={docs}
      onDocumentDownload={handleDownloadDocument}
    />
  )
}

export const PurposeDetailsDocumentListSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={107} />
}
