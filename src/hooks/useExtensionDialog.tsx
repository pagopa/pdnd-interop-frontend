import React, { useContext, useEffect, useState } from 'react'
import { StyledInputTextArea } from '../components/Shared/StyledInputTextArea'
import { DialogContext } from '../lib/context'
import { useFeedback } from './useFeedback'

export const useExtensionDialog = () => {
  const { runFakeAction } = useFeedback()
  const { setDialog } = useContext(DialogContext)
  const [text, setText] = useState<string | undefined>(undefined)

  const updateText = (e: any) => {
    setText(e.target.value)
  }

  useEffect(() => {
    if (typeof text !== 'undefined') {
      openDialog()
    }
  }, [text]) // eslint-disable-line react-hooks/exhaustive-deps

  const askExtension = async (_: any) => {
    await runFakeAction('Richiedi estensione')
  }

  const openDialog = (_?: any) => {
    setDialog({
      title: "Richiedi estensione dell'e-service",
      children: (
        <React.Fragment>
          <p>
            Compila il form indicando i motivi per cui ritieni che il tuo ente abbia diritto di
            iscriversi all'e-service, completo di basi giuridiche e finalità. Una notifica sarà
            inviata all'ente erogatore del servizio
          </p>
          <StyledInputTextArea value={text || ''} onChange={updateText} />
        </React.Fragment>
      ),
      proceedCallback: askExtension,
      close: () => {
        setDialog(null)
        setText(undefined)
      },
      disabled: !text,
    })
  }

  return { openDialog }
}
