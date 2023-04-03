import React from 'react'
import { useJwt } from '@/hooks/useJwt'
import { useNavigateRouter } from '@/router'
import { assistanceLink, documentationLink, pagoPaLink } from '@/config/constants'
import { HeaderAccount, HeaderProduct, type ProductSwitchItem } from '@pagopa/mui-italia'
import { FE_LOGIN_URL, SELFCARE_BASE_URL, SELFCARE_INTEROP_PROD_ID, STAGE } from '@/config/env'
import { PartyQueries } from '@/api/party/party.hooks'
import type { PartySwitchItem } from '@pagopa/mui-italia/dist/components/PartySwitch'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { SelfcareInstitution } from '@/api/api.generatedTypes'
import type { UserProductRole } from '@/types/party.types'

const getPartyList = (parties: Array<SelfcareInstitution> | undefined, t: TFunction<'common'>) => {
  const partyList: Array<PartySwitchItem> = []
  if (parties) {
    partyList.push(
      ...parties.map((party) => ({
        id: party.id,
        name: party.description,
        productRole: (party.userProductRoles as Array<UserProductRole>)
          .map((role) => t(`userProductRole.${role}`))
          .join(', '),
      }))
    )
  }

  return partyList
}

const getProductList = (products?: Array<{ id: string; name: string }>): ProductSwitchItem[] => {
  const selfcareProduct: ProductSwitchItem = {
    id: 'selfcare',
    title: 'Area Riservata',
    productUrl: '',
    linkType: 'internal',
  }

  const interopProduct: ProductSwitchItem = {
    id: SELFCARE_INTEROP_PROD_ID,
    title: `Interoperabilità${STAGE === 'TEST' ? ' Collaudo' : ''}`,
    productUrl: '',
    linkType: 'internal',
  }

  if (!products) return [selfcareProduct, interopProduct]

  const productsFromBE: ProductSwitchItem[] = products.map((product) => ({
    id: product.id,
    title: product.name,
    productUrl: '',
    linkType: 'internal',
  }))

  return [selfcareProduct, ...productsFromBE]
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
  const { data: products } = PartyQueries.useGetProducts(queriesOptions)
  const partyList = getPartyList(parties, t)
  const productList = getProductList(products)

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

  const selfcareId = jwt?.selfcareId

  const handleSelectProduct = (product: ProductSwitchItem) => {
    if (!selfcareId) return

    if (product.id === 'selfcare') {
      window.location.assign(`${SELFCARE_BASE_URL}/dashboard/${selfcareId}`)
      return
    }

    window.location.assign(
      `${SELFCARE_BASE_URL}/token-exchange?institutionId=${selfcareId}&productId=${product.id}`
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
        // force re-render when selfcareId changes to solve a bug with the ProductSwitch component from mui-italia
        // must be removed when the bug is fixed
        key={jwt?.selfcareId}
        onSelectedParty={handleSelectParty}
        onSelectedProduct={handleSelectProduct}
        partyId={selfcareId}
        productId={SELFCARE_INTEROP_PROD_ID}
        productsList={productList}
        partyList={partyList}
      />
    </header>
  )
}
