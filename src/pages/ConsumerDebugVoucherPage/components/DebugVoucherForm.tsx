import { SectionContainer } from '@/components/layout/containers'
import { RHFRadioGroup, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { VoucherMutations } from '@/api/voucher'
import type { AccessTokenRequest, TokenGenerationValidationResult } from '@/api/api.generatedTypes'
import {
  AUTHORIZATION_SERVER_TOKEN_CREATION_URL,
  FEATURE_FLAG_DPOP_CLIENT_ASSERTION_DEBUGGER,
} from '@/config/env'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { useNavigate } from '@/router'

export type DebugVoucherFormValues = {
  clientAssertion: string
  clientId: string
  dpopProof: string
  interactionType: string
}

export type DebugVoucherFormProps = {
  setDebugVoucherValues: React.Dispatch<
    React.SetStateAction<
      { request: AccessTokenRequest; response: TokenGenerationValidationResult } | undefined
    >
  >
}

export const DebugVoucherForm: React.FC<DebugVoucherFormProps> = ({ setDebugVoucherValues }) => {
  const { t } = useTranslation('voucher', { keyPrefix: 'consumerDebugVoucher.edit' })
  const { mutate: validateVoucher } = VoucherMutations.useValidateTokenGeneration()
  const navigate = useNavigate()

  const defaultValues: DebugVoucherFormValues = {
    clientAssertion: '',
    clientId: '',
    dpopProof: '',
    interactionType: 'sync',
  }

  const interactionTypeOptions: Array<{ label: string; value: string }> = [
    { label: t('interactionModelSync'), value: 'sync' },
    { label: t('interactionModelAsync'), value: 'async' },
  ]

  const formMethods = useForm({
    defaultValues,
  })

  const onSubmit = (formValues: DebugVoucherFormValues) => {
    const payloadValidateVoucher: AccessTokenRequest = {
      client_id: formValues.clientId || undefined,
      client_assertion: formValues.clientAssertion,
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      grant_type: 'client_credentials',
      dpop_proof: formValues.dpopProof || undefined,
      // interactionType: formValues.interactionType, This value will be disabled for this release: https://www.figma.com/design/CpRV3kPvFEWLXGtJUgWeZW?node-id=4078-14921#1712917799
    }

    validateVoucher(payloadValidateVoucher, {
      onSuccess(data) {
        setDebugVoucherValues({ request: payloadValidateVoucher, response: data })
      },
    })
  }

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer title={t('title')} description={t('description')}>
          <Stack spacing={3}>
            <RHFTextField
              name="clientAssertion"
              focusOnMount
              multiline
              required
              label={t('clientAssertionLabel')}
              rules={{ required: true }}
              size="medium"
              infoLabel={t('clientAssertionInfoLabel')}
            />

            {FEATURE_FLAG_DPOP_CLIENT_ASSERTION_DEBUGGER && (
              <RHFTextField
                name="dpopProof"
                multiline
                size="medium"
                label={t('dpopProofLabel')}
                infoLabel={t('dpopProofInfoLabel')}
              />
            )}

            <RHFTextField
              sx={{ mt: 1 }}
              name="clientId"
              label={t('clientIdLabel')}
              infoLabel={t('clientIdInfoLabel')}
            />

            {/* The input will be disabled for this release: https://www.figma.com/design/CpRV3kPvFEWLXGtJUgWeZW?node-id=4078-14921#1712917799 */}
            <RHFRadioGroup
              disabled
              name="interactionType"
              label={t('interactionModelLabel')}
              rules={{ required: true }}
              required
              options={interactionTypeOptions}
            />
            {/* --- */}

            <Alert color="info" icon={<InfoOutlined />}>
              <Trans
                components={{
                  strong: <Typography component="span" variant="inherit" fontWeight={700} />,
                }}
              >
                {t('alert', { authServer: AUTHORIZATION_SERVER_TOKEN_CREATION_URL })}
              </Trans>
            </Alert>
          </Stack>
        </SectionContainer>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 3 }}>
          <Button
            onClick={() => navigate('DEVELOPER_TOOLS')}
            type="button"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
          >
            {t('goBackBtn')}
          </Button>
          <Button type="submit" variant="contained">
            {t('submitBtn')}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  )
}
