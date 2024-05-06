import { EServiceDownloads, EServiceQueries } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useParams } from '@/router'
import { Divider, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ProviderEServiceThresholdsSection } from './ProviderEServiceThresholdsSection'
import { ProviderEServiceUsefulLinksSection } from './ProviderEServiceUsefulLinksSection'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { IconLink } from '@/components/shared/IconLink'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { getDownloadDocumentName } from '@/utils/eservice.utils'

export const ProviderEServiceTechnicalInfoSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.technicalInformations',
  })

  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()
  const { data: descriptor } = EServiceQueries.useGetDescriptorProvider(eserviceId, descriptorId, {
    suspense: true,
  })

  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()

  if (!descriptor) return null

  const docs = [descriptor.interface, ...descriptor.docs]
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
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack spacing={2}>
        <SectionContainer innerSection>
          <Stack spacing={2}>
            <InformationContainer
              label={t('technology')}
              content={descriptor.eservice.technology}
            />

            <InformationContainer label={t('audience')} content={descriptor.audience[0]} />

            <InformationContainer
              label={t('mode.label')}
              labelDescription={t('mode.labelDescription')}
              content={t(`mode.value.${descriptor.eservice.mode}`)}
            />

            <InformationContainer
              label={t('documentation.title')}
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
          </Stack>
        </SectionContainer>
        <Divider />
        <ProviderEServiceThresholdsSection descriptor={descriptor} />
        <Divider />
        <ProviderEServiceUsefulLinksSection />
      </Stack>
    </SectionContainer>
  )
}

export const ProviderEServiceTechnicalInfoSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}
