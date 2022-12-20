import { parseSearch, stringifySearch } from '@/router/router.utils'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const useActiveTab = (defaultTab: string) => {
  const location = useLocation()
  const queryParams = parseSearch(location.search)
  const tabFromUrl = (queryParams?.tab as string | undefined) || defaultTab
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState(tabFromUrl)

  const updateActiveTab = (_: React.SyntheticEvent, newTab: string) => {
    const pathname = location.pathname
    const search = parseSearch(location.search)
    search.tab = newTab
    const stringifiedSearch = stringifySearch(search)
    const newPath = `${pathname}?${stringifiedSearch}`
    navigate(newPath, { replace: true })
  }

  useEffect(() => {
    const search = parseSearch(location.search)
    const newTab = (search?.tab as string | undefined) || defaultTab
    setActiveTab(newTab)
  }, [location, defaultTab])

  return { activeTab, updateActiveTab }
}
