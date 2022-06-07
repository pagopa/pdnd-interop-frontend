import React, { useState } from 'react'
import { Menu, MenuItem, Typography } from '@mui/material'
import { Box } from '@mui/system'
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material'
import { ButtonNaked } from '@pagopa/mui-italia'
import { JwtUser } from '../../types'

type UserAction = {
  id: string
  icon: React.ReactNode
  label: string
  onClick: () => void
}

type UserActionSelectProps = {
  user: JwtUser
  userActions?: UserAction[]
}

export function UserActionSelect({ user, userActions }: UserActionSelectProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)
  const handleClick = (e: React.SyntheticEvent) => {
    const currentTarget = e.currentTarget as HTMLButtonElement
    setAnchorEl(currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const wrapOnClick = (onClick: () => void) => (e: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault()
    }

    onClick()
    handleClose()
  }

  return (
    <React.Fragment>
      <ButtonNaked
        sx={{ color: 'text.primary', justifyContent: 'space-between', px: 0 }}
        aria-label="party-menu-button"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Box component="span" sx={{ textAlign: 'left', display: 'flex' }}>
          <AccountCircleIcon fontSize="small" color="inherit" sx={{ mr: 1 }} />
          <Typography color="inherit" component="span" variant="caption" fontWeight={600}>
            {/* REIMPLEMENT */}
            {/* {user.name && user.family_name ? `${user.name} ${user.family_name}` : 'Utente'} */}
          </Typography>
        </Box>

        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </ButtonNaked>

      {userActions && Boolean(userActions.length > 0) && (
        <Menu
          PaperProps={{ style: { maxHeight: 220, width: 200 } }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{ 'aria-labelledby': 'party-menu-button' }}
        >
          {userActions.map(({ id, label, onClick, icon }) => (
            <MenuItem key={id} onClick={wrapOnClick(onClick)} sx={{ display: 'flex' }}>
              {icon}
              <Typography component="span" variant="body2" sx={{ fontWeight: 700 }}>
                {label}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      )}
    </React.Fragment>
  )
}
