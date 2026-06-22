import { useSearchParams } from 'react-router-dom'

export const useActiveTab = (defaultTab: string) => {
  const [searchParams, setSearchParams] = useSearchParams({ tab: defaultTab })

  const activeTab = searchParams.get('tab') || defaultTab

  const updateActiveTab = (_: unknown, newTab: string) => {
    // remove the pagination parameter offset if the tab is changed and it is present
    searchParams.delete('offset')

    setSearchParams({ ...Object.fromEntries(searchParams), tab: newTab })
  }

  return { activeTab, updateActiveTab }
}
