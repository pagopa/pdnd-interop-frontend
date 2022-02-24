import React from 'react'
import { useLocation } from 'react-router-dom'
import { Tab } from '@mui/material'
import { TabList, TabContext, TabPanel } from '@mui/lab'
import { Client } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { getBits } from '../lib/router-utils'
import { UserList } from './UserList'
import { useFeedback } from '../hooks/useFeedback'
import { StyledSkeleton } from '../components/Shared/StyledSkeleton'
import { KeysList } from '../components/KeysList'
// import { EditableField } from '../components/Shared/EditableField'
import { useActiveTab } from '../hooks/useActiveTab'
import { useClientKind } from '../hooks/useClientKind'

export function ClientEdit() {
  const location = useLocation()
  const { forceRerenderCounter } = useFeedback()
  const { activeTab, updateActiveTab } = useActiveTab('securityOperators')
  const locationBits = getBits(location)
  const clientId = locationBits[locationBits.length - 1]
  const clientKind = useClientKind()
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
      <TabContext value={activeTab}>
        <TabList
          onChange={updateActiveTab}
          aria-label="Due tab diverse per i dettagli del client e gli operatori di sicurezza"
          sx={{ my: 6 }}
          variant="fullWidth"
        >
          <Tab label="Operatori di sicurezza" value="securityOperators" />
          <Tab label="Chiavi pubbliche" value="publicKeys" />
        </TabList>

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

        <TabPanel value="securityOperators">
          <UserList clientKind={clientKind} />
        </TabPanel>

        <TabPanel value="publicKeys">
          <KeysList clientKind={clientKind} />
        </TabPanel>
      </TabContext>
    </React.Fragment>
  )
}
