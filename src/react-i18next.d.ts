import type pagesNs from '@/static/locales/en/pages.json'
import type commonNs from '@/static/locales/en/common.json'
import type eserviceNs from '@/static/locales/en/eservice.json'
import type partyNs from '@/static/locales/en/party.json'
import type pagopaNs from '@/static/locales/en/pagopa.json'
import type sharedComponentsNs from '@/static/locales/en/shared-components.json'
import type attributeNs from '@/static/locales/en/attribute.json'
import type mutationsFeedbackNs from '@/static/locales/en/mutations-feedback.json'
import type errorNs from '@/static/locales/en/error.json'
import type agreementNs from '@/static/locales/en/agreement.json'
import type purposeNs from '@/static/locales/en/purpose.json'
import type clientNs from '@/static/locales/en/client.json'
import type voucherNs from '@/static/locales/en/voucher.json'
import type userNs from '@/static/locales/en/user.json'
import type keyNs from '@/static/locales/en/key.json'
import type assistanceNs from '@/static/locales/en/assistance.json'
import type keychainNs from '@/static/locales/en/keychain.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      pages: typeof pagesNs
      common: typeof commonNs
      eservice: typeof eserviceNs
      party: typeof partyNs
      pagopa: typeof pagopaNs
      'shared-components': typeof sharedComponentsNs
      attribute: typeof attributeNs
      'mutations-feedback': typeof mutationsFeedbackNs
      error: typeof errorNs
      agreement: typeof agreementNs
      purpose: typeof purposeNs
      client: typeof clientNs
      voucher: typeof voucherNs
      user: typeof userNs
      key: typeof keyNs
      assistance: typeof assistanceNs
      keychain: typeof keychainNs
    }
  }
}
