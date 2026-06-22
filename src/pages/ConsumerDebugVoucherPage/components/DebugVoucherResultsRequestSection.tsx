import { SectionContainer } from '@/components/layout/containers'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { Stack } from '@mui/material'
import { useDebugVoucherContext } from '../DebugVoucherContext'
import { useTranslation } from 'react-i18next'

export const DebugVoucherResultsRequestSection: React.FC = () => {
  const { t } = useTranslation('voucher', {
    keyPrefix: 'consumerDebugVoucher.result.requestSection',
  })
  const { request } = useDebugVoucherContext()

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack spacing={4} mt={4}>
        <InformationContainer
          label={t('voucherType.label')}
          content={request.dpop_proof ? t('dpop') : t('bearer')}
        />
        {request.client_id && (
          <InformationContainer label={t('clientId.label')} content={request.client_id} />
        )}
        <InformationContainer
          label={t('clientAssertion.label')}
          content={request.client_assertion}
        />
        {request.dpop_proof && (
          <InformationContainer label={t('dpopProof.label')} content={request.dpop_proof} />
        )}
        <InformationContainer
          label={t('clientAssertionType.label')}
          labelDescription={t('clientAssertionType.description')}
          content={request.client_assertion_type}
        />
        <InformationContainer
          label={t('grantType.label')}
          labelDescription={t('grantType.description')}
          content={request.grant_type}
        />
      </Stack>
    </SectionContainer>
  )
}
