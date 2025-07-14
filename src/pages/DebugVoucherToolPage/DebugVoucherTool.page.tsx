import { PageContainer } from '@/components/layout/containers'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { DebugVoucherForm } from './components/DebugVoucherForm'
import { DebugVoucherResults } from './components/DebugVoucherResults'
import { DebugVoucherContextProvider } from './DebugVoucherContext'
import type { AccessTokenRequest, TokenGenerationValidationResult } from '@/api/api.generatedTypes'

const DebugVoucherToolPage: React.FC = () => {
  const { t } = useTranslation('developer-tools')

  const [debugVoucherValues, setDebugVoucherValues] = React.useState<{
    request: AccessTokenRequest
    response: TokenGenerationValidationResult
  }>()

  const onResetDebugVoucherValues = useCallback(() => {
    setDebugVoucherValues(undefined)
  }, [])

  return (
    <PageContainer
      title={t('debugVoucherTool.title')}
      description={t('debugVoucherTool.description')}
      backToAction={{
        to: 'DEVELOPER_TOOLS',
        label: t('backToDeveloperToolsLabel'),
      }}
    >
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

export default DebugVoucherToolPage
