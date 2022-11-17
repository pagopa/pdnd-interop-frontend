import pagesNs from '@/static/locales/en/pages.json'
import commonNs from '@/static/locales/en/common.json'
import eserviceNs from '@/static/locales/en/eservice.json'
import partyNs from '@/static/locales/en/party.json'
import pagopaNs from '@/static/locales/en/pagopa.json'
import sharedComponentsNs from '@/static/locales/en/shared-components.json'
import attributeNs from '@/static/locales/en/attribute.json'
import mutationsFeedbackNs from '@/static/locales/en/mutations-feedback.json'
import errorNs from '@/static/locales/en/error.json'
import agreementNs from '@/static/locales/en/agreement.json'
import purposeNs from '@/static/locales/en/purpose.json'
import clientNs from '@/static/locales/en/client.json'
import voucherNs from '@/static/locales/en/voucher.json'
import userNs from '@/static/locales/en/user.json'
import keyNs from '@/static/locales/en/key.json'

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
    }
  }
}
