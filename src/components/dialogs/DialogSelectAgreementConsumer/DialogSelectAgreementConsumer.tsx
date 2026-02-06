import type { DelegationTenant } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { useNavigate } from '@/router'
import { useDialog } from '@/stores'
import type { DialogSelectAgreementConsumerProps } from '@/types/dialog.types'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { DialogSelectAgreementConsumerAutocomplete } from './DialogSelectAgreementConsumerAutocomplete'
import { match, P } from 'ts-pattern'
import { useQuery } from '@tanstack/react-query'
import { DelegationQueries } from '@/api/delegation'
import { TenantQueries } from '@/api/tenant'

type SelectAgreementConsumerFormValues = {
  consumerId: string
}

export const DialogSelectAgreementConsumer: React.FC<DialogSelectAgreementConsumerProps> = ({
  action,
  eservice,
  descriptor,
  agreements,
  onSubmitCreate = () => {},
}) => {
  const ariaLabelId = React.useId()
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogSelectAgreementConsumer',
  })

  const navigate = useNavigate()
  const { closeDialog } = useDialog()
  const { jwt } = AuthHooks.useJwt()

  const preselectedConsumer: DelegationTenant | undefined = jwt
    ? {
        id: jwt?.organizationId,
        name: jwt?.organization.name,
      }
    : undefined

  const agreementsOptions = match(action)
    .with('inspect', () =>
      agreements.filter(
        (agreement) =>
          agreement.state === 'ACTIVE' ||
          agreement.state === 'SUSPENDED' ||
          agreement.state === 'PENDING'
      )
    )
    .with('edit', () => agreements.filter((agreement) => agreement.state === 'DRAFT'))
    .with('create', () =>
      agreements.filter(
        (agreement) => agreement.state !== 'ARCHIVED' && agreement.state !== 'REJECTED'
      )
    )
    .exhaustive()

  const hasPreselectedConsumer = match(action)
    .with(
      'create',
      () =>
        // If for this e-service there isn't agreement request
        // we can preselect it on <Select/> component
        !agreementsOptions.some((agreement) => agreement.consumerId === preselectedConsumer?.id)
    )
    .with(P.union('edit', 'inspect'), () =>
      // If for this e-service there is agreement request
      // we can preselect it on <Select/> component
      Boolean(
        agreementsOptions.find((agreement) => agreement.consumerId === preselectedConsumer?.id)
      )
    )
    .exhaustive()

  const formMethods = useForm<SelectAgreementConsumerFormValues>({
    defaultValues: {
      consumerId:
        preselectedConsumer && hasPreselectedConsumer ? preselectedConsumer.id : undefined,
    },
  })

  const selectedConsumerId = formMethods.watch('consumerId')

  const isQueryEnabled = Boolean(jwt?.organizationId && selectedConsumerId && action === 'create')

  const { data: delegations } = useQuery({
    ...DelegationQueries.getList({
      limit: 50,
      offset: 0,
      eserviceIds: [eservice.id],
      kind: 'DELEGATED_CONSUMER',
      states: ['ACTIVE'],
      delegateIds: jwt?.organizationId ? [jwt.organizationId] : undefined,
      delegatorIds: selectedConsumerId ? [selectedConsumerId] : undefined,
    }),
    enabled: isQueryEnabled,
    select: ({ results }) => results,
  })

  const { data: hasTenantCertifiedAttributes, isLoading } = useQuery({
    ...TenantQueries.getHasTenantCertifiedAttributes({
      eserviceId: eservice.id,
      descriptorId: descriptor.id,
      tenantId: selectedConsumerId,
    }),
    enabled: isQueryEnabled,
    select: ({ hasCertifiedAttributes }) => hasCertifiedAttributes,
  })

  const isOwnEService = eservice.producerId === selectedConsumerId
  const delegationId = delegations?.[0]?.id

  const onSubmitInspect = ({ consumerId }: SelectAgreementConsumerFormValues) => {
    const agreementId = agreements.find((agreement) => agreement.consumerId === consumerId)?.id

    if (agreementId) {
      navigate('SUBSCRIBE_AGREEMENT_READ', {
        params: {
          agreementId: agreementId,
        },
      })
    }

    closeDialog()
  }

  const onSubmitEdit = ({ consumerId }: SelectAgreementConsumerFormValues) => {
    const agreementId = agreements.find((agreement) => agreement.consumerId === consumerId)?.id

    if (agreementId) {
      navigate('SUBSCRIBE_AGREEMENT_EDIT', {
        params: {
          agreementId: agreementId,
        },
      })
    }

    closeDialog()
  }

  const onSubmit = match(action)
    .with('inspect', () => onSubmitInspect)
    .with('edit', () => onSubmitEdit)
    .with('create', () => () => onSubmitCreate({ isOwnEService, delegationId }))
    .exhaustive()

  const isButtonActionDisable = match(action)
    .with('create', () => !isLoading && !hasTenantCertifiedAttributes)
    .with(P.union('edit', 'inspect'), () => !selectedConsumerId)
    .exhaustive()

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} maxWidth="md" fullWidth>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <DialogTitle id={ariaLabelId}>{`TODO ${action}` /* t(`title.${action}`) */}</DialogTitle>

          <DialogContent>
            <Stack spacing={2}>
              <Typography>
                {action === 'create' ? (
                  <Trans
                    components={{
                      strong: <Typography component="span" variant="inherit" fontWeight={600} />,
                    }}
                  >
                    {`TODO ${action}`}
                    {/* {t(`description.${action}`, {
                      eserviceName: eservice.name,
                      eserviceVersion: descriptor.version,
                    })} */}
                  </Trans>
                ) : (
                  t(`description.${action}`)
                )}
              </Typography>
              <DialogSelectAgreementConsumerAutocomplete
                eserviceId={eservice.id}
                preselectedConsumer={hasPreselectedConsumer ? preselectedConsumer : undefined}
                agreements={agreementsOptions}
                action={action}
              />
              {!isLoading && !hasTenantCertifiedAttributes && action === 'create' && (
                <Alert
                  severity="warning"
                  title={`TODO ${action}` /* t('certifiedAttributesAlert.title') */}
                >
                  {`TODO ${action}` /* t('certifiedAttributesAlert.description') */}
                </Alert>
              )}
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button type="button" variant="outlined" onClick={closeDialog}>
              {tCommon('cancel')}
            </Button>
            <Button variant="contained" type="submit" disabled={isButtonActionDisable}>
              {`TODO ${action}` /* t(`actions.${action}`) */}
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  )
}
