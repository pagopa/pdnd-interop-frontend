import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { isProviderOrSubscriber } from '../lib/router-utils'

export const useMode = () => {
  const location = useLocation()
  const { t } = useTranslation('common')
  return isProviderOrSubscriber(t)(location)
}
