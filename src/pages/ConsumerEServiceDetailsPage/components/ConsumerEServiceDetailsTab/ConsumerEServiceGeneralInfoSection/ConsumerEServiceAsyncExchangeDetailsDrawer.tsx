import React from 'react'
import type { CatalogEServiceDescriptor, EServiceDoc } from '@/api/api.generatedTypes'
import { EServiceDownloads } from '@/api/eservice'
import { Drawer } from '@/components/shared/Drawer'
import { IconLink } from '@/components/shared/IconLink'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { formatThousands } from '@/utils/format.utils'

type ConsumerEServiceAsyncExchangeDetailsDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  descriptor: CatalogEServiceDescriptor
}

export const ConsumerEServiceAsyncExchangeDetailsDrawer: React.FC<
  ConsumerEServiceAsyncExchangeDetailsDrawerProps
> = ({ descriptor, isOpen, onClose }) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.asyncExchangeDetailsDrawer',
  })

  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()
  const asyncExchangeProperties = descriptor.asyncExchangeProperties

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
        {asyncExchangeProperties && (
          <>
            <InformationContainer
              label={t('responseTime')}
              content={`${formatThousands(asyncExchangeProperties.responseTime)} ${t('seconds')}`}
              direction="column"
            />
            <InformationContainer
              label={t('resourceAvailableTime')}
              content={`${formatThousands(asyncExchangeProperties.resourceAvailableTime)} ${t(
                'seconds'
              )}`}
              direction="column"
            />
            <InformationContainer
              label={t('confirmation')}
              content={t(`booleanValue.${asyncExchangeProperties.confirmation}`)}
              direction="column"
            />
            <InformationContainer
              label={t('bulk')}
              content={t(`booleanValue.${asyncExchangeProperties.bulk}`)}
              direction="column"
            />
            <InformationContainer
              label={t('maxResultSet')}
              content={formatThousands(asyncExchangeProperties.maxResultSet)}
              direction="column"
            />
          </>
        )}

        {descriptor.asyncExchangeCallbackInterface && (
          <InformationContainer
            label={t('callbackInterface')}
            content={
              <Stack spacing={1} mt={1} alignItems="start">
                <IconLink
                  component="button"
                  onClick={handleDownloadDocument.bind(
                    null,
                    descriptor.asyncExchangeCallbackInterface
                  )}
                  startIcon={<AttachFileIcon fontSize="small" />}
                >
                  {descriptor.asyncExchangeCallbackInterface.prettyName}
                </IconLink>
              </Stack>
            }
            direction="column"
          />
        )}

        {descriptor.asyncExchangeCallbackInterface?.checksum && (
          <InformationContainer
            label={t('callbackInterfaceChecksum')}
            content={descriptor.asyncExchangeCallbackInterface.checksum}
            copyToClipboard={{
              value: descriptor.asyncExchangeCallbackInterface.checksum,
            }}
          />
        )}
      </Stack>
    </Drawer>
  )
}
