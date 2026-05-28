import type { Client, ClientPurpose, PublicKey } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { useClientKind } from '@/hooks/useClientKind'
import { useNavigate } from '@/router'
import { Alert, AlertTitle, Button } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'

type VoucherInstructionsGeneralFormAlertConsumerProps = {
  client: Client | undefined
  clientId: string | null
  isFetchingClient: boolean
  isFetchingKeys: boolean
  purposes: ClientPurpose[] | undefined
  clientKeys: PublicKey[] | undefined
}

type ConsumerAlertProps = {
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

  const noPurposes =
    clientKind === 'CONSUMER' && Boolean(clientId) && !isFetchingClient && !purposes?.length
  const noKeys = Boolean(clientId) && !isFetchingClient && !isFetchingKeys && !clientKeys?.length

  const alertProps: ConsumerAlertProps = React.useMemo(
    () =>
      match({ clientId, noPurposes, noKeys })
        .with({ clientId: P.nullish }, () => null)
        .with({ clientId: P.string, noPurposes: true, noKeys: true }, ({ clientId }) => ({
          title: t('noPurposesAndKeysLabel.title'),
          description: t('noPurposesAndKeysLabel.description'),
          action: {
            label: t('noPurposesAndKeysLabel.actionLabel'),
            onClick: () =>
              navigate('SUBSCRIBE_CLIENT_EDIT', {
                params: { clientId },
              }),
          },
        }))
        .with({ noPurposes: true }, () => ({
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
        }))
        .with({ clientId: P.string, noKeys: true }, ({ clientId }) => ({
          title: t('noKeysLabel.title'),
          description: t('noKeysLabel.description'),
          action: {
            label: t('noKeysLabel.actionLabel'),
            onClick: () =>
              navigate('SUBSCRIBE_CLIENT_EDIT', {
                params: { clientId },
              }),
          },
        }))
        .otherwise(() => null),
    [clientId, noPurposes, noKeys, t, navigate, isAdmin, client?.name]
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
