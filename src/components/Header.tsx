import React, { useContext } from 'react'
import { ROUTES, USER_ROLE_LABEL } from '../lib/constants'
import { PartyContext, UserContext } from '../lib/context'
import { storageWrite } from '../lib/storage-utils'
import { Layout } from './Shared/Layout'
import { StyledButton } from './Shared/StyledButton'
import logo from '../assets/pagopa-logo-white.svg'
import { Box } from '@mui/system'
import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { StyledLink } from './Shared/StyledLink'
import { isInPlatform } from '../lib/router-utils'
import { useLocation } from 'react-router'

export function Header() {
  const location = useLocation()
  const { party, availableParties, setParty } = useContext(PartyContext)
  const { user } = useContext(UserContext)
  const { PATH: btnPath, LABEL: btnLabel } = user ? ROUTES.LOGOUT : ROUTES.LOGIN

  const updateActiveParty = (event: SelectChangeEvent<string>) => {
    const newPartyInstitutionId = event.target.value
    const newParty = availableParties.find((p) => p.institutionId === newPartyInstitutionId)
    setParty(newParty!)
    storageWrite('currentParty', newParty!, 'object')
  }

  return (
    <header>
      <Box sx={{ bgcolor: 'primary.dark' }}>
        <Layout>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 3,
            }}
          >
            <StyledLink to="/">
              <img src={logo} alt="Logo PagoPA" />
            </StyledLink>
            <StyledButton variant="contained" component={StyledLink} to={btnPath}>
              {btnLabel}
            </StyledButton>
          </Box>
        </Layout>
      </Box>

      <Box sx={{ bgcolor: 'primary.main' }}>
        <Layout>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ color: 'common.white', py: 3 }}>
              <Typography variant="h4">Interoperabilità</Typography>
              <Typography variant="caption">Il catalogo degli e-service delle PA</Typography>
            </Box>

            {isInPlatform(location) && party !== null && (
              <FormControl variant="standard">
                <Select
                  sx={{ color: 'common.white', minWidth: 260 }}
                  value={party!.institutionId}
                  label="Ente operante"
                  onChange={updateActiveParty}
                >
                  {availableParties.map((availableParty, i) => (
                    <MenuItem key={i} value={availableParty.institutionId}>
                      <Typography sx={{ fontWeight: 600 }}>{availableParty.description}</Typography>
                      <Typography variant="caption">
                        {USER_ROLE_LABEL[availableParty.role]}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </Layout>
      </Box>
    </header>
  )
}
