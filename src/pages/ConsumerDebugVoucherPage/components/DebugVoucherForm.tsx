import { SectionContainer } from '@/components/layout/containers'
import { RHFRadioGroup, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { VoucherMutations } from '@/api/voucher'
import type { AccessTokenRequest, TokenGenerationValidationResult } from '@/api/api.generatedTypes'
import { AUTHORIZATION_SERVER_TOKEN_CREATION_URL } from '@/config/env'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { useNavigate } from '@/router'

export type DebugVoucherFormValues = {
  clientAssertion: string
  dPopProof: string
  clientId: string
  interactionType: string // mocked form field
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
  const navigate = useNavigate()

  const { mutateAsync: validateVoucherAsync } = VoucherMutations.useValidateTokenGeneration()
  const { mutateAsync: validateDPoPProofAsync } = VoucherMutations.useValidateDPoPProof() // mocked mutation

  const defaultValues: DebugVoucherFormValues = {
    clientAssertion: '',
    dPopProof: '',
    clientId: '',
    interactionType: 'sync', // mocked interaction type default value
  }

  // mocked interaction type options
  const interactionTypeOptions: Array<{ label: string; value: string }> = [
    { label: t('interactionModelSync'), value: 'sync' },
    { label: t('interactionModelAsync'), value: 'async' },
  ]

  const formMethods = useForm({
    defaultValues,
  })

  const onSubmit = async (formValues: DebugVoucherFormValues) => {
    const payloadValidateVoucher: AccessTokenRequest = {
      client_id: formValues.clientId || undefined,
      client_assertion: formValues.clientAssertion,
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      grant_type: 'client_credentials',
    }

    if (!formValues.dPopProof) {
      const response = await validateVoucherAsync(payloadValidateVoucher)

      setDebugVoucherValues({
        request: payloadValidateVoucher,
        response,
      })

      return
    }

    const [tokenResponse, dpopResponse] = await Promise.all([
      validateVoucherAsync(payloadValidateVoucher),
      validateDPoPProofAsync(payloadValidateVoucher), // mocked DPoP proof validation payload
    ])

    setDebugVoucherValues({
      request: payloadValidateVoucher,
      response: {
        steps: {
          ...tokenResponse.steps,
          ...dpopResponse.steps,
        },
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

            <RHFTextField
              name="dPopProof"
              multiline
              size="medium"
              label={t('dPopProofLabel')}
              infoLabel={t('dPopProofInfoLabel')}
            />

            <RHFTextField
              sx={{ mt: 1 }}
              name="clientId"
              label={t('clientIdLabel')}
              infoLabel={t('clientIdInfoLabel')}
            />

            {/* --- Probably not needed, waiting for an update on the Figma */}
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
