import React from 'react'
import { useTranslation } from 'react-i18next'
import { Breadcrumbs as _Breadcrumbs, useCurrentRoute } from '@/router'
import type sharedComponentsNs from '@/static/locales/en/shared-components.json'

export function Breadcrumbs() {
  const { t } = useTranslation('shared-components')
  const routeLabels = t('routeLabels', {
    returnObjects: true,
  }) as typeof sharedComponentsNs.routeLabels
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
         * The PROVIDE_ESERVICE_MANAGE breadcrumb segment must not be visible in the PROVIDE_ESERVICE_EDIT and PROVIDE_ESERVICE_SUMMARY routes
         */
        PROVIDE_ESERVICE_TEMPLATE_DETAILS: [
          'PROVIDE_ESERVICE_TEMPLATE_SUMMARY',
          'PROVIDE_ESERVICE_TEMPLATE_EDIT',
        ].includes(routeKey)
          ? false
          : routeLabels.PROVIDE_ESERVICE_TEMPLATE_DETAILS,

        /*
         * The SUBSCRIBE_AGREEMENT_READ breadcrumb segment must not be visible in the SUBSCRIBE_AGREEMENT_EDIT route
         */
        SUBSCRIBE_AGREEMENT_READ:
          routeKey === 'SUBSCRIBE_AGREEMENT_EDIT' ? false : routeLabels.SUBSCRIBE_AGREEMENT_READ,

        /*
         * The SUBSCRIBE_PURPOSE_DETAILS breadcrumb segment must not be visible in the SUBSCRIBE_PURPOSE_EDIT, SUBSCRIBE_PURPOSE_SUMMARY, and SUBSCRIBE_PURPOSE_FROM_TEMPLATE_EDIT routes
         */
        SUBSCRIBE_PURPOSE_DETAILS: [
          'SUBSCRIBE_PURPOSE_EDIT',
          'SUBSCRIBE_PURPOSE_SUMMARY',
          'SUBSCRIBE_PURPOSE_FROM_TEMPLATE_EDIT',
        ].includes(routeKey)
          ? false
          : routeLabels.SUBSCRIBE_PURPOSE_DETAILS,

        SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS: [
          'SUBSCRIBE_PURPOSE_TEMPLATE_SUMMARY',
          'SUBSCRIBE_PURPOSE_TEMPLATE_EDIT',
        ].includes(routeKey)
          ? false
          : routeLabels.SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS,

        SUBSCRIBE_PURPOSE_FROM_TEMPLATE_EDIT:
          (routeLabels as Record<string, string | false>).SUBSCRIBE_PURPOSE_FROM_TEMPLATE_EDIT ??
          false,

        SUBSCRIBE_PURPOSE_CREATE_FROM_TEMPLATE:
          (routeLabels as Record<string, string | false>).SUBSCRIBE_PURPOSE_CREATE_FROM_TEMPLATE ??
          false,

        DEFAULT: false,
        ASSISTENCE_PARTY_SELECTION: false,
      }}
    />
  )
}
