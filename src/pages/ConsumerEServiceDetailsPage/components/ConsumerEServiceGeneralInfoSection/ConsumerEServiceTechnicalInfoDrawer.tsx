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
import { interfaceVerificationGuideLink, manageEServiceGuideLink } from '@/config/constants'
import { formatDateString, secondsToMinutes } from '@/utils/format.utils'

type ConsumerEServiceTechnicalInfoDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  descriptor: CatalogEServiceDescriptor
  isSignalHubFlagEnabled: boolean
}

export const ConsumerEServiceTechnicalInfoDrawer: React.FC<
  ConsumerEServiceTechnicalInfoDrawerProps
> = ({ descriptor, isOpen, onClose, isSignalHubFlagEnabled }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.drawers.technicalInfoDrawer' })
  const { t: tCommon } = useTranslation('common')

  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()

  const docs = [descriptor.interface, ...descriptor.docs]

  const voucherLifespan = secondsToMinutes(descriptor.voucherLifespan)

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
        {descriptor.suspendedAt && descriptor.state === 'SUSPENDED' && (
          <InformationContainer
            label={t('suspendedAt')}
            content={formatDateString(descriptor.suspendedAt)}
            direction="column"
          />
        )}

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
          content={`${voucherLifespan} ${tCommon('time.minute', {
            count: voucherLifespan,
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
          label={t('mode.label')}
          content={t(`mode.value.${descriptor.eservice.mode}`)}
          direction="column"
        />
        {isSignalHubFlagEnabled && (
          <InformationContainer
            label={t('isSignalHubEnabled.label')}
            content={t(`isSignalHubEnabled.value.${descriptor.eservice.isSignalHubEnabled}`)}
            direction="column"
          />
        )}
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

        {descriptor.interface?.checksum && (
          <InformationContainer
            label={t('interfaceChecksum')}
            content={descriptor.interface.checksum}
            copyToClipboard={{
              value: descriptor.interface.checksum,
            }}
          />
        )}

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
              <IconLink
                href={interfaceVerificationGuideLink}
                target="_blank"
                startIcon={<LaunchIcon fontSize="small" />}
              >
                {t('usefulLinks.interfaceChecksum')}
              </IconLink>
            </Stack>
          }
          direction="column"
        />
      </Stack>
    </Drawer>
  )
}
