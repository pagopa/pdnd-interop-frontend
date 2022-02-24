import React, { useContext } from 'react'
import { Tab, Typography } from '@mui/material'
import { TabList, TabContext, TabPanel } from '@mui/lab'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useActiveTab } from '../hooks/useActiveTab'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { EServiceReadType } from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledLink } from '../components/Shared/StyledLink'
import { useRoute } from '../hooks/useRoute'
import { FileDownloadOutlined as FileDownloadOutlinedIcon } from '@mui/icons-material'
import { StyledButton } from '../components/Shared/StyledButton'
import { Contained } from '../components/Shared/Contained'
import { ClientList } from './ClientList'
import { PartyContext } from '../lib/context'
import { isAdmin } from '../lib/auth-utils'

export function InteropM2M() {
  const { activeTab, updateActiveTab } = useActiveTab('details')
  const { routes } = useRoute()
  const { party } = useContext(PartyContext)

  const interopM2MEserviceId = 'nsdiofndso-safjisdfjl'
  const { data, error } = useAsyncFetch<EServiceReadType>(
    {
      path: {
        endpoint: 'ESERVICE_GET_SINGLE',
        endpointParams: { eserviceId: interopM2MEserviceId },
      },
    },
    { loadingTextLabel: 'Stiamo caricando il tuo e-service' }
  )

  const wrapDownload = (version: string) => () => {
    console.log('download', version)
  }

  console.log({ data, error })

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'InteropM2M',
          description:
            'L’API Machine to Machine che permette di fruire della piattaforma Interoperabilità al di fuori della web app',
        }}
      </StyledIntro>

      {isAdmin(party) ? (
        <React.Fragment>
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
                <DescriptionBlock label="Interfaccia (OpenAPI) – versione corrente">
                  Questa versione dell’API è deprecata. Sarà ritirata il 15/02/2022
                  <StyledButton sx={{ ml: 3, px: 1, py: 1 }} onClick={wrapDownload('current')}>
                    <FileDownloadOutlinedIcon />
                  </StyledButton>
                </DescriptionBlock>

                <DescriptionBlock label="Interfaccia (OpenAPI) – prossima corrente">
                  <StyledButton sx={{ ml: 3, px: 1, py: 1 }} onClick={wrapDownload('next')}>
                    <FileDownloadOutlinedIcon />
                  </StyledButton>
                </DescriptionBlock>

                <Typography>
                  Interop M2M sfrutta la client assertion per validare il client che effettua la
                  richiesta. Se hai dubbi sull’implementazione,{' '}
                  <StyledLink to={routes.CLIENT_ASSERTION_GUIDE.PATH}>
                    {' '}
                    consulta la guida
                  </StyledLink>
                </Typography>
              </Contained>
            </TabPanel>
            <TabPanel value="clients">
              <ClientList clientKind="api" />
            </TabPanel>
          </TabContext>
        </React.Fragment>
      ) : (
        <ClientList clientKind="api" />
      )}
    </React.Fragment>
  )
}
