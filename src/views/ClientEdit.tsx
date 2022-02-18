import React from 'react'
import { useLocation } from 'react-router-dom'
import { Tab, Tabs, Typography } from '@mui/material'
import { Client } from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
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
      <StyledIntro sx={{ mb: 0 }}>{{ title: data.name }}</StyledIntro>

      <Tabs
        value={activeTab}
        onChange={updateActiveTab}
        aria-label="Due tab diverse per i dettagli del client e gli operatori di sicurezza"
        sx={{ my: 6 }}
        variant="fullWidth"
      >
        <Tab label="Dettagli del client" {...a11yProps(0)} />
        <Tab label="Operatori di sicurezza" {...a11yProps(1)} />
        <Tab label="Chiavi pubbliche" {...a11yProps(2)} />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <DescriptionBlock label="Descrizione">
          <Typography component="span">{data.description}</Typography>
        </DescriptionBlock>

        <DescriptionBlock label="Descrizione" childWrapperSx={{ pt: 0 }}>
          {/* <EditableField
            value={data.description}
            onSave={wrapFieldUpdate('description')}
            ariaLabel="Modifica descrizione"
            multiline={true}
          /> */}
          <Typography component="span">{data.description}</Typography>
        </DescriptionBlock>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <UserList />
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <KeysList />
      </TabPanel>
    </React.Fragment>
  )
}
