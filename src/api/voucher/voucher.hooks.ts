import { useTranslation } from 'react-i18next'
import { useMutationWrapper } from '../react-query-wrappers'
import VoucherServices from './voucher.services'

function useValidateTokenGeneration() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'voucher.tokenVerification' })
  return useMutationWrapper(VoucherServices.validateTokenGeneration, {
    suppressSuccessToast: true,
    errorToastLabel: t('outcome.error'),
    loadingLabel: t('loading'),
  })
}

export const VoucherMutations = {
  useValidateTokenGeneration,
}
