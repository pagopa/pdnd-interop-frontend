import { parseAsString, useQueryState, useQueryStates } from 'nuqs'

export const useActiveTab = (defaultTab: string) => {
  const [activeTab, setActiveTab] = useQueryState(
    'tab',
    parseAsString.withDefault(defaultTab).withOptions({
      history: 'push',
      scroll: true,
      clearOnDefault: false,
    })
  )

  const [, setQuery] = useQueryStates(
    {
      offset: parseAsString,
      signingStates: parseAsString,
      eservicesIds: parseAsString,
    },
    {
      history: 'push',
      scroll: true,
      clearOnDefault: false,
    }
  )

  const updateActiveTab = (_: unknown, newTab: string) => {
    void setActiveTab(newTab)
    // remove query parameters related to pagination and filtering when the tab changes
    void setQuery({ offset: null, signingStates: null, eservicesIds: null })
  }

  return { activeTab, updateActiveTab }
}
