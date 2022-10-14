import React from 'react'
import { Stack, Typography } from '@mui/material'
import { AxiosResponse } from 'axios'
import { EServiceDocumentRead } from '../../../types'
import { RunActionOutput, useFeedback } from '../../hooks/useFeedback'
import { getDownloadDocumentName } from '../../lib/eservice-utils'
import { downloadFile } from '../../lib/file-utils'
import { StyledLink } from './StyledLink'
import StyledSection from './StyledSection'
import { AttachFile as AttachFileIcon } from '@mui/icons-material'

interface Props {
  descriptorId: string
  eserviceId: string
  docs: Array<EServiceDocumentRead>
  sectionTitle?: string
  noFilesLabel?: string
}

function DownloadableDocumentListSection({
  descriptorId,
  eserviceId,
  docs,
  sectionTitle = 'Download',
  noFilesLabel = 'Nessun download disponibile',
}: Props) {
  const { runAction } = useFeedback()

  const handleDownloadDocument = async (document: EServiceDocumentRead) => {
    const { response, outcome } = (await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DOWNLOAD_DOCUMENT',
          endpointParams: {
            eserviceId,
            descriptorId,
            documentId: document.id,
          },
        },
        config: { responseType: 'arraybuffer' },
      },
      { suppressToast: ['success'] }
    )) as RunActionOutput

    if (outcome === 'success') {
      const filename = getDownloadDocumentName(document)
      downloadFile((response as AxiosResponse).data, filename)
    }
  }

  return (
    <StyledSection>
      <StyledSection.Title>{sectionTitle}</StyledSection.Title>
      <StyledSection.Content>
        {Boolean(docs.length > 0) ? (
          <Stack spacing={2} alignItems="start">
            {docs.map((doc) => (
              <Stack key={doc.id} spacing={2}>
                <StyledLink
                  onClick={handleDownloadDocument.bind(null, doc)}
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
          <Typography variant="body2">{noFilesLabel}</Typography>
        )}
      </StyledSection.Content>
    </StyledSection>
  )
}

export default DownloadableDocumentListSection
