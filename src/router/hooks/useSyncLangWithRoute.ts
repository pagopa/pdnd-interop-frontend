import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

function useSyncLangWithRoute() {
  const location = useLocation()
  const { i18n } = useTranslation()

  const pathLang = location.pathname.split('/')[1]
  const supportedLngList = Object.keys(i18n.services.resourceStore.data)

  if (supportedLngList.includes(pathLang) && i18n.language !== pathLang) {
    i18n.changeLanguage(pathLang)
  }
}

export default useSyncLangWithRoute
