import React from 'react'
import { useHistory } from 'react-router-dom'
import { useRoute } from '../hooks/useRoute'
import { goToLoginPage } from '../lib/router-utils'
import { useJwt } from '../hooks/useJwt'
import { useTranslation } from 'react-i18next'
import { LoadingTranslations } from './Shared/LoadingTranslations'
import { HeaderProduct } from '@pagopa/mui-italia'
import { assistanceLink, documentationLink, pagoPaLink } from '../lib/constants'
import { HeaderAccount } from './HeaderAccount'

export const HeaderWrapper = () => {
  const history = useHistory()
  const { routes } = useRoute()
  const { jwt } = useJwt()
  const { /* t, */ ready } = useTranslation('common', { useSuspense: false })

  if (!ready) {
    return <LoadingTranslations />
  }

  const headerAccountLoggedUser = jwt
    ? { id: jwt.uid, name: jwt.name, surname: jwt.family_name, email: '' }
    : undefined

  // const partyList = jwt
  //   ? [
  //       {
  //         id: jwt.organizationId,
  //         name: jwt.organization.fiscal_code,
  //         productRole: t(`userProductRole.${jwt.organization.roles[0].role}`),
  //       },
  //     ]
  //   : []

  return (
    <header>
      <HeaderAccount
        rootLink={pagoPaLink}
        loggedUser={headerAccountLoggedUser}
        onLogin={goToLoginPage}
        onLogout={() => {
          history.push(routes.LOGOUT.PATH)
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
        // partyId={jwt?.organizationId}
        // partyList={partyList}
      />
    </header>
  )
}
