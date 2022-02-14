import React, { useContext } from 'react'
import isEmpty from 'lodash/isEmpty'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { PartyContext } from '../lib/context'
import { StyledButton } from '../components/Shared/StyledButton'
import { Skeleton, Tab, Tabs } from '@mui/material'
import { Box } from '@mui/system'
import { ROUTES } from '../config/routes'
import { useActiveTab } from '../hooks/useActiveTab'
import { a11yProps, TabPanel } from '../components/TabPanel'
import { EServiceContentInfo } from '../components/Shared/EServiceContentInfo'
import { EServiceReadType } from '../../types'

type EServiceEditProps = {
  data: EServiceReadType
  isLoading: boolean
}

export function EServiceEdit({ data, isLoading }: EServiceEditProps) {
  const { activeTab, updateActiveTab } = useActiveTab()
  const { party } = useContext(PartyContext)

  if (isEmpty(data) || !party) {
    return null
  }

  if (isLoading) {
    return <Skeleton height={400} />
  }

  return (
    <React.Fragment>
      <StyledIntro sx={{ mb: 0 }}>{{ title: data.name }}</StyledIntro>

      <Tabs
        value={activeTab}
        onChange={updateActiveTab}
        aria-label="Due tab diverse per i dettagli dell'e-service e le stime di carico indicate dai fruitori"
        sx={{ my: 6 }}
        variant="fullWidth"
      >
        <Tab label="Dettagli dell'e-service" {...a11yProps(0)} />
        <Tab label="Stime di carico" {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <React.Fragment>
          <EServiceContentInfo data={data} />

          <Box sx={{ display: 'flex', mt: 4 }}>
            <StyledButton variant="outlined" to={ROUTES.SUBSCRIBE_CATALOG_LIST.PATH}>
              Torna al catalogo
            </StyledButton>
          </Box>
        </React.Fragment>
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        Stime di carico [TODO]
      </TabPanel>
    </React.Fragment>
  )
}
