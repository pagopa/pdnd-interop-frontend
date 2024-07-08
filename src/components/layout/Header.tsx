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
    /**
     * Since mui-italia's HeaderProduct component can't handle the case where the active party is not in the party list,
     * we add it manually to the list if it's not already there.
     * This is a workaround to avoid the crash, waiting for a proper solution from the api.
     */
    const doesIncludeActiveParty = parties?.some((party) => party.id === jwt?.selfcareId)
    if (!doesIncludeActiveParty && jwt) {
      return [
        ...parties.map(generatePartyItem),
        generatePartyItem({
          id: jwt.selfcareId,
          description: jwt.organization.name,
          userProductRoles: jwt.organization.roles.map((r) => r.role),
          parent: jwt.rootParent?.description,
        }),
      ]
    }
    return parties.map(generatePartyItem)
  }

  // If the parties list is not available, generate the party list using the jwt
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

type HeaderProps = {
  jwt?: JwtUser
  isSupport?: boolean
}

export const Header: React.FC<HeaderProps> = ({ jwt, isSupport }) => {
  const navigate = useNavigate()
  const { t } = useTranslation('shared-components', { keyPrefix: 'header' })
  const { t: tCommon } = useTranslation('common')

  const { data: parties } = useQuery({ ...getPartyListQueryOptions(), enabled: !!jwt })
  const { data: products } = useQuery({ ...getProductsQueryOptions(), enabled: !!jwt })

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
      `${SELFCARE_BASE_URL}/token-exchange?institutionId=${
        party.id
      }&productId=${getCurrentSelfCareProductId()}`
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
        key={jwt?.selfcareId}
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
