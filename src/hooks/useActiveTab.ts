import { useSearchParams } from 'react-router-dom'

export const useActiveTab = (defaultTab: string) => {
  const [searchParams, setSearchParams] = useSearchParams({ tab: defaultTab })

  const activeTab = searchParams.get('tab') || defaultTab

  const updateActiveTab = (_: unknown, newTab: string) => {
    setSearchParams({ ...Object.fromEntries(searchParams), tab: newTab })
  }

  return { activeTab, updateActiveTab }
}
