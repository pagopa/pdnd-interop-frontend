import { PageContainer } from '@/components/layout/containers'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { DebugVoucherForm } from './components/DebugVoucherForm'
import { DebugVoucherResults } from './components/DebugVoucherResults'
import { DebugVoucherContextProvider } from './DebugVoucherContext'
import type { AccessTokenRequest, TokenGenerationValidationResult } from '@/api/api.generatedTypes'
import { Grid } from '@mui/material'

const ConsumerDebugVoucherPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerDebugVoucher' })

  const [debugVoucherValues, setDebugVoucherValues] = React.useState<{
    request: AccessTokenRequest
    response: TokenGenerationValidationResult
  }>()

  const onResetDebugVoucherValues = useCallback(() => {
    setDebugVoucherValues(undefined)
  }, [])

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <Grid container>
        <Grid item xs={8}>
          {!debugVoucherValues ? (
            <DebugVoucherForm setDebugVoucherValues={setDebugVoucherValues} />
          ) : (
            <DebugVoucherContextProvider
              request={debugVoucherValues.request}
              response={debugVoucherValues.response}
              onResetDebugVoucherValues={onResetDebugVoucherValues}
            >
              <DebugVoucherResults />
            </DebugVoucherContextProvider>
          )}
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default ConsumerDebugVoucherPage
