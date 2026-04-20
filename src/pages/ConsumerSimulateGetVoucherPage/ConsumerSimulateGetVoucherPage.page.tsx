import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { VoucherInstructions } from './components/VoucherInstructions'
import { useClientKind } from '@/hooks/useClientKind'
import { RequiredTextLabel } from '@/components/shared/RequiredTextLabel'

const ConsumerDebugVoucherPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'consumerSimulateGetVoucher' })
  const { t: tVoucher } = useTranslation('voucher')
  const clientKind = useClientKind()

  return (
    <PageContainer
      title={t('title', {
        voucherType: clientKind === 'API' ? tVoucher('pdnd') : tVoucher('eservice'),
      })}
      description={t('description')}
    >
      <RequiredTextLabel />
      <VoucherInstructions />
    </PageContainer>
  )
}

export default ConsumerDebugVoucherPage
