import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { parseSearch, stringifySearch } from '../lib/router-utils'

export const useActiveTab = (defaultTab: string) => {
  const history = useHistory()
  const queryParams = parseSearch(history.location.search)
  const tabFromUrl = (queryParams?.tab as string | undefined) || defaultTab

  const [activeTab, setActiveTab] = useState(tabFromUrl)

  const updateActiveTab = (_: React.SyntheticEvent, newTab: string) => {
    const pathname = history.location.pathname
    const search = parseSearch(history.location.search)
    search.tab = newTab
    const stringifiedSearch = stringifySearch(search)
    const newPath = `${pathname}?${stringifiedSearch}`
    history.push(newPath)
  }

  useEffect(() => {
    const search = parseSearch(history.location.search)
    const newTab = (search?.tab as string | undefined) || defaultTab
    setActiveTab(newTab)
  }, [history.location]) // eslint-disable-line react-hooks/exhaustive-deps

  return { activeTab, updateActiveTab }
}
