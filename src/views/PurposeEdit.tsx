import React, { useEffect, useState } from 'react'
import { Tab, Tabs, Typography } from '@mui/material'
import { a11yProps, TabPanel } from '../components/TabPanel'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useHistory, useLocation } from 'react-router-dom'
import { buildDynamicPath, getBits } from '../lib/router-utils'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { mockPurpose1 } from '../temp/mock-purpose'
import { DecoratedPurpose, Purpose } from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { decoratePurposeWithMostRecentVersion, getComputedPurposeState } from '../lib/purpose'
import { formatThousands } from '../lib/number-utils'
import { StyledLink } from '../components/Shared/StyledLink'
import { ROUTES } from '../config/routes'
import { CLIENT_STATE_LABEL, PURPOSE_STATE_LABEL } from '../config/labels'
import { StyledButton } from '../components/Shared/StyledButton'
import { useFeedback } from '../hooks/useFeedback'
import { downloadFile } from '../lib/file-utils'
import { AxiosResponse } from 'axios'
import { Box } from '@mui/system'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
// import { ActionMenu } from '../components/Shared/ActionMenu'

export const PurposeEdit = () => {
  const history = useHistory()
  const [mockData, setMockData] = useState<DecoratedPurpose>()
  const location = useLocation()
  const { runAction, wrapActionInDialog } = useFeedback()
  const [activeTab, setActiveTab] = useState(0)
  const locationBits = getBits(location)
  const purposeId = locationBits[locationBits.length - 1]
  const { data /*, error */ } = useAsyncFetch<Purpose>(
    {
      path: { endpoint: 'PURPOSE_GET_SINGLE', endpointParams: { purposeId } },
    },
    {
      loadingTextLabel: 'Stiamo caricando il client richiesto',
    }
  )

  useEffect(() => {
    if (!data) {
      const decorated = decoratePurposeWithMostRecentVersion(mockPurpose1)
      setMockData(decorated)
    }
  }, [data])

  const updateActiveTab = (_: React.SyntheticEvent, newTab: number) => {
    setActiveTab(newTab)
  }

  const downloadDocument = async () => {
    const { response, outcome } = await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DOWNLOAD_DOCUMENT',
          endpointParams: {
            purposeId,
            versionId: mockData?.currentVersion.id,
            documentId: mockData?.currentVersion.riskAnalysis,
          },
        },
      },
      { suppressToast: true }
    )

    if (outcome === 'success') {
      downloadFile((response as AxiosResponse).data, 'document')
    }
  }

  const suspend = async () => {
    //
  }

  const archive = async () => {
    //
  }

  const headData = ['nome client', 'stato', '']

  return (
    <React.Fragment>
      <StyledIntro>{{ title: mockData?.name }}</StyledIntro>

      <Tabs
        value={activeTab}
        onChange={updateActiveTab}
        aria-label="Due tab diverse per i dettagli della finalità e i client associati"
        sx={{ mb: 6 }}
      >
        <Tab label="Dettagli finalità" {...a11yProps(0)} />
        <Tab label="Client associati" {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <DescriptionBlock label="Questa finalità può accedere all’e-service dell’erogatore?">
          <Typography component="span">{mockData && getComputedPurposeState(mockData)}</Typography>
        </DescriptionBlock>

        <DescriptionBlock label="Stima di carico corrente">
          <Typography component="span">
            {mockData && formatThousands(mockData?.mostRecentVersion.dailyCalls)} chiamate/giorno
          </Typography>
        </DescriptionBlock>

        <DescriptionBlock label="Descrizione">
          <Typography component="span">{mockData?.description}</Typography>
        </DescriptionBlock>

        <DescriptionBlock label="La versione dell'e-service che stai usando">
          <StyledLink
            to={buildDynamicPath(ROUTES.SUBSCRIBE_CATALOG_VIEW.PATH, {
              eserviceId: mockData?.eservice.id,
              descriptorId: mockData?.eserviceDescriptor.id,
            })}
          >
            {mockData?.eservice.name}, versione {mockData?.eserviceDescriptor.version}
          </StyledLink>
        </DescriptionBlock>

        <DescriptionBlock label="Richiesta di fruizione">
          <StyledLink
            to={buildDynamicPath(ROUTES.SUBSCRIBE_AGREEMENT_EDIT.PATH, {
              agreementId: mockData?.agreement.id,
            })}
          >
            Vedi richiesta
          </StyledLink>
        </DescriptionBlock>

        <DescriptionBlock label="Stato della finalità">
          <Typography component="span">
            {mockData && PURPOSE_STATE_LABEL[mockData.currentVersion.state]}
          </Typography>
        </DescriptionBlock>

        {mockData && (
          <DescriptionBlock label="Analisi del rischio">
            <StyledButton onClick={downloadDocument}>
              <Typography component="span">Scarica il documento di interfaccia</Typography>
            </StyledButton>
          </DescriptionBlock>
        )}

        {mockData && mockData.awaitingApproval && (
          <DescriptionBlock label="Richiesta di aggiornamento">
            <Typography component="span" sx={{ display: 'inline-block' }}>
              Stima di carico: {formatThousands(mockData.mostRecentVersion.dailyCalls)}{' '}
              chiamate/giorno
            </Typography>
            <Typography component="span" sx={{ display: 'inline-block' }}>
              {mockData.mostRecentVersion.approvalDateEstimate
                ? `Data di approvazione stimata: ${mockData.mostRecentVersion.approvalDateEstimate}`
                : 'Non è stata determinata una data di approvazione'}
            </Typography>
          </DescriptionBlock>
        )}

        {mockData && mockData.versions.length > 1 && (
          <DescriptionBlock label="Storico di questa finalità">
            {mockData.versions.map((v, i) => {
              return (
                <Typography component="span" key={i} sx={{ display: 'inline-block' }}>
                  {v.dailyCalls} chiamate/giorno; data di approvazione:{' '}
                  {v.approvalDate || v.approvalDateEstimate}
                </Typography>
              )
            })}
          </DescriptionBlock>
        )}

        <Box sx={{ mt: 4, display: 'flex' }}>
          <StyledButton
            variant="contained"
            sx={{ mr: 2 }}
            onClick={wrapActionInDialog(suspend, 'PURPOSE_SUSPEND')}
          >
            Sospendi
          </StyledButton>

          <StyledButton
            variant="outlined"
            sx={{ mr: 2 }}
            onClick={wrapActionInDialog(archive, 'PURPOSE_ARCHIVE')}
          >
            Archivia
          </StyledButton>

          <StyledButton variant="text" to={ROUTES.SUBSCRIBE_PURPOSE_LIST.PATH}>
            Torna alla lista delle finalità
          </StyledButton>
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Box sx={{ mt: 4 }}>
          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <StyledButton variant="contained" to={ROUTES.SUBSCRIBE_CLIENT_CREATE.PATH}>
              + Aggiungi
            </StyledButton>
          </Box> */}

          <TableWithLoader
            loadingText=""
            headData={headData}
            data={mockData?.clients}
            noDataLabel="Non ci sono client disponibili"
            // error={error}
          >
            {mockData?.clients?.map((item, i) => (
              <StyledTableRow
                key={i}
                cellData={[{ label: item.name }, { label: CLIENT_STATE_LABEL[item.state] }]}
              >
                <StyledButton
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    history.push(
                      buildDynamicPath(ROUTES.SUBSCRIBE_CLIENT_EDIT.PATH, { clientId: item.id })
                    )
                  }}
                >
                  Ispeziona
                </StyledButton>

                {/* <ActionMenu actions={getAvailableActions(item)} /> */}
              </StyledTableRow>
            ))}
          </TableWithLoader>
        </Box>
      </TabPanel>
    </React.Fragment>
  )
}
