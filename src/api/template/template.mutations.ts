import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { TemplateServices } from './template.services'

function useUpdateEServiceTemplateName() {
  const { t } = useTranslation('mutations-feedback', {
    keyPrefix: 'eservice.updateEServiceName',
  })
  return useMutation({
    mutationFn: TemplateServices.updateEServiceTemplateName,
    meta: {
      successToastLabel: t('outcome.success'),
      errorToastLabel: t('outcome.error'),
      loadingLabel: t('loading'),
    },
  })
}

export const TemplateMutations = {
  useUpdateEServiceTemplateName,
}
