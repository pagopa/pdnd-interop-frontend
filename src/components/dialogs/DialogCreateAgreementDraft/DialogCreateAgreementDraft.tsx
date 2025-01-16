import { AgreementMutations, AgreementQueries } from '@/api/agreement'
import { AuthHooks } from '@/api/auth'
import { useNavigate } from '@/router'
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

type CreateAgreementDraftFormValues = {
  consumerId: string
}

export const DialogCreateAgreementDraft: React.FC<DialogCreateAgreementDraftProps> = ({
  eservice,
  descriptor,
}) => {
  const ariaLabelId = React.useId()
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'dialogCreateAgreementDraft',
  })
  const navigate = useNavigate()
  const { closeDialog } = useDialog()
  const { jwt } = AuthHooks.useJwt()

  const { mutate: createAgreementDraft } = AgreementMutations.useCreateDraft()
  const { mutate: submitToOwnEService } = AgreementMutations.useSubmitToOwnEService()

  const formMethods = useForm<CreateAgreementDraftFormValues>({
    defaultValues: {
      consumerId: jwt?.organizationId ?? undefined,
    },
  })

  const selectedConsumerId = formMethods.watch('consumerId')

  const { data: delegations } = useQuery({
    ...DelegationQueries.getDelegationsList({
      limit: 50,
      offset: 0,
      eserviceIds: [eservice.id],
      kind: 'DELEGATED_CONSUMER',
      delegateIds: jwt?.organizationId ? [jwt.organizationId] : undefined,
      delegatorIds: selectedConsumerId ? [selectedConsumerId] : undefined,
    }),
    enabled: Boolean(jwt?.organizationId && selectedConsumerId),
    select: ({ results }) => results,
  })

  const { data: hasTenantCertifiedAttributes } = useQuery({
    ...AgreementQueries.getHasTenantCertifiedAttributes({
      eserviceId: eservice.id,
      descriptorId: descriptor.id,
      tenantId: selectedConsumerId,
    }),
    enabled: Boolean(jwt?.organizationId && selectedConsumerId),
    select: ({ hasCertifiedAttributes }) => hasCertifiedAttributes,
  })

  const onSubmit = ({ consumerId }: CreateAgreementDraftFormValues) => {
    /**
     * If the subscriber is the owner of the e-service
     * create and submit the agreement without passing through the draft
     * */
    if (eservice.producerId === consumerId) {
      submitToOwnEService(
        {
          eserviceId: eservice.id,
          descriptorId: descriptor.id,
        },
        {
          onSuccess({ id }) {
            navigate('SUBSCRIBE_AGREEMENT_READ', { params: { agreementId: id } })
            closeDialog()
          },
        }
      )
      return
    }
    /**
     * If the subscriber is not the owner of the e-service
     * create the agreement draft
     * */
    createAgreementDraft(
      {
        eserviceName: eservice.name,
        eserviceId: eservice.id,
        eserviceVersion: descriptor.version,
        descriptorId: descriptor.id,
        delegationId: delegations?.[0]?.id,
      },
      {
        onSuccess({ id }) {
          navigate('SUBSCRIBE_AGREEMENT_EDIT', { params: { agreementId: id } })
          closeDialog()
        },
      }
    )
  }

  return (
    <Dialog aria-labelledby={ariaLabelId} open onClose={closeDialog} maxWidth="md" fullWidth>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <DialogTitle id={ariaLabelId}>{t('title')}</DialogTitle>

          <DialogContent>
            <Stack spacing={2}>
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
