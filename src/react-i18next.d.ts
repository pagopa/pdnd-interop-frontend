import pagesNs from '../public/locales/en/pages.json'
import commonNs from '../public/locales/en/common.json'
import eserviceNs from '../public/locales/en/eservice.json'
import partyNs from '../public/locales/en/party.json'
import pagopaNs from '../public/locales/en/pagopa.json'
import sharedComponentsNs from '../public/locales/en/shared-components.json'
import attributeNs from '../public/locales/en/attribute.json'
import mutationsFeedbackNs from '../public/locales/en/mutations-feedback.json'
import errorNs from '../public/locales/en/error.json'
import agreementNs from '../public/locales/en/agreement.json'

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
    }
  }
}
