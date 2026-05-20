import React from 'react'
import type { CatalogEServiceDescriptor, EServiceDoc } from '@/api/api.generatedTypes'
import { EServiceDownloads } from '@/api/eservice'
import { Drawer } from '@/components/shared/Drawer'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { formatThousands } from '@/utils/format.utils'
import { ConsumerEServiceAsyncExchangeCallbackInterfaceInfo } from './ConsumerEServiceAsyncExchangeCallbackInterfaceInfo'

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

        <ConsumerEServiceAsyncExchangeCallbackInterfaceInfo
          callbackInterface={descriptor.asyncExchangeCallbackInterface}
          callbackInterfaceLabel={t('callbackInterface')}
          callbackInterfaceChecksumLabel={t('callbackInterfaceChecksum')}
          onDownloadDocument={handleDownloadDocument}
        />
      </Stack>
    </Drawer>
  )
}
