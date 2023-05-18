import React from 'react'
import { useTranslation } from 'react-i18next'
import { Breadcrumbs as _Breadcrumbs } from '@/router'

export function Breadcrumbs() {
  const { t } = useTranslation('shared-components')
  const routeLabels = t('routeLabels', { returnObjects: true })
  return <_Breadcrumbs routeLabels={{ ...routeLabels, DEFAULT: false }} />
}
