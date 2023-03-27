import React from 'react'
import { useJwt } from '@/hooks/useJwt'
import { useNavigateRouter } from '@/router'
import { assistanceLink, documentationLink, pagoPaLink } from '@/config/constants'
import { HeaderAccount, HeaderProduct } from '@pagopa/mui-italia'
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
