import React from 'react'
import { AgreementDownloads } from '@/api/agreement'
import { SectionContainerSkeleton } from '@/components/layout/containers'
import { useCurrentRoute } from '@/router'
import { DocumentRead } from '@/types/common.types'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { useTranslation } from 'react-i18next'
import { DownloadableDocumentsList } from '../../DownloadableDocumentsList'
import { useAgreementDetailsContext } from '../AgreementDetailsContext'

export const AgreementDocumentListSection: React.FC = () => {
  const { t } = useTranslation('agreement', {
    keyPrefix: 'read.generalInformations.printableCopyField',
  })
  const { isEditPath } = useCurrentRoute()
  const { agreement } = useAgreementDetailsContext()
  const downloadDocument = AgreementDownloads.useDownloadDocument()
  const downloadContract = AgreementDownloads.useDownloadContract()

  if (!agreement) return <AgreementDocumentListSectionSkeleton />
  if (isEditPath) return null

  let docs = agreement.consumerDocuments

  // If request agreement contract is available to download...
  if (agreement.isContractPresent) {
    // Add it to the document list.
    docs = [
      {
        id: 'contract',
        prettyName: `${t('docLabel')}`,
        name: `${t('docLabel')}.pdf`,
        contentType: '',
      },
      ...docs,
    ]
  }

  const handleDownloadDocument = (document: DocumentRead) => {
    if (!agreement) return
    if (document.id === 'contract') {
      downloadContract({ agreementId: agreement.id }, document.name)
      return
    }
    downloadDocument(
      { agreementId: agreement.id, documentId: document.id },
      getDownloadDocumentName(document)
    )
  }

  return <DownloadableDocumentsList docs={docs} onDocumentDownload={handleDownloadDocument} />
}

export const AgreementDocumentListSectionSkeleton: React.FC = () => {
  const { isEditPath } = useCurrentRoute()
  if (isEditPath) return null
  return <SectionContainerSkeleton height={115} />
}
