import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { assistanceLink, documentationLink, pagoPaLink } from '@/config/constants'
import { HeaderAccount, HeaderProduct, type ProductSwitchItem } from '@pagopa/mui-italia'
import { FE_LOGIN_URL, SELFCARE_BASE_URL, STAGE } from '@/config/env'
import { getPartyListQueryOptions, getProductsQueryOptions } from '@/api/party/party.hooks'
import type { PartySwitchItem } from '@pagopa/mui-italia/dist/components/PartySwitch'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import type { SelfcareInstitution } from '@/api/api.generatedTypes'
import type { JwtUser, UserProductRole } from '@/types/party.types'
import { getCurrentSelfCareProductId } from '@/utils/common.utils'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/stores'

/**
 * Generate the party list to be used in the HeaderProduct component to show the party switcher
 * If the parties list is not available, it will use the jwt to generate the party list containing only the active party
 */
const getPartyList = (
  parties: Array<SelfcareInstitution> | undefined,
  user: JwtUser | null,
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
    /**
     * Since mui-italia's HeaderProduct component can't handle the case where the active party is not in the party list,
     * we add it manually to the list if it's not already there.
     * This is a workaround to avoid the crash, waiting for a proper solution from the api.
     */
    const doesIncludeActiveParty = parties?.some((party) => party.id === user?.selfcareId)
    if (!doesIncludeActiveParty && user) {
      return [
        ...parties.map(generatePartyItem),
        generatePartyItem({
          id: user.selfcareId,
          description: user.organization.name,
          userProductRoles: user.organization.roles.map((r) => r.role),
          parent: user.rootParent?.description,
        }),
      ]
    }
    return parties.map(generatePartyItem)
  }

  // If the parties list is not available, generate the party list using the jwt
  if (user) {
    return [
      generatePartyItem({
        id: user.selfcareId,
        description: user.organization.name,
        userProductRoles: user.organization.roles.map((r) => r.role),
        parent: user.rootParent?.description,
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
    id: getCurrentSelfCareProductId(),
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

const _Header: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('shared-components', { keyPrefix: 'header' })
  const { t: tCommon } = useTranslation('common')

  const { isAuthenticated, user } = useAuth()

  const { data: parties } = useQuery({ ...getPartyListQueryOptions(), enabled: isAuthenticated })
  const { data: products } = useQuery({ ...getProductsQueryOptions(), enabled: isAuthenticated })

  const partyList = getPartyList(parties, user, tCommon)
  const productList = getProductList(products)

  const headerAccountLoggedUser = user
    ? { id: user.uid, name: user.name, surname: user.family_name, email: '' }
    : undefined

  const goToLoginPage = () => {
    window.location.assign(FE_LOGIN_URL)
  }

  const handleSelectParty = (party: PartySwitchItem) => {
    window.location.assign(
      `${SELFCARE_BASE_URL}/token-exchange?institutionId=${
        party.id
      }&productId=${getCurrentSelfCareProductId()}`
    )
  }

  const selfcareId = user?.selfcareId

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

  const headerChipProps = user?.isSupport
    ? ({ chipLabel: t('supportChipLabel'), color: 'primary' } as const)
    : undefined

  return (
    <header>
      <HeaderAccount
        rootLink={pagoPaLink}
        loggedUser={headerAccountLoggedUser}
        onLogin={goToLoginPage}
        onLogout={() => {
          navigate({ to: '/' })
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
        key={user?.selfcareId}
        onSelectedParty={handleSelectParty}
        onSelectedProduct={handleSelectProduct}
        partyId={selfcareId}
        productId={getCurrentSelfCareProductId()}
        productsList={productList}
        partyList={partyList}
        {...headerChipProps}
      />
    </header>
  )
}

export const Header = React.memo(_Header)
