import React from 'react'
import { Tab, Typography } from '@mui/material'
import { TabList, TabContext, TabPanel } from '@mui/lab'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useActiveTab } from '../hooks/useActiveTab'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledLink } from '../components/Shared/StyledLink'
import { useRoute } from '../hooks/useRoute'
import { ClientList } from './ClientList'
import { URL_INTEROP_M2M_INTERFACE_DOCUMENT } from '../lib/constants'
import { ResourceList } from '../components/Shared/ResourceList'

export function InteropM2M() {
  const { activeTab, updateActiveTab } = useActiveTab('details')
  const { routes } = useRoute()

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'InteropM2M',
          description:
            'L’API Machine to Machine che permette di fruire della piattaforma Interoperabilità al di fuori della web app',
        }}
      </StyledIntro>

      <TabContext value={activeTab}>
        <TabList
          onChange={updateActiveTab}
          aria-label="Due tab diverse per i dettagli dell'interop m2m ed i client associati"
          variant="fullWidth"
        >
          <Tab label="Dettagli" value="details" />
          <Tab label="Client associati" value="clients" />
        </TabList>

        <TabPanel value="details">
          <DescriptionBlock label="Risorse">
            <ResourceList
              resources={[
                {
                  label: 'Specifica OpenAPI',
                  onClick: () => {
                    window.location.assign(URL_INTEROP_M2M_INTERFACE_DOCUMENT)
                  },
                  type: 'externalLink',
                },
              ]}
            />
          </DescriptionBlock>

          <Typography>
            Interop M2M sfrutta la client assertion per validare il client che effettua la
            richiesta. Se hai dubbi sull’implementazione,{' '}
            <StyledLink to={routes.CLIENT_ASSERTION_GUIDE.PATH}> consulta la guida</StyledLink>.
          </Typography>
        </TabPanel>

        <TabPanel value="clients">
          <ClientList clientKind="API" />
        </TabPanel>
      </TabContext>
    </React.Fragment>
  )
}
