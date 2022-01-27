import React, { useContext } from 'react'
import { DialogContext } from '../lib/context'
import { requiredValidationPattern } from '../lib/validation'
import { useFeedback } from './useFeedback'
import { StyledInputControlledText } from '../components/Shared/StyledInputControlledText'
import { StyledInputControlledSelect } from '../components/Shared/StyledInputControlledSelect'
import { CustomDialogContentsProps } from '../../types'

type SecurityOperatorKeyDialogProps = {
  clientId: string
  operatorId: string
}

type NewPublicKey = {
  clientId: string
  use: 'SIG' | 'ENC'
  alg: string
  key: string
}

export const useSecurityOperatorKeyDialog = ({
  clientId,
  operatorId,
}: SecurityOperatorKeyDialogProps) => {
  const { runAction, forceRerenderCounter } = useFeedback()
  const { setDialog } = useContext(DialogContext)

  const openDialog = () => {
    setDialog({
      title: 'Carica nuova chiave pubblica',
      Contents: function Contents({ control, errors }: CustomDialogContentsProps) {
        return (
          <React.Fragment>
            <StyledInputControlledSelect
              name="alg"
              label="Seleziona algoritmo*"
              options={[{ label: 'RS256', value: 'RS256' }]}
              control={control}
              rules={{ required: requiredValidationPattern }}
              errors={errors}
              defaultValue="RS256"
            />

            <StyledInputControlledText
              name="key"
              label="Chiave pubblica*"
              control={control}
              rules={{ required: requiredValidationPattern }}
              errors={errors}
              multiline={true}
            />
          </React.Fragment>
        )
      },
      proceedCallback: async (data: { alg: string; key: string }) => {
        // Encode public key
        const dataToPost: NewPublicKey = { ...data, use: 'SIG', clientId }
        dataToPost.key = btoa(dataToPost.key)

        await runAction(
          {
            path: {
              endpoint: 'OPERATOR_SECURITY_KEYS_POST',
              endpointParams: { clientId, operatorId },
            },
            config: { data: [dataToPost] },
          },
          { suppressToast: false }
        )
      },
      close: () => {
        setDialog(null)
      },
      maxWidth: 'sm',
    })
  }

  return { openDialog, forceRerenderCounter }
}
