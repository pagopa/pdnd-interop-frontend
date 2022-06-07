import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { PublicKey, SelfCareUser } from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { buildDynamicPath, buildDynamicRoute, getBits } from '../lib/router-utils'
import { useMode } from '../hooks/useMode'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { fetchWithLogs } from '../lib/api-utils'
import { isFetchError } from '../lib/error-utils'
import { AxiosResponse } from 'axios'
import { StyledLink } from '../components/Shared/StyledLink'
import { useRoute } from '../hooks/useRoute'
import { LoadingWithMessage } from '../components/Shared/LoadingWithMessage'
import { NotFound } from './NotFound'
import { useTranslation } from 'react-i18next'
import { useJwt } from '../hooks/useJwt'

type UserEndpoinParams = {
  relationshipId: string
  clientId?: string
}

export function UserEdit() {
  const { t } = useTranslation(['user', 'common'])
  const { isAdmin } = useJwt()
  const { routes } = useRoute()
  const { runAction, forceRerenderCounter } = useFeedback()
  const mode = useMode()
  const bits = getBits(useLocation())
  const relationshipId = bits[bits.length - 1]
  const [keys, setKeys] = useState<Array<PublicKey>>([])

  let clientId: string | undefined = bits[bits.length - 3]
  const endpointParams: UserEndpoinParams = {
    clientId,
    relationshipId,
  }
  if (mode === 'provider') {
    clientId = undefined
  }

  const { data: userData, error } = useAsyncFetch<SelfCareUser>(
    { path: { endpoint: 'OPERATOR_GET_SINGLE', endpointParams } },
    { useEffectDeps: [forceRerenderCounter] }
  )

  useEffect(() => {
    async function asyncFetchKeyData(operatorId: string) {
      const response = await fetchWithLogs({
        path: {
          endpoint: 'OPERATOR_SECURITY_GET_KEYS_LIST',
          endpointParams: { clientId, operatorId },
        },
      })

      if (!isFetchError(response)) {
        setKeys((response as AxiosResponse).data.keys)
      }
    }

    // Fetch associated keys for security operators
    if (userData && userData.product.role === 'security') {
      asyncFetchKeyData(userData.from)
    }
  }, [userData]) // eslint-disable-line react-hooks/exhaustive-deps

  /*
   * List of possible actions for the user to perform
   */
  const removeFromClient = async () => {
    await runAction(
      {
        path: {
          endpoint: 'OPERATOR_SECURITY_REMOVE_FROM_CLIENT',
          endpointParams: { clientId, relationshipId: userData?.id },
        },
      },
      {
        onSuccessDestination: buildDynamicRoute(
          routes.SUBSCRIBE_CLIENT_EDIT,
          { clientId: clientId as string },
          { tab: 'securityOperators' }
        ),
        showConfirmDialog: true,
      }
    )
  }
  /*
   * End list of actions
   */

  const getAvailableActions = () => {
    if (mode === 'subscriber' && isAdmin) {
      const removeFromClientAction = {
        onClick: removeFromClient,
        label: t('actions.removeFromClient'),
      }

      return [removeFromClientAction]
    }

    return []
  }

  if (error) {
    return <NotFound errorType="serverError" />
  }

  return (
    <React.Fragment>
      <StyledIntro sx={{ mb: 0 }}>
        {{
          title:
            userData?.name && userData?.familyName
              ? userData.name + ' ' + userData.familyName
              : 'n/d',
        }}
      </StyledIntro>

      {userData ? (
        <React.Fragment>
          <DescriptionBlock label={t('edit.taxCodeField.label')}>
            <Typography component="span">{userData?.taxCode || 'n/d'}</Typography>
          </DescriptionBlock>

          <DescriptionBlock label={t('edit.roleField.label')}>
            <Typography component="span">
              {userData?.role ? t(`userRole.${userData.role}`, { ns: 'common' }) : 'n/d'}
            </Typography>
          </DescriptionBlock>

          <DescriptionBlock label={t('edit.productRoleField.label')}>
            <Typography component="span">
              {userData?.product.role
                ? t(`userProductRole.${userData.product.role}`, { ns: 'common' })
                : 'n/d'}
            </Typography>
          </DescriptionBlock>

          <DescriptionBlock label={t('edit.statusField.label')}>
            <Typography component="span">
              {userData?.state ? t(`status.user.${userData.state}`, { ns: 'common' }) : 'n/d'}
            </Typography>
          </DescriptionBlock>

          {userData?.product.role === 'security' && (
            <DescriptionBlock label={t('edit.associatedKeysField.label')}>
              {Boolean(keys.length > 0) ? (
                keys.map(({ key, name }, i) => (
                  <StyledLink
                    key={i}
                    to={buildDynamicPath(routes.SUBSCRIBE_CLIENT_KEY_EDIT.PATH, {
                      clientId,
                      kid: key.kid,
                    })}
                    sx={{ display: 'block' }}
                  >
                    {name}
                  </StyledLink>
                ))
              ) : (
                <Typography component="span">
                  {t('edit.associatedKeysField.noDataLabel')}
                </Typography>
              )}
            </DescriptionBlock>
          )}

          <Box sx={{ mt: 8, display: 'flex' }}>
            {getAvailableActions().map(({ onClick, label }, i) => (
              <StyledButton variant="contained" key={i} onClick={onClick}>
                {label}
              </StyledButton>
            ))}
          </Box>
        </React.Fragment>
      ) : (
        <LoadingWithMessage label={t('loadingSingleLabel')} transparentBackground />
      )}
    </React.Fragment>
  )
}
