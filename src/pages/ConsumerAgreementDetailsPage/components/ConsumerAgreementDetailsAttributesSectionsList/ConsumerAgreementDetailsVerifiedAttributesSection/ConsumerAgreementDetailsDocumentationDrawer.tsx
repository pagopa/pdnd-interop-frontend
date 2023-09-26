import React from 'react'
import { useTranslation } from 'react-i18next'
import { useConsumerAgreementDetailsContext } from '../../ConsumerAgreementDetailsContext'
import { AgreementDownloads } from '@/api/agreement'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import type { Document } from '@/api/api.generatedTypes'
import { Drawer } from '@/components/shared/Drawer'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { IconLink } from '@/components/shared/IconLink'
import AttachmentIcon from '@mui/icons-material/Attachment'

type ConsumerAgreementDetailsDocumentationDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
}

export const ConsumerAgreementDetailsDocumentationDrawer: React.FC<
  ConsumerAgreementDetailsDocumentationDrawerProps
> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('agreement', {
    keyPrefix: 'providerRead.sections.attributesSectionsList.verifiedSection.documentationDrawer',
  }) // TODO strings

  const { agreement } = useConsumerAgreementDetailsContext()

  const downloadDocument = AgreementDownloads.useDownloadDocument()

  if (!agreement) return null

  const docs = agreement.consumerDocuments

  const handleCloseDrawer = () => {
    onClose()
  }

  const handleDownloadDocument = (document: Document) => {
    downloadDocument(
      { agreementId: agreement.id, documentId: document.id },
      getDownloadDocumentName(document)
    )
  }

  return (
    <Drawer isOpen={isOpen} onClose={handleCloseDrawer} title={t('TODO title')}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="body2">{t('TODO attachedDocuments.title')}</Typography>
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
                {t('TODO attachedDocuments.noDocumentsLabel')}
              </Typography>
            )}
          </Box>
        </Box>
        {agreement.consumerNotes && (
          <Box>
            <Typography variant="body2">{t('TODO consumerMessage.title')}</Typography>
            <Divider />
            <Typography variant="caption">{t('TODO consumerMessage.description')}</Typography>
            <Typography sx={{ mt: 1.5 }} variant="body2" fontWeight={600}>
              {agreement.consumerNotes}
            </Typography>
          </Box>
        )}
      </Stack>
    </Drawer>
  )
}
