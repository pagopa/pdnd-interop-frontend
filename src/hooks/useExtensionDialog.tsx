import React, { useContext } from 'react'
import { StyledInputControlledText } from '../components/Shared/StyledInputControlledText'
import { DialogContext } from '../lib/context'
import { requiredValidationPattern } from '../lib/validation'
import { useFeedback } from './useFeedback'

export const useExtensionDialog = () => {
  const { runFakeAction } = useFeedback()
  const { setDialog } = useContext(DialogContext)

  const askExtension = async (_: any) => {
    await runFakeAction('Richiedi estensione')
  }

  const openDialog = (_?: any) => {
    setDialog({
      title: "Richiedi estensione dell'e-service",
      Contents: ({ control, errors }: any) => {
        return (
          <React.Fragment>
            <p>
              Compila il form indicando i motivi per cui ritieni che il tuo ente abbia diritto di
              iscriversi all’e-service, completo di basi giuridiche e finalità. Una notifica sarà
              inviata all’ente erogatore del servizio
            </p>
            <StyledInputControlledText
              focusOnMount={true}
              name="reasons"
              control={control}
              errors={errors}
              rules={{ required: requiredValidationPattern }}
              multiline={true}
              rows={12}
            />
          </React.Fragment>
        )
      },
      proceedCallback: askExtension,
      close: () => {
        setDialog(null)
      },
    })
  }

  return { openDialog }
}
