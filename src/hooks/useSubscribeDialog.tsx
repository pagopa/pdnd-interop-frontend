import React, { useContext, useEffect, useState } from 'react'
import { StyledInputCheckbox } from '../components/StyledInputCheckbox'
import { StyledInputTextArea } from '../components/StyledInputTextArea'
import { DialogContext } from '../lib/context'

type UseSubscribeDialogProps = {
  onProceedCallback: any
}

export const useSubscribeDialog = ({ onProceedCallback }: UseSubscribeDialogProps) => {
  const { setDialog } = useContext(DialogContext)
  const [checked, setChecked] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (typeof checked !== 'undefined') {
      openDialog()
    }
  }, [checked]) // eslint-disable-line react-hooks/exhaustive-deps

  const openDialog = (_?: any) => {
    setDialog({
      title: "Iscriviti all'e-service",
      description: (
        <React.Fragment>
          <p>
            Spunta la checkbox per confermare che accetti i termini dell'accordo di
            interoperabilità.
          </p>
          <StyledInputTextArea
            value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet leo sed magna pellentesque aliquet sed at libero. Suspendisse potenti. Aenean accumsan pretium ullamcorper. Duis tincidunt est sit amet facilisis consequat. Duis hendrerit quis velit sit amet euismod. Vivamus sit amet diam efficitur, faucibus nisi efficitur, iaculis nisi. Maecenas eu eros sed velit tincidunt gravida id et leo. Nullam elementum augue vitae turpis condimentum, ac dapibus ex pretium. Quisque tincidunt turpis malesuada risus auctor, id porttitor neque sagittis. Nam at nunc id enim feugiat consequat. Proin fringilla, felis sit amet accumsan convallis, sapien elit ultricies tortor, quis vehicula risus tellus in purus. Nulla facilisi. Integer sit amet ante nibh. Donec eu nisl tempor nisi feugiat rutrum. Sed ante ex, tristique in purus in, bibendum finibus mi. Nullam placerat, diam eget scelerisque rhoncus, orci arcu ullamcorper sem, sed imperdiet odio nibh at ipsum. Fusce fringilla ante massa, vitae lobortis sem sagittis nec. Nunc non erat id dui tristique malesuada. Donec odio nisl, ullamcorper id viverra vitae, convallis eu urna. Nam porttitor felis tellus, non feugiat lectus euismod at. Duis mauris neque, molestie vel odio non, aliquet lacinia metus. Etiam nec urna blandit, cursus leo at, gravida orci. Morbi euismod odio orci. Curabitur eros risus, viverra quis accumsan sed, semper in urna. Fusce vitae felis mollis,"
            height={200}
            readOnly={true}
            readOnlyBgWhite={true}
            className="mb-1"
          />
          <StyledInputCheckbox
            label="Ho letto l'accordo"
            id="agreement-confirm"
            checked={!!checked}
            onChange={() => {
              setChecked(!checked)
            }}
            className="mt-0"
          />
        </React.Fragment>
      ),
      proceedCallback: onProceedCallback,
      close: () => {
        setDialog(null)
        setChecked(undefined)
      },
      disabled: !checked,
    })
  }

  return { openDialog }
}
