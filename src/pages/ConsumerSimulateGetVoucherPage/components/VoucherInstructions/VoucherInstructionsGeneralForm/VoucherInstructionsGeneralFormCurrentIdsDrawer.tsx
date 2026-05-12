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
              label={t('purposeEserviceId.label')}
              labelDescription={t('purposeEserviceId.description')}
              copyToClipboard={{ value: purpose.eservice.id }}
              content={purpose.eservice.id}
            />

            <InformationContainer
              direction="column"
              label={t('descriptorId.label')}
              labelDescription={t('descriptorId.description')}
              copyToClipboard={{ value: purpose.eservice.descriptor.id }}
              content={purpose.eservice.descriptor.id}
            />

            <InformationContainer
              direction="column"
              label={t('agreementId.label')}
              labelDescription={t('agreementId.description')}
              copyToClipboard={{ value: purpose.agreement.id }}
              content={purpose.agreement.id}
            />

            <InformationContainer
              direction="column"
              label={t('purposeId.label')}
              labelDescription={t('purposeId.description')}
              copyToClipboard={{ value: purpose.id }}
              content={purpose.id}
            />
          </>
        )}
        {clientId && (
          <InformationContainer
            direction="column"
            label={t('clientId.label')}
            labelDescription={t('clientId.description')}
            copyToClipboard={{ value: clientId }}
            content={clientId}
          />
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
          <InformationContainer
            direction="column"
            label={t('producerKeychainId.label')}
            labelDescription={t('producerKeychainId.description')}
            copyToClipboard={{ value: producerKeychainId }}
            content={producerKeychainId}
          />
        )}
        {keychain?.producer?.id && (
          <InformationContainer
            direction="column"
            label={t('producerId.label')}
            labelDescription={t('producerId.description')}
            copyToClipboard={{ value: keychain.producer.id }}
            content={keychain.producer.id}
          />
        )}
        {eserviceId && !purposeId && (
          <InformationContainer
            direction="column"
            label={t('eserviceId.label')}
            labelDescription={t('eserviceId.description')}
            copyToClipboard={{ value: eserviceId }}
            content={eserviceId}
          />
        )}
      </Stack>
    </Drawer>
  )
}
