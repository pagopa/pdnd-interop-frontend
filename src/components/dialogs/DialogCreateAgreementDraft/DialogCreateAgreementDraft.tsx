import { AuthHooks } from '@/api/auth'
import { useDialog } from '@/stores'
import type { DialogCreateAgreementDraftProps } from '@/types/dialog.types'
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
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { DelegationQueries } from '@/api/delegation'
import type { DelegationTenant } from '@/api/api.generatedTypes'
import { DialogCreateAgreementAutocomplete } from './DialogCreateAgreementDraftAutocomplete'
import { TenantQueries } from '@/api/tenant'

type CreateAgreementDraftFormValues = {
  consumerId: string
}

export const DialogCreateAgreementDraft: React.FC<DialogCreateAgreementDraftProps> = ({
  eservice,
  descriptor,
  agreements,
  onSubmit,
}) => {
  const ariaLabelId = React.useId()
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogCreateAgreementDraft',
  })
  const { closeDialog } = useDialog()
  const { jwt } = AuthHooks.useJwt()

  const formMethods = useForm<CreateAgreementDraftFormValues>({
    defaultValues: {
      consumerId: jwt?.organizationId ?? undefined,
    },
  })

  const selectedConsumerId = formMethods.watch('consumerId')

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
    enabled: Boolean(jwt?.organizationId && selectedConsumerId),
    select: ({ results }) => results,
  })

  const { data: hasTenantCertifiedAttributes } = useQuery({
    ...TenantQueries.getHasTenantCertifiedAttributes({
      eserviceId: eservice.id,
      descriptorId: descriptor.id,
      tenantId: selectedConsumerId,
    }),
    enabled: Boolean(jwt?.organizationId && selectedConsumerId),
    select: ({ hasCertifiedAttributes }) => hasCertifiedAttributes,
  })

  const isOwnEService = eservice.producerId === selectedConsumerId
  const delegationId = delegations?.[0]?.id

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} maxWidth="md" fullWidth>
      <FormProvider {...formMethods}>
        <Box
          component="form"
          noValidate
          onSubmit={formMethods.handleSubmit(() => onSubmit({ isOwnEService, delegationId }))}
        >
          <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

          <DialogContent>
            <Stack spacing={2}>
              <Typography>
                <Trans
                  components={{
                    strong: <Typography component="span" variant="inherit" fontWeight={600} />,
                  }}
                >
                  {t('description', {
                    eserviceName: eservice.name,
                    eserviceVersion: descriptor.version,
                  })}
                </Trans>
              </Typography>
              <DialogCreateAgreementAutocomplete
                eserviceId={eservice.id}
                preselectedConsumer={
                  jwt
                    ? ({
                        id: jwt?.organizationId,
                        name: jwt?.organization.name,
                      } as DelegationTenant)
                    : undefined
                }
                agreements={agreements}
              />
              {!hasTenantCertifiedAttributes && (
                <Alert severity="warning" title={t('certifiedAttributesAlert.title')}>
                  {t('certifiedAttributesAlert.description')}
                </Alert>
              )}
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button type="button" variant="outlined" onClick={closeDialog}>
              {tCommon('cancel')}
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={hasTenantCertifiedAttributes === false}
            >
              {tCommon('createNewDraft')}
            </Button>
          </DialogActions>
        </Box>
      </FormProvider>
    </Dialog>
  )
}
