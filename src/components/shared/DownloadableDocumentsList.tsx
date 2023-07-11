import React from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { useTranslation } from 'react-i18next'
import { SectionContainer } from '../layout/containers'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { IconLink } from './IconLink'

interface Props {
  docs: Array<EServiceDoc>
  onDocumentDownload: (document: EServiceDoc) => void
  sectionTitle?: string
  noFilesLabel?: string
  bottomContent?: React.ReactNode
}

export function DownloadableDocumentsList({
  docs,
  onDocumentDownload,
  sectionTitle = 'Download',
  noFilesLabel,
  bottomContent,
}: Props) {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'downloadableDocumentList',
  })

  return (
    <SectionContainer title={sectionTitle}>
      {docs.length > 0 ? (
        <Stack component="ul" sx={{ listStyle: 'none', px: 0 }} spacing={2} alignItems="start">
          {docs.map((doc) => (
            <Box component="li" key={doc.id}>
              <IconLink
                onClick={onDocumentDownload.bind(null, doc)}
                component="button"
                startIcon={<AttachFileIcon />}
              >
                {doc.prettyName}
              </IconLink>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2">{noFilesLabel ?? t('noDataLabel')}</Typography>
      )}
      {bottomContent && (
        <>
          <Divider sx={{ my: 2 }} />
          {bottomContent}
        </>
      )}
    </SectionContainer>
  )
}
