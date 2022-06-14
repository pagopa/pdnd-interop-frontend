import React from 'react'
import { Header } from './Header'
import { useHistory } from 'react-router-dom'
import { useRoute } from '../hooks/useRoute'
import { goToLoginPage } from '../lib/router-utils'
import { useJwt } from '../hooks/useJwt'
import { Settings as SettingsIcon } from '@mui/icons-material'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { LoadingTranslations } from './Shared/LoadingTranslations'

export const HeaderWrapper = () => {
  const history = useHistory()
  const { routes } = useRoute()
  const { jwt } = useJwt()
  const { t, ready } = useTranslation('common', { useSuspense: false })

  if (!ready) {
    return <LoadingTranslations />
  }

  return (
    <Header
      onAssistanceClick={() => {
        history.push(routes.HELP.PATH)
      }}
      loggedUser={jwt}
      onLogin={goToLoginPage}
      subHeaderLeftComponent={
        <Typography component="span" variant="h5" fontWeight={700}>
          {t('productTitle')}
        </Typography>
      }
      subHeaderRightComponent={
        // doesRouteAllowTwoColumnsLayout(history.location) && party !== null ? (
        //   <PartySelect />
        // ) : null
        null
      }
      userActions={[
        {
          id: 'logout',
          label: 'Logout',
          onClick: () => {
            history.push(routes.LOGOUT.PATH)
          },
          icon: <SettingsIcon fontSize="small" color="inherit" sx={{ mr: 1 }} />,
        },
      ]}
    />
  )
}
