import React from 'react'
import { useHistory } from 'react-router-dom'
import { useRoute } from '../hooks/useRoute'
import { goToLoginPage } from '../lib/router-utils'
import { useJwt } from '../hooks/useJwt'
import { useTranslation } from 'react-i18next'
import { LoadingTranslations } from './Shared/LoadingTranslations'
import { HeaderAccount, HeaderProduct } from '@pagopa/mui-italia'
import { pagoPaLink } from '../lib/constants'

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
  //         id: jwt.organization.id,
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
          history.push(routes.HELP.PATH)
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
        // partyId={jwt?.organization.id}
        // partyList={partyList}
      />
    </header>
  )
}
