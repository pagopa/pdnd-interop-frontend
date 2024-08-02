import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { TenantServices } from './tenant.services'

function useUpdateMail() {
  const { t } = useTranslation('mutations-feedback', { keyPrefix: 'party.updateMail' })
  return useMutation({
    mutationFn: TenantServices.updateMail,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

export const TenantMutations = {
  useUpdateMail,
}
