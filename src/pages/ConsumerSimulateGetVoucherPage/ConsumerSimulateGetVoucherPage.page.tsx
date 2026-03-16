import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { VoucherInstructions } from './components/VoucherInstructions'

const ConsumerDebugVoucherPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerSimulateGetVoucher' })

  return (
    <PageContainer title={t('title')} description={t('description')}>
      <VoucherInstructions />
    </PageContainer>
  )
}

export default ConsumerDebugVoucherPage
