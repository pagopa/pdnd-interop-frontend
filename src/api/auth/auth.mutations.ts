import { useTranslation } from 'react-i18next'
import { AuthServices } from './auth.services'
import { useMutation } from '@tanstack/react-query'

function useSwapSAMLTokens() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'auth' })
  return useMutation({
    mutationFn: AuthServices.swapSAMLToken,
    meta: {
      loadingLabel: t('loadingLabel'),
    },
  })
}

export const AuthMutations = {
  useSwapSAMLTokens,
}
