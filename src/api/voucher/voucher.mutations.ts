import { useTranslation } from 'react-i18next'
import { VoucherServices } from './voucher.services'
import { useMutation } from '@tanstack/react-query'

function useValidateTokenGeneration() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'voucher.tokenVerification' })
  return useMutation({
    mutationFn: VoucherServices.validateTokenGeneration,
    retry: false,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

function useValidateDPoPProof() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'voucher.dPoPProofVerification' })
  return useMutation({
    mutationFn: VoucherServices.validateDPoPProof,
    retry: false,
    meta: {
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

export const VoucherMutations = {
  useValidateTokenGeneration,
  useValidateDPoPProof,
}
