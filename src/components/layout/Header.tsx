import React from 'react'
import { Container, Button, Stack, IconButton } from '@mui/material'
import { useJwt } from '@/hooks/useJwt'
import { useNavigateRouter } from '@/router'
import { goToLoginPage } from '@/utils/common.utils'
import { documentationLink, pagoPaLink } from '@/config/constants'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import DescriptionIcon from '@mui/icons-material/Description'
import { AccountDropdown, ButtonNaked, HeaderProduct } from '@pagopa/mui-italia'

export const Header = () => {
  const { navigate } = useNavigateRouter()
  const { jwt } = useJwt()

  const headerAccountLoggedUser = jwt
    ? { id: jwt.uid, name: jwt.name, surname: jwt.family_name, email: '' }
    : undefined

  return (
    <header>
      <HeaderAccount
        rootLink={pagoPaLink}
        loggedUser={headerAccountLoggedUser}
        onLogin={goToLoginPage}
        onLogout={() => {
          navigate('LOGOUT')
        }}
        onAssistanceClick={() => {
          window.open('assistanceLink')
        }}
        onDocumentationClick={() => {
          window.open(documentationLink, '_blank')
        }}
      />

      <HeaderProduct
        productId="interop"
        productsList={[
          {
            id: 'interop',
            title: 'Interoperabilità',
            productUrl: '',
            linkType: 'internal',
          },
        ]}
        // partyId={jwt?.organizationId}
        // partyList={partyList}
      />
    </header>
  )
}

export type JwtUser = {
  id: string
  name?: string
  surname?: string
  email?: string
}

export type UserAction = {
  id: string
  icon: React.ReactNode
  label: string
  onClick: () => void
}

export type RootLinkType = {
  label: string
  href: string
  ariaLabel: string
  title: string
}

type HeaderAccountProps = {
  rootLink: RootLinkType
  loggedUser?: JwtUser | false
  onAssistanceClick: () => void
  onDocumentationClick: () => void
  onLogin?: () => void
  onLogout?: () => void
  userActions?: Array<UserAction>
  enableDropdown?: boolean
  enableLogin?: boolean
  enableDocumentationButton?: boolean
  enableAssistanceButton?: boolean
}

const HeaderAccount = ({
  rootLink,
  loggedUser,
  userActions,
  onAssistanceClick,
  onDocumentationClick,
  onLogout,
  onLogin,
  enableDropdown = false,
  enableLogin = true,
  enableDocumentationButton = true,
  enableAssistanceButton = true,
}: HeaderAccountProps) => (
  <Stack
    component="div"
    justifyContent="center"
    sx={{
      borderBottom: 1,
      borderColor: 'divider',
      backgroundColor: 'background.paper',
      minHeight: '48px',
    }}
  >
    <Container maxWidth={false}>
      <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="center">
        {rootLink && (
          <ButtonNaked
            component="a"
            size="small"
            aria-label={rootLink?.ariaLabel}
            href={rootLink?.href}
            target="_blank"
            rel="noreferrer"
            title={rootLink?.title}
            sx={{ fontWeight: 'bold' }}
          >
            {rootLink?.label}
          </ButtonNaked>
        )}

        <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 3, md: 4 }}>
          {/* START Documentation MOBILE/DESKTOP */}
          {enableDocumentationButton && (
            <>
              <ButtonNaked
                size="small"
                component="button"
                onClick={onDocumentationClick}
                startIcon={<DescriptionIcon />}
                sx={{ display: ['none', 'flex'] }}
                weight="default"
              >
                Documentazione
              </ButtonNaked>
              <IconButton
                size="small"
                aria-label="Documentazione"
                sx={{ display: ['flex', 'none'] }}
                onClick={onDocumentationClick}
              >
                <DescriptionIcon fontSize="inherit" />
              </IconButton>
            </>
          )}
          {/* END Documentation MOBILE/DESKTOP */}

          {/* START Assistance MOBILE/DESKTOP */}
          {enableAssistanceButton && (
            <>
              <ButtonNaked
                size="small"
                component="button"
                onClick={onAssistanceClick}
                startIcon={<HelpOutlineIcon />}
                sx={{ display: ['none', 'flex'] }}
                weight="default"
              >
                Assistenza
              </ButtonNaked>
              <IconButton
                size="small"
                aria-label="Assistenza"
                sx={{ display: ['flex', 'none'] }}
                onClick={onAssistanceClick}
              >
                <HelpOutlineIcon fontSize="inherit" />
              </IconButton>
            </>
          )}
          {/* END Assistance MOBILE/DESKTOP */}

          {/* DIFFERENT COMBINATIONS */}

          {/* 1. Logged User with Dropdown */}
          {enableLogin && loggedUser && enableDropdown && (
            <AccountDropdown user={loggedUser} userActions={userActions} />
          )}

          {/* 2. Logged User with Logout CTA */}
          {enableLogin && loggedUser && !enableDropdown && (
            <Button variant="text" size="small" onClick={onLogout} title="Esci">
              Esci
            </Button>
          )}

          {/* 3. User not logged with Login CTA */}
          {enableLogin && !loggedUser && (
            <Button variant="contained" size="small" onClick={onLogin} title="Accedi">
              Accedi
            </Button>
          )}
        </Stack>
      </Stack>
    </Container>
  </Stack>
)
