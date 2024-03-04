import React from 'react'
import { useNavigate } from '@/router'
import { assistanceLink, documentationLink, pagoPaLink } from '@/config/constants'
import { HeaderAccount, HeaderProduct, type ProductSwitchItem } from '@pagopa/mui-italia'
import { FE_LOGIN_URL, SELFCARE_BASE_URL, SELFCARE_INTEROP_PROD_ID, STAGE } from '@/config/env'
import { PartyQueries } from '@/api/party/party.hooks'
import type { PartySwitchItem } from '@pagopa/mui-italia/dist/components/PartySwitch'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { SelfcareInstitution } from '@/api/api.generatedTypes'
import type { JwtUser, UserProductRole } from '@/types/party.types'
import { UnauthorizedError } from '@/utils/errors.utils'
import { AuthHooks } from '@/api/auth'

/**
 * Generate the party list to be used in the HeaderProduct component to show the party switcher
 * If the parties list is not available, it will use the jwt to generate the party list containing only the active party
 */
const getPartyList = (
  parties: Array<SelfcareInstitution> | undefined,
  jwt: JwtUser | undefined,
  t: TFunction<'common'>
): PartySwitchItem[] => {
  const generatePartyItem = (party: SelfcareInstitution) => ({
    id: party.id,
    name: party.description,
    productRole: (party.userProductRoles as Array<UserProductRole>)
      .map((role) => t(`userProductRole.${role}`))
      .join(', '),
    parentName: party.parent,
  })

  if (parties && parties.length > 0) {
    return parties.map(generatePartyItem)
  }

  if (jwt) {
    return [
      generatePartyItem({
        id: jwt.selfcareId,
        description: jwt.organization.name,
        userProductRoles: jwt.organization.roles.map((r) => r.role),
        parent: jwt.rootParent?.description,
      }),
    ]
  }

  return []
}

/**
 * Generate the product list to be used in the HeaderProduct component to show the product switcher
 * If the products list is not available, it will return the default product list containing only
 * selfcare's Aria Riservata and interoperability products
 */
const getProductList = (products?: Array<{ id: string; name: string }>): ProductSwitchItem[] => {
  const selfcareProduct: ProductSwitchItem = {
    id: 'selfcare',
    title: 'Area Riservata',
    productUrl: '',
    linkType: 'internal',
  }

  const interopProduct: ProductSwitchItem = {
    id: SELFCARE_INTEROP_PROD_ID,
    title: `Interoperabilità${STAGE === 'UAT' ? ' Collaudo' : ''}`,
    productUrl: '',
    linkType: 'internal',
  }

  if (!products || products.length === 0) return [selfcareProduct, interopProduct]

  const productsFromBE: ProductSwitchItem[] = products.map((product) => ({
    id: product.id,
    title: product.name,
    productUrl: '',
    linkType: 'internal',
  }))

  return [selfcareProduct, ...productsFromBE]
}

export const Header: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('shared-components', { keyPrefix: 'header' })
  const { t: tCommon } = useTranslation('common')
  const { jwt, isSupport } = AuthHooks.useJwt()

  const queriesOptions = {
    suspense: false,
    useErrorBoundary: (error: unknown) => error instanceof UnauthorizedError,
    retry: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  }

  const { data: parties } = PartyQueries.useGetPartyList(queriesOptions)
  const { data: products } = PartyQueries.useGetProducts(queriesOptions)

  const partyList = getPartyList(parties, jwt, tCommon)
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

  const headerChipProps = isSupport
    ? ({ chipLabel: t('supportChipLabel'), color: 'primary' } as const)
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
          window.open(assistanceLink, '_blank')
        }}
        onDocumentationClick={() => {
          window.open(documentationLink, '_blank')
        }}
        enableAssistanceButton={STAGE === 'UAT' || STAGE === 'PROD'}
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
        {...headerChipProps}
      />
    </header>
  )
}
