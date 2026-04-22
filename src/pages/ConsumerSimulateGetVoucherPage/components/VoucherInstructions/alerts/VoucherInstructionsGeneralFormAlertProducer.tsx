import type { CompactEService, ProducerKeychain, PublicKey } from '@/api/api.generatedTypes'
import { useNavigate } from '@/router'
import { Alert, AlertTitle, Button } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

type VoucherInstructionsGeneralFormAlertProducerProps = {
  producerKeychain: ProducerKeychain | undefined
  producerKeychainId: string | null
  isFetchingPublicKey: boolean
  isFetchingEservices: boolean
  eservices: CompactEService[] | undefined
  publicKeys: PublicKey[] | undefined
}

type ProducerAlertModel = {
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

  const noEServices = producerKeychainId && !isFetchingEservices && !eservices?.length

  const noPublicKeys =
    producerKeychainId && !isFetchingEservices && !isFetchingPublicKey && !publicKeys?.length

  const alertModel: ProducerAlertModel = React.useMemo(() => {
    if (!producerKeychainId) return null

    if (!noEServices && !noPublicKeys) return null

    if (noEServices && noPublicKeys) {
      return {
        title: t('noEServicesAndPublicKeysLabel.title'),
        description: t('noEServicesAndPublicKeysLabel.description'),
        action: {
          label: t('noEServicesAndPublicKeysLabel.actionLabel'),
          onClick: () =>
            navigate('PROVIDE_KEYCHAIN_DETAILS', { params: { keychainId: producerKeychainId } }),
        },
      }
    }

    if (noEServices) {
      return {
        title: t('noEServicesLabel.title'),
        description: t('noEServicesLabel.description', {
          keychainName: producerKeychain?.name ?? '',
        }),
        action: {
          label: t('noEServicesLabel.actionLabel'),
          onClick: () => navigate('PROVIDE_ESERVICE_LIST'),
        },
      }
    }

    if (noPublicKeys) {
      return {
        title: t('noPublicKeysLabel.title'),
        description: t('noPublicKeysLabel.description'),
        action: {
          label: t('noPublicKeysLabel.actionLabel'),
          onClick: () =>
            navigate('PROVIDE_KEYCHAIN_DETAILS', { params: { keychainId: producerKeychainId } }),
        },
      }
    }

    return null
  }, [navigate, noEServices, noPublicKeys, producerKeychain?.name, producerKeychainId, t])

  if (!alertModel) return null

  return (
    <Alert
      sx={{ mt: 2 }}
      severity="warning"
      variant="outlined"
      action={
        alertModel.action ? (
          <Button sx={{ whiteSpace: 'nowrap' }} color="primary" onClick={alertModel.action.onClick}>
            {alertModel.action.label}
          </Button>
        ) : undefined
      }
    >
      <AlertTitle>{alertModel.title}</AlertTitle>
      {alertModel.description}
    </Alert>
  )
}
