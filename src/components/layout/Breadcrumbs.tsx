import React from 'react'
import { useTranslation } from 'react-i18next'
import { Breadcrumbs as _Breadcrumbs, useCurrentRoute } from '@/router'

export function Breadcrumbs() {
  const { t } = useTranslation('shared-components')
  const routeLabels = t('routeLabels', { returnObjects: true })
  const { routeKey } = useCurrentRoute()

  return (
    <_Breadcrumbs
      routeLabels={{
        ...routeLabels,

        /*
         * The PROVIDE_ESERVICE_MANAGE breadcrumb segment must not be visible in the PROVIDE_ESERVICE_EDIT and PROVIDE_ESERVICE_SUMMARY routes
         */
        PROVIDE_ESERVICE_MANAGE: ['PROVIDE_ESERVICE_SUMMARY', 'PROVIDE_ESERVICE_EDIT'].includes(
          routeKey
        )
          ? false
          : routeLabels.PROVIDE_ESERVICE_MANAGE,

        /*
         * The SUBSCRIBE_AGREEMENT_READ breadcrumb segment must not be visible in the SUBSCRIBE_AGREEMENT_EDIT route
         */
        SUBSCRIBE_AGREEMENT_READ:
          routeKey === 'SUBSCRIBE_AGREEMENT_EDIT' ? false : routeLabels.SUBSCRIBE_AGREEMENT_READ,

        /*
         * The SUBSCRIBE_PURPOSE_DETAILS breadcrumb segment must not be visible in the SUBSCRIBE_PURPOSE_EDIT route
         */
        SUBSCRIBE_PURPOSE_DETAILS: ['SUBSCRIBE_PURPOSE_EDIT', 'SUBSCRIBE_PURPOSE_SUMMARY'].includes(
          routeKey
        )
          ? false
          : routeLabels.SUBSCRIBE_PURPOSE_DETAILS,

        DEFAULT: false,
        ASSISTENCE_PARTY_SELECTION: false,
      }}
    />
  )
}
