import { useMutation } from '@tanstack/react-query'
import { OneTrustNoticesServices } from './one-trust-notices.services'

function useAcceptPrivacyNotice() {
  return useMutation({
    mutationFn: OneTrustNoticesServices.acceptPrivacyNotice,
  })
}

export const OneTrustNoticesMutations = {
  useAcceptPrivacyNotice,
}
