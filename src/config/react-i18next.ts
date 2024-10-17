import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LANG } from '@/config/constants'

import pagesEnNs from '@/static/locales/en/pages.json'
import commonEnNs from '@/static/locales/en/common.json'
import eserviceEnNs from '@/static/locales/en/eservice.json'
import partyEnNs from '@/static/locales/en/party.json'
import pagopaEnNs from '@/static/locales/en/pagopa.json'
import sharedComponentsEnNs from '@/static/locales/en/shared-components.json'
import attributeEnNs from '@/static/locales/en/attribute.json'
import mutationsFeedbackEnNs from '@/static/locales/en/mutations-feedback.json'
import errorEnNs from '@/static/locales/en/error.json'
import agreementEnNs from '@/static/locales/en/agreement.json'
import purposeEnNs from '@/static/locales/en/purpose.json'
import clientEnNs from '@/static/locales/en/client.json'
import voucherEnNs from '@/static/locales/en/voucher.json'
import userEnNs from '@/static/locales/en/user.json'
import keyEnNs from '@/static/locales/en/key.json'
import assistanceEnNs from '@/static/locales/en/assistance.json'
import keychainEnNs from '@/static/locales/en/keychain.json'

import pagesItNs from '@/static/locales/it/pages.json'
import commonItNs from '@/static/locales/it/common.json'
import eserviceItNs from '@/static/locales/it/eservice.json'
import partyItNs from '@/static/locales/it/party.json'
import pagopaItNs from '@/static/locales/it/pagopa.json'
import sharedComponentsItNs from '@/static/locales/it/shared-components.json'
import attributeItNs from '@/static/locales/it/attribute.json'
import mutationsFeedbackItNs from '@/static/locales/it/mutations-feedback.json'
import errorItNs from '@/static/locales/it/error.json'
import agreementItNs from '@/static/locales/it/agreement.json'
import purposeItNs from '@/static/locales/it/purpose.json'
import clientItNs from '@/static/locales/it/client.json'
import voucherItNs from '@/static/locales/it/voucher.json'
import userItNs from '@/static/locales/it/user.json'
import keyItNs from '@/static/locales/it/key.json'
import assistanceItNs from '@/static/locales/it/assistance.json'
import keychainItNs from '@/static/locales/it/keychain.json'

i18n.use(initReactI18next).init({
  debug: false,
  fallbackLng: DEFAULT_LANG,
  interpolation: {
    escapeValue: false,
  },
  defaultNS: 'common',
  resources: {
    it: {
      pages: pagesItNs,
      common: commonItNs,
      eservice: eserviceItNs,
      party: partyItNs,
      pagopa: pagopaItNs,
      'shared-components': sharedComponentsItNs,
      attribute: attributeItNs,
      'mutations-feedback': mutationsFeedbackItNs,
      error: errorItNs,
      agreement: agreementItNs,
      purpose: purposeItNs,
      client: clientItNs,
      voucher: voucherItNs,
      user: userItNs,
      key: keyItNs,
      assistance: assistanceItNs,
      keychain: keychainItNs,
    },
    en: {
      pages: pagesEnNs,
      common: commonEnNs,
      eservice: eserviceEnNs,
      party: partyEnNs,
      pagopa: pagopaEnNs,
      'shared-components': sharedComponentsEnNs,
      attribute: attributeEnNs,
      'mutations-feedback': mutationsFeedbackEnNs,
      error: errorEnNs,
      agreement: agreementEnNs,
      purpose: purposeEnNs,
      client: clientEnNs,
      voucher: voucherEnNs,
      user: userEnNs,
      key: keyEnNs,
      assistance: assistanceEnNs,
      keychain: keychainEnNs,
    },
  },
})

export default i18n
