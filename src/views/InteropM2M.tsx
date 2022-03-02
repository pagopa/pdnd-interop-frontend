import React from 'react'
import { Tab, Typography } from '@mui/material'
import { TabList, TabContext, TabPanel } from '@mui/lab'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useActiveTab } from '../hooks/useActiveTab'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledLink } from '../components/Shared/StyledLink'
import { useRoute } from '../hooks/useRoute'
import { FileDownloadOutlined as FileDownloadOutlinedIcon } from '@mui/icons-material'
import { Contained } from '../components/Shared/Contained'
import { ClientList } from './ClientList'
import { URL_INTEROP_M2M_INTERFACE } from '../lib/constants'

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
          sx={{ my: 6 }}
          variant="fullWidth"
        >
          <Tab label="Dettagli" value="details" />
          <Tab label="Client associati" value="clients" />
        </TabList>

        <TabPanel value="details">
          <Contained>
            <DescriptionBlock label="Interfaccia (OpenAPI)">
              <Typography
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                Scarica file di interfaccia
                <a href={URL_INTEROP_M2M_INTERFACE}>
                  <FileDownloadOutlinedIcon />
                </a>
              </Typography>
            </DescriptionBlock>

            <Typography>
              Interop M2M sfrutta la client assertion per validare il client che effettua la
              richiesta. Se hai dubbi sull’implementazione,{' '}
              <StyledLink to={routes.CLIENT_ASSERTION_GUIDE.PATH}> consulta la guida</StyledLink>
            </Typography>
          </Contained>
        </TabPanel>
        <TabPanel value="clients">
          <ClientList clientKind="API" />
        </TabPanel>
      </TabContext>
    </React.Fragment>
  )
}
