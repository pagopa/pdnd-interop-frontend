import React from 'react'
import { Drawer } from '@/components/shared/Drawer'
import { useAgreementDetailsContext } from '../AgreementDetailsContext'
import { Box, Stack, Typography } from '@mui/material'
import { AgreementDownloads } from '@/api/agreement'
import type { Document } from '@/api/api.generatedTypes'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { IconLink } from '../../IconLink'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { useTranslation } from 'react-i18next'
import { useCurrentRoute } from '@/router'
import type { ProviderOrConsumer } from '@/types/common.types'

export const AgreementAttachedDocumentsDrawer = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attachedDocumentsDrawer' })

  const { agreement, isAttachedDocsDrawerOpen, closeAttachedDocsDrawer } =
    useAgreementDetailsContext()
  const downloadDocument = AgreementDownloads.useDownloadDocument()
  const { mode } = useCurrentRoute()

  if (!agreement) return null

  const handleDownloadDocument = (document: Document) => {
    downloadDocument(
      { agreementId: agreement.id, documentId: document.id },
      getDownloadDocumentName(document)
    )
  }

  const docs = agreement.consumerDocuments

  return (
    <Drawer
      title={t('title')}
      subtitle={t(`subtitle.${mode as ProviderOrConsumer}`)}
      isOpen={isAttachedDocsDrawerOpen}
      onClose={closeAttachedDocsDrawer}
    >
      <Stack spacing={4}>
        {agreement.consumerNotes && (
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {t('consumerMessage.title')}
            </Typography>
            <Typography sx={{ mt: 1.5 }} variant="body2">
              {agreement.consumerNotes}
            </Typography>
          </Box>
        )}

        <Box>
          <Typography variant="body2" fontWeight={600}>
            {t('attachedDocuments.title')}
          </Typography>
          <Box sx={{ mt: 1.5 }}>
            {docs.length > 0 ? (
              <Stack
                component="ul"
                sx={{ listStyle: 'none', px: 0 }}
                spacing={1.5}
                alignItems="start"
              >
                {docs.map((doc) => (
                  <Box component="li" key={doc.id}>
                    <IconLink
                      onClick={handleDownloadDocument.bind(null, doc)}
                      component="button"
                      startIcon={<AttachFileIcon />}
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
      </Stack>
    </Drawer>
  )
}
