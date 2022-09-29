import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { object, string } from 'yup'
import { ClientKind, SecurityOperatorKeysFormInputValues, SelfCareUser } from '../../types'
import { RunAction, useFeedback } from '../hooks/useFeedback'
import { DialogContext } from '../lib/context'
import { getBits } from '../lib/router-utils'
import { StyledButton } from './Shared/StyledButton'
import { PageTopFilters } from './Shared/PageTopFilters'
import { TempFilters } from './TempFilters'
import { AsyncTableKey } from './Shared/AsyncTableKey'
import { useTranslation } from 'react-i18next'
import { useJwt } from '../hooks/useJwt'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { fetchAllWithLogs } from '../lib/api-utils'
import { isFetchError } from '../lib/error-utils'
import { AxiosResponse } from 'axios'
import { Stack } from '@mui/material'
import { InfoTooltip } from '../components/Shared/InfoTooltip'

type KeyToPostProps = SecurityOperatorKeysFormInputValues & {
  use: 'SIG'
  alg: 'RS256'
}

type KeysListProps = {
  clientKind?: ClientKind
}

type AddBtnProps = {
  clientId: string
  runAction: RunAction
}

const AddBtn = ({ clientId, runAction }: AddBtnProps) => {
  const { setDialog } = useContext(DialogContext)
  const { t } = useTranslation(['key', 'common'])
  const { jwt, isOperatorSecurity, isAdmin } = useJwt()
  const { data: users } = useAsyncFetch<Array<SelfCareUser>>({
    path: { endpoint: 'OPERATOR_SECURITY_GET_LIST', endpointParams: { clientId } },
    config: { params: { productRoles: ['admin'] } },
  })
  const [usersId, setUsersId] = useState<Array<string>>([])

  useEffect(() => {
    async function asyncFetchCurrentUserId() {
      const responses = await fetchAllWithLogs(
        (users as Array<SelfCareUser>).map(({ relationshipId }) => ({
          path: {
            endpoint: 'OPERATOR_GET_SINGLE',
            endpointParams: { clientId, relationshipId },
          },
        }))
      )

      if (responses.every((r) => !isFetchError(r))) {
        setUsersId(responses.map((r) => (r as AxiosResponse).data.from))
      }
    }

    if (isAdmin && users && Boolean(users.length > 0)) {
      asyncFetchCurrentUserId()
    }
  }, [jwt, users]) // eslint-disable-line react-hooks/exhaustive-deps

  const uploadKeyFormInitialValues: SecurityOperatorKeysFormInputValues = { name: '', key: '' }
  const uploadKeyFormValidationSchema = object({
    name: string().required(),
    key: string().required(),
  })

  const uploadKey = async (data: SecurityOperatorKeysFormInputValues) => {
    // Encode public key
    const dataToPost: KeyToPostProps = {
      ...data,
      use: 'SIG',
      alg: 'RS256',
    }
    dataToPost.key = btoa(dataToPost.key.trim())

    await runAction({
      path: { endpoint: 'KEY_POST', endpointParams: { clientId } },
      config: { data: [dataToPost] },
    })
  }

  const openUploadKeyDialog = () => {
    setDialog({
      type: 'addSecurityOperatorKey',
      onSubmit: uploadKey,
      initialValues: uploadKeyFormInitialValues,
      validationSchema: uploadKeyFormValidationSchema,
    })
  }

  const isAdminInClient = Boolean(jwt && usersId.includes(jwt.uid))
  const canAddKey = isOperatorSecurity || (isAdmin && isAdminInClient)

  return (
    <Stack direction="row" spacing={1}>
      {isAdmin && !isAdminInClient && <InfoTooltip label={t('list.adminEnableInfo')} />}
      <StyledButton
        variant="contained"
        size="small"
        onClick={openUploadKeyDialog}
        disabled={!canAddKey}
      >
        {t('addBtn', { ns: 'common' })}
      </StyledButton>
    </Stack>
  )
}

export const KeysList: FunctionComponent<KeysListProps> = ({ clientKind = 'CONSUMER' }) => {
  const location = useLocation()
  const locationBits = getBits(location)
  const clientId = locationBits[locationBits.length - 1]
  const { runAction, forceRerenderCounter } = useFeedback()

  return (
    <React.Fragment>
      <PageTopFilters>
        <TempFilters />
        <AddBtn clientId={clientId} runAction={runAction} />
      </PageTopFilters>

      <AsyncTableKey
        forceRerenderCounter={forceRerenderCounter}
        runAction={runAction}
        clientId={clientId}
        clientKind={clientKind}
      />
    </React.Fragment>
  )
}
