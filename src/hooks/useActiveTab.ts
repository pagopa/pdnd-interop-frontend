import { useLocation, useSearchParams } from 'react-router-dom'

export const useActiveTab = (defaultTab: string) => {
  const [searchParams, setSearchParams] = useSearchParams({ tab: defaultTab })
  const location = useLocation()

  const activeTab = searchParams.get('tab') || defaultTab

  const updateActiveTab = (_: unknown, newTab: string) => {
    // remove the pagination parameter offset if the tab is changed and it is present
    searchParams.delete('offset')
    searchParams.delete('signingStates')
    searchParams.delete('eservicesIds')

    setSearchParams(
      { ...Object.fromEntries(searchParams), tab: newTab },
      { replace: true, state: location.state }
    )
  }

  return { activeTab, updateActiveTab }
}
