import type { Document } from '@/api/api.generatedTypes'
import { Drawer } from '@/components/shared/Drawer'
import { IconLink } from '@/components/shared/IconLink'
import { Box, Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import AttachmentIcon from '@mui/icons-material/Attachment'
import { AgreementDownloads } from '@/api/agreement'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { useProviderAgreementDetailsContext } from '../../ProviderAgreementDetailsContext'
import { useTranslation } from 'react-i18next'

type ProviderAgreementDetailsDocumentationDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
}

export const ProviderAgreementDetailsDocumentationDrawer: React.FC<
  ProviderAgreementDetailsDocumentationDrawerProps
> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('agreement', {
    keyPrefix: 'providerRead.sections.attributesSectionsList.verifiedSection.documentationDrawer',
  })
  const { agreement } = useProviderAgreementDetailsContext()
  const downloadDocument = AgreementDownloads.useDownloadDocument()

  const docs = agreement.consumerDocuments

  const handleOnClose = () => {
    onClose()
  }

  const handleDownloadDocument = (document: Document) => {
    downloadDocument(
      { agreementId: agreement.id, documentId: document.id },
      getDownloadDocumentName(document)
    )
  }

  return (
    <Drawer isOpen={isOpen} onClose={handleOnClose} title={t('title')} subtitle={t('subtitle')}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="body2">{t('attachedDocuments.title')}</Typography>
          <Box sx={{ mt: 1 }}>
            {docs.length > 0 ? (
              <Stack
                component="ul"
                sx={{ listStyle: 'none', px: 0, mt: 0 }}
                spacing={1}
                alignItems="start"
              >
                {docs.map((doc) => (
                  <Box component="li" key={doc.id}>
                    <IconLink
                      onClick={handleDownloadDocument.bind(null, doc)}
                      component="button"
                      startIcon={<AttachmentIcon />}
                    >
                      {doc.prettyName}
                    </IconLink>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('attachedDocuments.noDocumentsLabel')}
              </Typography>
            )}
          </Box>
        </Box>
        {agreement.consumerNotes && (
          <Box>
            <Typography variant="body2">{t('consumerMessage.title')}</Typography>
            <Divider />
            <Typography variant="caption">{t('consumerMessage.description')}</Typography>
            <Typography sx={{ mt: 1.5 }} variant="body2" fontWeight={600}>
              {agreement.consumerNotes}
            </Typography>
          </Box>
        )}
      </Stack>
    </Drawer>
  )
}
