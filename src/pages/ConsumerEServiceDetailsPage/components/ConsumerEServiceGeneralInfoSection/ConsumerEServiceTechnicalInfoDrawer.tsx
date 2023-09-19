import React from 'react'
import type { CatalogEServiceDescriptor, EServiceDoc } from '@/api/api.generatedTypes'
import { EServiceDownloads } from '@/api/eservice'
import { Drawer } from '@/components/shared/Drawer'
import { IconLink } from '@/components/shared/IconLink'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import LaunchIcon from '@mui/icons-material/Launch'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { manageEServiceGuideLink } from '@/config/constants'

type ConsumerEServiceTechnicalInfoDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  descriptor: CatalogEServiceDescriptor
}

export const ConsumerEServiceTechnicalInfoDrawer: React.FC<
  ConsumerEServiceTechnicalInfoDrawerProps
> = ({ descriptor, isOpen, onClose }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.drawers.technicalInfoDrawer' })
  const { t: tCommon } = useTranslation('common')

  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()

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
    <Drawer isOpen={isOpen} onClose={onClose} title={t('title')}>
      <Stack spacing={3}>
        <InformationContainer
          label={t('technology')}
          content={descriptor.eservice.technology}
          direction="column"
        />

        <InformationContainer
          label={t('audience')}
          content={descriptor.audience[0]}
          direction="column"
        />

        <InformationContainer
          label={t('voucherLifespan')}
          content={`${descriptor.voucherLifespan} ${tCommon('time.minute', {
            count: descriptor.voucherLifespan,
          })}`}
          direction="column"
        />

        <InformationContainer
          label={t('dailyCallsPerConsumer')}
          content={`${descriptor.dailyCallsPerConsumer} ${t('callsPerDay')}`}
          direction="column"
        />

        <InformationContainer
          label={t('dailyCallsTotal')}
          content={`${descriptor.dailyCallsTotal} ${t('callsPerDay')}`}
          direction="column"
        />

        <InformationContainer
          label={t('documentation')}
          content={
            <Stack spacing={1} mt={1} alignItems="start">
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
          direction="column"
        />

        <InformationContainer
          label={t('usefulLinks.title')}
          content={
            <Stack alignItems="start" mt={1}>
              <IconLink
                href={manageEServiceGuideLink}
                target="_blank"
                startIcon={<LaunchIcon fontSize="small" />}
              >
                {t('usefulLinks.integrateEService')}
              </IconLink>
            </Stack>
          }
          direction="column"
        />
      </Stack>
    </Drawer>
  )
}
