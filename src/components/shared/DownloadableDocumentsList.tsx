import React from 'react'
import { Divider, Link, Stack, Typography } from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { useTranslation } from 'react-i18next'
import { SectionContainer } from '../layout/containers'
import type { EServiceDoc } from '@/api/api.generatedTypes'

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
            <Stack component="li" key={doc.id} spacing={2}>
              <Link
                onClick={onDocumentDownload.bind(null, doc)}
                component="button"
                variant="body2"
                underline="hover"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <AttachFileIcon sx={{ mr: 1 }} /> {doc.prettyName}
              </Link>
              {/* TEMP BACKEND - Size data doesn't come from backend (yet) */}
              {/* <Typography fontWeight={600} sx={{ marginLeft: '30px' }}>
                {(doc.size / 1024).toFixed(2)}&nbsp;KB
              </Typography> */}
            </Stack>
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
