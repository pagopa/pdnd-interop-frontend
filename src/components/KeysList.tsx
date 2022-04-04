import React, { FunctionComponent, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { object, string } from 'yup'
import { ClientKind, SecurityOperatorKeysFormInputValues } from '../../types'
import { useFeedback } from '../hooks/useFeedback'
import { useUser } from '../hooks/useUser'
import { DialogContext, PartyContext } from '../lib/context'
import { getBits } from '../lib/router-utils'
import { StyledButton } from './Shared/StyledButton'
import { PageTopFilters } from './Shared/PageTopFilters'
import { TempFilters } from './TempFilters'
import { AsyncTableKey } from './Shared/AsyncTableKey'

type KeyToPostProps = SecurityOperatorKeysFormInputValues & {
  use: 'SIG'
  alg: 'RS256'
  operatorId: string
}

type KeysListProps = {
  clientKind?: ClientKind
}

export const KeysList: FunctionComponent<KeysListProps> = ({ clientKind = 'CONSUMER' }) => {
  const location = useLocation()
  const locationBits = getBits(location)
  const clientId = locationBits[locationBits.length - 1]
  const { setDialog } = useContext(DialogContext)
  const { party } = useContext(PartyContext)
  const { user } = useUser()
  const { runAction, forceRerenderCounter } = useFeedback()

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
      operatorId: user?.id as string,
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

  return (
    <React.Fragment>
      <PageTopFilters>
        <TempFilters />
        {party?.productInfo.role === 'security' && (
          <StyledButton variant="contained" size="small" onClick={openUploadKeyDialog}>
            + Aggiungi
          </StyledButton>
        )}
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
