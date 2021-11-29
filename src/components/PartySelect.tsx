import { Menu, MenuItem, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useState } from 'react'
import { Party } from '../../types'
import { PartyContext } from '../lib/context'
import { storageWrite } from '../lib/storage-utils'
import { StyledButton } from './Shared/StyledButton'
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material'
import { KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material'
import { USER_ROLE_LABEL } from '../config/labels'

export function PartySelect() {
  const { party, availableParties, setParty } = useContext(PartyContext)

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)
  const handleClick = (e: React.SyntheticEvent) => {
    const currentTarget = e.currentTarget as HTMLButtonElement
    setAnchorEl(currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const wrapUpdateActiveParty = (newParty: Party) => (e: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault()
    }

    setParty(newParty)
    storageWrite('currentParty', newParty, 'object')

    handleClose()
  }

  return (
    <React.Fragment>
      <Box>
        <StyledButton
          sx={{ color: 'common.white', justifyContent: 'space-between', width: 260 }}
          aria-label="party-menu-button"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          {party && (
            <Box component="span" sx={{ textAlign: 'left' }}>
              <Typography color="inherit" component="span" variant="body2" sx={{ fontWeight: 700 }}>
                {party.description}
              </Typography>
              <br />
              <Typography color="inherit" component="span" variant="caption">
                {USER_ROLE_LABEL[party.role]}
              </Typography>
            </Box>
          )}

          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </StyledButton>
        {availableParties && (
          <Menu
            PaperProps={{ style: { maxHeight: 220, width: 260 } }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'party-menu-button' }}
          >
            {availableParties.map((p, i) => {
              return (
                <MenuItem key={i} onClick={wrapUpdateActiveParty(p)} sx={{ display: 'block' }}>
                  <Typography component="span" variant="body2" sx={{ fontWeight: 700 }}>
                    {p.description}
                  </Typography>
                  <br />
                  <Typography component="span" variant="caption">
                    {USER_ROLE_LABEL[p.role]}
                  </Typography>
                </MenuItem>
              )
            })}
          </Menu>
        )}
      </Box>
    </React.Fragment>
  )
}
