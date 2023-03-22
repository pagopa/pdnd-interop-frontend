import React from 'react'
import { Container, Button, Stack, IconButton } from '@mui/material'
import { useJwt } from '@/hooks/useJwt'
import { useNavigateRouter } from '@/router'
import { assistanceLink, documentationLink, pagoPaLink } from '@/config/constants'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import DescriptionIcon from '@mui/icons-material/Description'
import { AccountDropdown, ButtonNaked, HeaderProduct } from '@pagopa/mui-italia'
import { FE_LOGIN_URL, SELFCARE_BASE_URL, SELFCARE_INTEROP_PROD_ID } from '@/config/env'
import { PartyQueries } from '@/api/party/party.hooks'
import type { PartyItem } from '@/api/party/party.api.types'
import type { PartySwitchItem } from '@pagopa/mui-italia/dist/components/PartySwitch'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'

const getPartyList = (parties: Array<PartyItem> | undefined, t: TFunction<'common'>) => {
  const partyList: Array<PartySwitchItem> = []
  if (parties) {
    partyList.push(
      ...parties.map((party) => ({
        id: party.id,
        name: party.description,
        productRole: party.userProductRoles.map((role) => t(`userProductRole.${role}`)).join(', '),
      }))
    )
  }

  return partyList
}

export const Header = () => {
  const { navigate } = useNavigateRouter()
  const { t } = useTranslation('common')
  const { jwt } = useJwt()

  const queriesOptions = {
    suspense: false,
    useErrorBoundary: false,
    retry: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  }

  const { data: parties } = PartyQueries.useGetPartyList(queriesOptions)

  const partyList = getPartyList(parties, t)

  const headerAccountLoggedUser = jwt
    ? { id: jwt.uid, name: jwt.name, surname: jwt.family_name, email: '' }
    : undefined

  const goToLoginPage = () => {
    window.location.assign(FE_LOGIN_URL)
  }

  const handleSelectParty = (party: PartySwitchItem) => {
    window.location.assign(
      `${SELFCARE_BASE_URL}/token-exchange?institutionId=${party.id}&productId=${SELFCARE_INTEROP_PROD_ID}`
    )
  }

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
          window.open(assistanceLink)
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
        onSelectedParty={handleSelectParty}
        partyId={jwt?.selfcareId}
        partyList={partyList}
      />
    </header>
  )
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
  loggedUser?:
    | {
        id: string
        name?: string
        surname?: string
        email?: string
      }
    | false
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
