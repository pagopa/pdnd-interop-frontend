import { PageContainer } from '@/components/layout/containers'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { DebugVoucherForm } from './components/DebugVoucherForm'
import { DebugVoucherResults } from './components/DebugVoucherResults'
import { DebugVoucherContextProvider } from './components/DebugVoucherContext'
import type {
  TokenGenerationValidationRequest,
  TokenGenerationValidationResult,
} from './types/debug-voucher.types'

const ConsumerDebugVoucherPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerDebugVoucher' })

  const [debugVoucherValues, setDebugVoucherValues] = React.useState<{
    request: TokenGenerationValidationRequest
    response: TokenGenerationValidationResult
  }>()

  const onResetDebugVoucherValues = useCallback(() => {
    setDebugVoucherValues(undefined)
  }, [])

  return (
    <PageContainer title={t('title')} description={t('description')}>
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
    </PageContainer>
  )
}

export default ConsumerDebugVoucherPage
