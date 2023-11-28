import React from 'react'
import type { EServiceDoc, ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { Drawer } from '@/components/shared/Drawer'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { secondsToMinutes } from '@/utils/format.utils'
import { IconLink } from '@/components/shared/IconLink'
import {
  implementAndManageEServiceGuideLink,
  voucherVerificationGuideLink,
} from '@/config/constants'
import { WELL_KNOWN_URLS } from '@/config/env'
import LaunchIcon from '@mui/icons-material/Launch'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { EServiceDownloads } from '@/api/eservice'
import { getDownloadDocumentName } from '@/utils/eservice.utils'

type ProviderEServiceTechnicalInfoDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  descriptor: ProducerEServiceDescriptor
}

export const ProviderEServiceTechnicalInfoDrawer: React.FC<
  ProviderEServiceTechnicalInfoDrawerProps
> = ({ descriptor, isOpen, onClose }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.drawers.technicalInfoDrawer' })
  const { t: tCommon } = useTranslation('common')

  const voucherLifespan = secondsToMinutes(descriptor.voucherLifespan)
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

        <InformationContainer
          label={t('documentation')}
          content={
            <Stack alignItems="start" mt={1} spacing={0.5}>
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
            <Stack alignItems="start" mt={1} spacing={0.5}>
              <IconLink
                href={implementAndManageEServiceGuideLink}
                target="_blank"
                startIcon={<LaunchIcon fontSize="small" />}
              >
                {t('usefulLinks.implementAndManageEService')}
              </IconLink>
              <IconLink
                href={voucherVerificationGuideLink}
                target="_blank"
                startIcon={<LaunchIcon fontSize="small" />}
              >
                {t('usefulLinks.verifyVoucher')}
              </IconLink>
              <IconLink
                href={WELL_KNOWN_URLS[0]}
                target="_blank"
                startIcon={<LaunchIcon fontSize="small" />}
              >
                {t('usefulLinks.wellKnown')}
              </IconLink>
            </Stack>
          }
          direction="column"
        />
      </Stack>
    </Drawer>
  )
}
