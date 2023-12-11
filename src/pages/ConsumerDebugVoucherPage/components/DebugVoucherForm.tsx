import { SectionContainer } from '@/components/layout/containers'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { VoucherMutations } from '@/api/voucher'
import type { AccessTokenRequest, TokenGenerationValidationResult } from '@/api/api.generatedTypes'
import { AUTHORIZATION_SERVER_TOKEN_CREATION_URL } from '@/config/env'

export type DebugVoucherFormValues = {
  clientAssertion: string
  clientId: string
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
  const defaultValues: DebugVoucherFormValues = {
    clientAssertion: '',
    clientId: '',
  }

  const formMethods = useForm({
    defaultValues,
  })

  const onSubmit = (formValues: DebugVoucherFormValues) => {
    const payloadValidateVoucher: AccessTokenRequest = {
      client_id: formValues.clientId || undefined,
      client_assertion: formValues.clientAssertion,
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      grant_type: 'client_credentials',
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
        <SectionContainer newDesign title={t('title')}>
          <RHFTextField
            name="clientAssertion"
            focusOnMount
            multiline
            label={t('clientAssertionLabel')}
            rules={{ required: true }}
          />

          <RHFTextField name="clientId" label={t('clientIdLabel')} />
          <Typography variant="body2">
            <Trans
              components={{
                strong: <Typography component="span" variant="inherit" fontWeight={700} />,
              }}
            >
              {t('description', { authServer: AUTHORIZATION_SERVER_TOKEN_CREATION_URL })}
            </Trans>
          </Typography>
        </SectionContainer>

        <Box sx={{ display: 'flex', justifyContent: 'end', pt: 4 }}>
          <Button type="submit" variant="contained">
            {t('submitBtn')}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  )
}
