import { SectionContainer } from '@/components/layout/containers'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import type {
  TokenGenerationValidationRequest,
  TokenGenerationValidationResult,
} from '../types/debug-voucher.types'
import { VoucherMutations } from '@/api/voucher'

const mockResApi: TokenGenerationValidationResult = {
  clientKind: 'API',
  steps: {
    clientAssertionValidation: {
      result: 'PASSED',
      failures: [],
    },
    publicKeyRetrieve: {
      result: 'FAILED',
      failures: [
        {
          code: '8001',
          reason: 'I have to test a failure',
        },
      ],
    },
    clientAssertionSignatureVerification: {
      result: 'SKIPPED',
      failures: [],
    },
    platformStatesVerification: {
      result: 'SKIPPED',
      failures: [],
    },
  },
}

const mockResConsumer: TokenGenerationValidationResult = {
  clientKind: 'CONSUMER',
  steps: {
    clientAssertionValidation: {
      result: 'PASSED',
      failures: [],
    },
    publicKeyRetrieve: {
      result: 'PASSED',
      failures: [],
    },
    clientAssertionSignatureVerification: {
      result: 'PASSED',
      failures: [],
    },
    platformStatesVerification: {
      result: 'PASSED',
      failures: [],
    },
  },
  eservice: {
    id: 'id test',
    descriptorId: 'descriptor id test',
    version: 'version test',
    name: 'name test',
  },
}

const mockResApiPassed: TokenGenerationValidationResult = {
  clientKind: 'API',
  steps: {
    clientAssertionValidation: {
      result: 'PASSED',
      failures: [],
    },
    publicKeyRetrieve: {
      result: 'PASSED',
      failures: [],
    },
    clientAssertionSignatureVerification: {
      result: 'PASSED',
      failures: [],
    },
    platformStatesVerification: {
      result: 'SKIPPED',
      failures: [],
    },
  },
}

export type DebugVoucherFormValues = {
  clientAssertion: string
  clientId: string
}

export type DebugVoucherFormProps = {
  setDebugVoucherValues: React.Dispatch<
    React.SetStateAction<
      | { request: TokenGenerationValidationRequest; response: TokenGenerationValidationResult }
      | undefined
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
    const payloadValidateVoucher: TokenGenerationValidationRequest = {
      client_id: formValues.clientId,
      client_assertion: formValues.clientAssertion,
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      grant_type: 'client_credentials',
    }

    validateVoucher(payloadValidateVoucher, {
      onSuccess(data) {
        setDebugVoucherValues({ request: payloadValidateVoucher, response: data })
      },
    })

    // TODO: commenti per test mock... eliminare questi commenti
    // const res: TokenGenerationValidationResult = mockResApi
    // setDebugVoucherValues({ request: payloadValidateVoucher, response: res })
  }

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer>
          <Typography variant="overline">{t('title')}</Typography>

          <RHFTextField
            name="clientAssertion"
            focusOnMount
            multiline
            label={t('clientAssertionLabel')}
            inputProps={{ maxLength: 250 }}
            rules={{ required: true, minLength: 5 }}
          />

          <RHFTextField
            name="clientId"
            label={t('clientIdLabel')}
            inputProps={{ maxLength: 60 }}
            rules={{ required: true, minLength: 10 }}
          />
          <Typography variant="body2">
            <Trans
              components={{
                strong: <Typography component="span" variant="inherit" fontWeight={700} />,
              }}
            >
              {t('description')}
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
