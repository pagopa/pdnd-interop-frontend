import React from 'react'
import { useLocation } from 'react-router-dom'
import { Tab, Tabs } from '@mui/material'
import { Client, ClientKind } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { getBits } from '../lib/router-utils'
import { UserList } from './UserList'
import { useFeedback } from '../hooks/useFeedback'
import { a11yProps, TabPanel } from '../components/TabPanel'
import { StyledSkeleton } from '../components/Shared/StyledSkeleton'
import { KeysList } from '../components/KeysList'
// import { EditableField } from '../components/Shared/EditableField'
import { useActiveTab } from '../hooks/useActiveTab'

export function ClientEdit() {
  const location = useLocation()
  const { forceRerenderCounter } = useFeedback()
  const { activeTab, updateActiveTab } = useActiveTab()
  const locationBits = getBits(location)
  const clientId = locationBits[locationBits.length - 1]
  const kind: ClientKind = location.pathname.includes('interop-m2m') ? 'api' : 'consumer'
  const { data } = useAsyncFetch<Client>(
    {
      path: { endpoint: 'CLIENT_GET_SINGLE', endpointParams: { clientId } },
    },
    {
      useEffectDeps: [forceRerenderCounter],
      loadingTextLabel: 'Stiamo caricando il client richiesto',
    }
  )

  // const wrapFieldUpdate = (fieldName: 'description') => (updatedString: string | null) => {
  //   // TEMP PIN-1113
  //   console.log({ fieldName, updatedString })
  // }

  if (!data) {
    return <StyledSkeleton />
  }

  return (
    <React.Fragment>
      <StyledIntro sx={{ mb: 0 }}>
        {{ title: data.name, description: data.description }}
      </StyledIntro>

      <Tabs
        value={activeTab}
        onChange={updateActiveTab}
        aria-label="Due tab diverse per i dettagli del client e gli operatori di sicurezza"
        sx={{ my: 6 }}
        variant="fullWidth"
      >
        <Tab label="Operatori di sicurezza" {...a11yProps(0)} />
        <Tab label="Chiavi pubbliche" {...a11yProps(1)} />
      </Tabs>

      {/* <TabPanel value={activeTab} index={0}>
        <DescriptionBlock label="Descrizione" childWrapperSx={{ pt: 0 }}>
          <EditableField
            value={data.description}
            onSave={wrapFieldUpdate('description')}
            ariaLabel="Modifica descrizione"
            multiline={true}
          />
        </DescriptionBlock>
      </TabPanel> */}

      <TabPanel value={activeTab} index={0}>
        <UserList kind={kind} />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <KeysList kind={kind} />
      </TabPanel>
    </React.Fragment>
  )
}
