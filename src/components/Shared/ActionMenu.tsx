import React, { FunctionComponent, useState } from 'react'
import { MoreVert as MoreVertIcon } from '@mui/icons-material'
import { StyledButton } from './StyledButton'
import { Menu, MenuItem } from '@mui/material'
import { ActionProps } from '../../../types'

type ActionMenuProps = {
  actions: ActionProps[]
  index: number
}

export const ActionMenu: FunctionComponent<ActionMenuProps> = ({ actions, index }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <StyledButton
        id={`basic-button-${index}`}
        aria-controls={`basic-menu-${index}`}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon color="primary" />
      </StyledButton>

      <Menu
        id={`basic-menu-${index}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {actions.map(({ onClick, label }, i) => {
          return (
            <MenuItem key={i} onClick={onClick}>
              {label}
            </MenuItem>
          )
        })}
      </Menu>
    </React.Fragment>
  )
}
