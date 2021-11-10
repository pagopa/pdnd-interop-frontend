import React, { FunctionComponent } from 'react'

type TabPanelType = {
  value: number
  index: number
}

export const TabPanel: FunctionComponent<TabPanelType> = ({ value, index, children }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index ? children : null}
    </div>
  )
}

export const a11yProps = (index: number) => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`,
})
