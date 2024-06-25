import type { EServiceDoc, ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import { Stack } from '@mui/material'
import { useDrawerState } from '@/hooks/useDrawerState'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { IconLink } from '@/components/shared/IconLink'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { EServiceDownloads } from '@/api/eservice'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { ProviderEServiceUpdateDocumentationDrawer } from './ProviderEServiceUpdateDocumentationDrawer'

type ProviderEServiceDocumentationSectionProps = {
  descriptor: ProducerEServiceDescriptor
}

export const ProviderEServiceDocumentationSection: React.FC<
  ProviderEServiceDocumentationSectionProps
> = ({ descriptor }) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.technicalInformations',
  })
  const { t: tCommon } = useTranslation('common')

  const docs = [descriptor.interface, ...descriptor.docs]

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const onEdit = () => {
    openDrawer()
  }

  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()

  const handleDownloadDocument = (document: EServiceDoc) => {
    downloadDocument(
      {
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        documentId: document.id,
      },
      getDownloadDocumentName(document)
    )
  }

  return (
    <>
      <SectionContainer
        innerSection
        title={t('documentation.title')}
        topSideActions={[
          {
            action: onEdit,
            label: tCommon('actions.edit'),
            icon: EditIcon,
          },
        ]}
      >
        <InformationContainer
          label={t('documentation.label')}
          content={
            <Stack alignItems="start" spacing={0.5}>
              {docs.map((doc) => {
                if (!doc) return null
                return (
                  <IconLink
                    key={doc.id}
                    component="button"
                    onClick={handleDownloadDocument.bind(null, doc)}
                    startIcon={<AttachFileIcon fontSize="small" />}
                  >
                    {doc.prettyName}
                  </IconLink>
                )
              })}
            </Stack>
          }
        />
      </SectionContainer>
      <ProviderEServiceUpdateDocumentationDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        descriptor={descriptor}
      />
    </>
  )
}
