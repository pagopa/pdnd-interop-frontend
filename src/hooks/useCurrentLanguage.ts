import type { LangCode } from '@/types/common.types'
import { useTranslation } from 'react-i18next'

function useCurrentLanguage() {
  const { i18n } = useTranslation()
  return i18n.language as LangCode
}

export default useCurrentLanguage
