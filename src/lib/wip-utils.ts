import isEmpty from 'lodash/isEmpty'
import { parseSearch } from './url-utils'

export function showTempAlert(featureName: string) {
  alert(`${featureName}: questa funzionalità sarà disponibile a breve`)
}

export function getDevLabels() {
  const searchObj = parseSearch(window.location.search)
  if (!isEmpty(searchObj) && searchObj.show_dev_labels) {
    return true
  }

  return false
}
