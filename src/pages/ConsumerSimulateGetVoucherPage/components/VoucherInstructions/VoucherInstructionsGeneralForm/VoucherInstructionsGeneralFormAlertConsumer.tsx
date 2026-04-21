import type { Client, ClientPurpose, PublicKey } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { useClientKind } from '@/hooks/useClientKind'
import { useNavigate } from '@/router'
import { Alert, AlertTitle, Button } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

type VoucherInstructionsGeneralFormAlertConsumerProps = {
  client: Client | undefined
  clientId: string | null
  isFetchingClient: boolean
  isFetchingKeys: boolean
  purposes: ClientPurpose[] | undefined
  clientKeys: PublicKey[] | undefined
}

type ConsumerAlertModel = {
  title: string
  description: string
  action?: {
    label: React.ReactNode
    onClick: () => void
  }
} | null

export const VoucherInstructionsGeneralFormAlertConsumer: React.FC<
  VoucherInstructionsGeneralFormAlertConsumerProps
> = ({ client, clientId, isFetchingClient, isFetchingKeys, purposes, clientKeys }) => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()
  const navigate = useNavigate()
  const { isAdmin } = AuthHooks.useJwt()

  const noPurposes = clientKind === 'CONSUMER' && clientId && !isFetchingClient && !purposes?.length

  const noKeys = clientId && !isFetchingClient && !isFetchingKeys && !clientKeys?.length

  const alertModel: ConsumerAlertModel = React.useMemo(() => {
    if (!clientId) return null

    if (!noPurposes && !noKeys) return null

    if (noPurposes && noKeys) {
      return {
        title: t('noPurposesAndKeysLabel.title'),
        description: t('noPurposesAndKeysLabel.description'),
        action: {
          label: t('noPurposesAndKeysLabel.actionLabel'),
          onClick: () => navigate('SUBSCRIBE_CLIENT_EDIT', { params: { clientId } }),
        },
      }
    }

    if (noPurposes) {
      return {
        title: isAdmin ? t('noPurposesLabelAdmin.title') : t('noPurposesLabelSecurity.title'),
        description: t(
          isAdmin ? 'noPurposesLabelAdmin.description' : 'noPurposesLabelSecurity.description',
          {
            clientName: client?.name ?? '',
          }
        ),
        action: isAdmin
          ? {
              label: t('noPurposesLabelAdmin.actionLabel'),
              onClick: () => navigate('SUBSCRIBE_PURPOSE_LIST'),
            }
          : undefined,
      }
    }

    if (noKeys) {
      return {
        title: t('noKeysLabel.title'),
        description: t('noKeysLabel.description'),
        action: {
          label: t('noKeysLabel.actionLabel'),
          onClick: () => navigate('SUBSCRIBE_CLIENT_EDIT', { params: { clientId } }),
        },
      }
    }

    return null
  }, [clientId, noPurposes, noKeys, t, navigate, isAdmin, client?.name])

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
