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
      <Stack spacing={4}>
        {request.client_id && (
          <InformationContainer label={t('clientId.label')} content={request.client_id} />
        )}
        <InformationContainer
          label={t('clientAssertion.label')}
          content={request.client_assertion}
        />
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
