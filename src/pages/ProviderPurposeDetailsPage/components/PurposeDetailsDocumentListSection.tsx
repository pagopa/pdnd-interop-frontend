import React from 'react'
import { PurposeDownloads, PurposeQueries } from '@/api/purpose'
import { SectionContainerSkeleton } from '@/components/layout/containers'
import { DownloadableDocumentsList } from '@/components/shared/DownloadableDocumentsList'
import { useTranslation } from 'react-i18next'
import type { EServiceDoc } from '@/api/api.generatedTypes'

interface PurposeDetailsDocumentListSectionProps {
  purposeId: string
}

export const PurposeDetailsDocumentListSection: React.FC<
  PurposeDetailsDocumentListSectionProps
> = ({ purposeId }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'view.sections.downloadDocuments' })
  const { data: purpose } = PurposeQueries.useGetSingle(purposeId)
  const downloadRiskAnalysis = PurposeDownloads.useDownloadRiskAnalysis()

  if (!purpose) return null

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
          purposeId,
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
