import React, { useContext, useEffect, useState } from 'react'
import { StyledInputTextArea } from '../components/StyledInputTextArea'
import { DialogContext } from '../lib/context'

type useExtensionDialogProps = {
  onProceedCallback: any
}

export const useExtensionDialog = ({ onProceedCallback }: useExtensionDialogProps) => {
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

  const openDialog = (_?: any) => {
    setDialog({
      title: "Richiedi estensione dell'e-service",
      description: (
        <React.Fragment>
          <p>
            Compila il form indicando i motivi per cui ritieni che il tuo ente abbia diritto di
            iscriversi all'e-service, completo di basi giuridiche e finalità. Una notifica sarà
            inviata all'ente erogatore del servizio
          </p>
          <StyledInputTextArea
            value={text || ''}
            onChange={updateText}
            height={200}
            className="mb-1"
          />
        </React.Fragment>
      ),
      proceedCallback: onProceedCallback,
      close: () => {
        setDialog(null)
        setText(undefined)
      },
      disabled: !text,
    })
  }

  return { openDialog }
}
