import React from 'react'
import { useTranslation } from 'react-i18next'
import { Breadcrumbs as _Breadcrumbs, useLocation } from '@/router'

export function Breadcrumbs() {
  const { t } = useTranslation('shared-components')
  const routeLabels = t('routeLabels', { returnObjects: true })
  const { routeKey } = useLocation()

  return (
    <_Breadcrumbs
      routeLabels={{
        ...routeLabels,
        PROVIDE_ESERVICE_MANAGE:
          routeKey === 'PROVIDE_ESERVICE_EDIT' ? false : routeLabels.PROVIDE_ESERVICE_MANAGE,
        DEFAULT: false,
      }}
    />
  )
}
