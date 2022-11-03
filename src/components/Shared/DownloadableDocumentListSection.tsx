import React from 'react'
import { Stack, Typography } from '@mui/material'
import { EServiceDocumentRead } from '../../../types'
import { StyledLink } from './StyledLink'
import StyledSection from './StyledSection'
import { AttachFile as AttachFileIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface Props {
  docs: Array<EServiceDocumentRead>
  onDocumentDownload: (document: EServiceDocumentRead) => void
  sectionTitle?: string
  noFilesLabel?: string
}

function DownloadableDocumentListSection({
  docs,
  onDocumentDownload,
  sectionTitle = 'Download',
  noFilesLabel,
}: Props) {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'downloadableDocumentListSection',
  })

  return (
    <StyledSection>
      <StyledSection.Title>{sectionTitle}</StyledSection.Title>
      <StyledSection.Content>
        {docs.length > 0 ? (
          <Stack spacing={2} alignItems="start">
            {docs.map((doc) => (
              <Stack key={doc.id} spacing={2}>
                <StyledLink
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
                </StyledLink>
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
      </StyledSection.Content>
    </StyledSection>
  )
}

export default DownloadableDocumentListSection
