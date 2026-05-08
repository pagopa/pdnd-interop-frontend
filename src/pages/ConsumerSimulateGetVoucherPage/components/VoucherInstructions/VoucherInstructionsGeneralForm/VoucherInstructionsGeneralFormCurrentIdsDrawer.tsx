import { Drawer } from '@/components/shared/Drawer'
import React from 'react'
import { PurposeQueries } from '@/api/purpose'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { Trans, useTranslation } from 'react-i18next'
import { Link, Stack } from '@mui/material'
import { apiGuideLink } from '@/config/constants'
import { useQuery } from '@tanstack/react-query'
import { KeychainQueries } from '@/api/keychain'

type VoucherInstructionsGeneralFormCurrentIdsDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  clientId: string
  purposeId: string
  eserviceId: string
  producerKeychainId: string
}

export const VoucherInstructionsGeneralFormCurrentIdsDrawer: React.FC<
  VoucherInstructionsGeneralFormCurrentIdsDrawerProps
> = ({ isOpen, onClose, clientId, purposeId, eserviceId, producerKeychainId }) => {
  const { t } = useTranslation('voucher', { keyPrefix: 'generalForm.currentIdsDrawer' })

  const { data: purpose } = useQuery({
    ...PurposeQueries.getSingle(purposeId || ''),
    enabled: Boolean(purposeId),
  })

  const { data: keychain } = useQuery({
    ...KeychainQueries.getSingle(producerKeychainId),
    enabled: Boolean(producerKeychainId),
  })

  return (
    <Drawer
      title={t('title')}
      subtitle={
        <Trans components={{ 1: <Link href={apiGuideLink} target="_blank" /> }}>
          {t('subtitle')}
        </Trans>
      }
      isOpen={isOpen}
      onClose={onClose}
    >
      <Stack sx={{ mt: 2, mb: 8 }} spacing={2}>
        {purpose && (
          <>
            <InformationContainer
              direction="column"
              label="eserviceId"
              labelDescription={t('eserviceIdDescription')}
              copyToClipboard={{ value: purpose.eservice.id }}
              content={purpose.eservice.id}
            />

            <InformationContainer
              direction="column"
              label="descriptorId"
              labelDescription={t('descriptorIdDescription')}
              copyToClipboard={{ value: purpose.eservice.descriptor.id }}
              content={purpose.eservice.descriptor.id}
            />

            <InformationContainer
              direction="column"
              label="agreementId"
              labelDescription={t('agreementIdDescription')}
              copyToClipboard={{ value: purpose.agreement.id }}
              content={purpose.agreement.id}
            />

            <InformationContainer
              direction="column"
              label="purposeId"
              labelDescription={t('purposeIdDescription')}
              copyToClipboard={{ value: purpose.id }}
              content={purpose.id}
            />
          </>
        )}
        {clientId && (
          <>
            <InformationContainer
              direction="column"
              label="clientId"
              labelDescription={t('clientIdDescription')}
              copyToClipboard={{ value: clientId }}
              content={clientId}
            />
          </>
        )}

        {purpose && (
          <>
            <InformationContainer
              direction="column"
              label={t('producerOrganizationId.label')}
              labelDescription={t('producerOrganizationId.description')}
              copyToClipboard={{ value: purpose.eservice.producer.id }}
              content={purpose.eservice.producer.id}
            />

            <InformationContainer
              direction="column"
              label={t('consumerOrganizationId.label')}
              labelDescription={t('consumerOrganizationId.description')}
              copyToClipboard={{ value: purpose.consumer.id }}
              content={purpose.consumer.id}
            />
          </>
        )}
        {producerKeychainId && (
          <>
            <InformationContainer
              direction="column"
              label="producerKeychainId"
              labelDescription={t('producerKeychainId')}
              copyToClipboard={{ value: producerKeychainId }}
              content={producerKeychainId}
            />
          </>
        )}
        {keychain && (
          <>
            <InformationContainer
              direction="column"
              label={'producerId'}
              labelDescription={t('producerId')}
              copyToClipboard={{ value: keychain.producer.id }}
              content={keychain.producer.id}
            />
          </>
        )}
        {eserviceId && !purposeId && (
          <>
            <InformationContainer
              direction="column"
              label="eserviceId"
              labelDescription={t('eserviceId')}
              copyToClipboard={{ value: eserviceId }}
              content={eserviceId}
            />
          </>
        )}
      </Stack>
    </Drawer>
  )
}
