import { useState } from 'react'

type UseActiveTabProps = {
  initialActiveTab: number
}

export const useActiveTab = (props?: UseActiveTabProps) => {
  const [activeTab, setActiveTab] = useState((props && props.initialActiveTab) || 0)

  const updateActiveTab = (_: React.SyntheticEvent, newTab: number) => {
    setActiveTab(newTab)
  }

  return { activeTab, updateActiveTab }
}
