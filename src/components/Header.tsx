import React from 'react'
import { Link, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material'
import { ButtonNaked } from '@pagopa/mui-italia'
import { UserActionSelect } from './UserActionsSelect'

type JwtUser = {
  id: string
  name?: string
  surname?: string
  email?: string
}

type UserAction = {
  id: string
  icon: React.ReactNode
  label: string
  onClick: () => void
}

type HeaderProps = {
  onAssistanceClick: () => void
  loggedUser?: JwtUser
  onLogin: () => void
  showSubHeader?: boolean
  subHeaderLeftComponent?: React.ReactNode
  subHeaderRightComponent?: React.ReactNode
  userActions?: UserAction[]
}

export function Header({
  onAssistanceClick,
  loggedUser,
  onLogin,
  showSubHeader = true,
  subHeaderLeftComponent,
  subHeaderRightComponent,
  userActions,
}: HeaderProps) {
  return (
    <header>
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1,
            px: 3,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <a
            href="https://www.pagopa.it/"
            target="_blank"
            rel="noreferrer"
            title="Vai al sito di PagoPA S.p.A."
            style={{ textDecoration: 'none' }}
          >
            <Typography component="span" variant="body2" fontWeight="700">
              PagoPA
            </Typography>
          </a>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link
              component="button"
              onClick={onAssistanceClick}
              color="text.primary"
              variant="caption"
              underline="none"
              sx={{ display: 'inline-flex', alignItems: 'center', mr: 4, fontWeight: 600 }}
            >
              <HelpOutlineIcon fontSize="small" color="inherit" sx={{ mr: 1 }} />
              Assistenza
            </Link>

            {!loggedUser ? (
              <ButtonNaked onClick={onLogin} title="Effettua il login su Self care">
                Login
              </ButtonNaked>
            ) : (
              <UserActionSelect user={loggedUser} userActions={userActions} />
            )}
          </Box>
        </Box>
      </Box>

      {showSubHeader && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}
          >
            {subHeaderLeftComponent}
            {subHeaderRightComponent && (
              <Box sx={{ marginLeft: 'auto' }}>{subHeaderRightComponent}</Box>
            )}
          </Box>
        </Box>
      )}
    </header>
  )
}
