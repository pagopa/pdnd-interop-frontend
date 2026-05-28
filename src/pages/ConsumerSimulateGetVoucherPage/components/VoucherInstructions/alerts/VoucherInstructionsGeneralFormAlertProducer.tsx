import type { CompactEService, ProducerKeychain, PublicKey } from '@/api/api.generatedTypes'
import { useNavigate } from '@/router'
import { Alert, AlertTitle, Button } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'

type VoucherInstructionsGeneralFormAlertProducerProps = {
  producerKeychain: ProducerKeychain | undefined
  producerKeychainId: string | null
  isFetchingPublicKey: boolean
  isFetchingEservices: boolean
  eservices: CompactEService[] | undefined
  publicKeys: PublicKey[] | undefined
}

type ProducerAlertProps = {
  title: string
  description: string
  action?: {
    label: React.ReactNode
    onClick: () => void
  }
} | null

export const VoucherInstructionsGeneralFormAlertProducer: React.FC<
  VoucherInstructionsGeneralFormAlertProducerProps
> = ({
  producerKeychain,
  producerKeychainId,
  isFetchingPublicKey,
  isFetchingEservices,
  eservices,
  publicKeys,
}) => {
  const { t } = useTranslation('voucher')
  const navigate = useNavigate()

  const noEServices = Boolean(producerKeychainId) && !isFetchingEservices && !eservices?.length
  const noPublicKeys =
    Boolean(producerKeychainId) &&
    !isFetchingEservices &&
    !isFetchingPublicKey &&
    !publicKeys?.length

  const alertProps: ProducerAlertProps = React.useMemo(
    () =>
      match({
        producerKeychainId,
        noEServices,
        noPublicKeys,
      })
        .with({ producerKeychainId: P.nullish }, () => null)
        .with(
          {
            producerKeychainId: P.string,
            noEServices: true,
            noPublicKeys: true,
          },
          ({ producerKeychainId }) => ({
            title: t('noEServicesAndPublicKeysLabel.title'),
            description: t('noEServicesAndPublicKeysLabel.description'),
            action: {
              label: t('noEServicesAndPublicKeysLabel.actionLabel'),
              onClick: () =>
                navigate('PROVIDE_KEYCHAIN_DETAILS', {
                  params: { keychainId: producerKeychainId },
                }),
            },
          })
        )
        .with(
          {
            noEServices: true,
          },
          () => ({
            title: t('noEServicesLabel.title'),
            description: t('noEServicesLabel.description', {
              keychainName: producerKeychain?.name ?? '',
            }),
            action: {
              label: t('noEServicesLabel.actionLabel'),
              onClick: () => navigate('PROVIDE_ESERVICE_LIST'),
            },
          })
        )
        .with(
          {
            noPublicKeys: true,
          },
          ({ producerKeychainId }) => ({
            title: t('noPublicKeysLabel.title'),
            description: t('noPublicKeysLabel.description'),
            action: {
              label: t('noPublicKeysLabel.actionLabel'),
              onClick: () =>
                navigate('PROVIDE_KEYCHAIN_DETAILS', {
                  params: { keychainId: producerKeychainId! },
                }),
            },
          })
        )
        .otherwise(() => null),
    [producerKeychainId, noEServices, noPublicKeys, producerKeychain?.name, navigate, t]
  )

  if (!alertProps) return null

  return (
    <Alert
      sx={{ mt: 2 }}
      severity="warning"
      variant="outlined"
      action={
        alertProps.action ? (
          <Button sx={{ whiteSpace: 'nowrap' }} color="primary" onClick={alertProps.action.onClick}>
            {alertProps.action.label}
          </Button>
        ) : undefined
      }
    >
      <AlertTitle>{alertProps.title}</AlertTitle>
      {alertProps.description}
    </Alert>
  )
}
