import { AgreementMutations } from '@/api/agreement'
import { SectionContainerSkeleton } from '@/components/layout/containers'
import { useCurrentRoute } from '@/router'
import { DocumentRead } from '@/types/common.types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { DownloadableDocumentsList } from '../../DownloadableDocumentsList'
import { useAgreementDetailsContext } from '../AgreementDetailsContext'

export const AgreementDocumentListSection: React.FC = () => {
  const { t } = useTranslation('agreement', {
    keyPrefix: 'read.generalInformations.printableCopyField',
  })
  const { isEditPath } = useCurrentRoute()
  const { agreement } = useAgreementDetailsContext()
  const { mutate: downloadDocument } = AgreementMutations.useDownloadDocument()
  const { mutate: downloadContract } = AgreementMutations.useDownloadContract()

  if (!agreement) return <AgreementDocumentListSectionSkeleton />
  if (isEditPath) return null

  let docs = agreement.consumerDocuments

  if (agreement.state !== 'DRAFT' && agreement.state !== 'PENDING') {
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
      downloadContract({ agreementId: agreement.id, filename: document.name })
      return
    }
    downloadDocument({ agreementId: agreement.id, document })
  }

  return <DownloadableDocumentsList docs={docs} onDocumentDownload={handleDownloadDocument} />
}

export const AgreementDocumentListSectionSkeleton: React.FC = () => {
  const { isEditPath } = useCurrentRoute()
  if (isEditPath) return null
  return <SectionContainerSkeleton height={115} />
}
