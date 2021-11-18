import React, { useContext } from 'react'
import { DialogContext } from '../lib/context'
import { requiredValidationPattern } from '../lib/validation'
import { ATTRIBUTE_TYPE_SINGULAR_LABEL } from '../config/labels'
import { useFeedback } from './useFeedback'
import { AttributeKey } from '../../types'
import { StyledInputControlledText } from '../components/Shared/StyledInputControlledText'

type NewAttribute = {
  name?: string
  code?: string // authId
  origin?: string // authName
  description?: string
  certified?: boolean
}

type NewAttributeDialogProps = { attributeKey: AttributeKey }

export const useNewAttributeDialog = ({ attributeKey }: NewAttributeDialogProps) => {
  const { runAction } = useFeedback()
  const { setDialog } = useContext(DialogContext)

  const create = async (data: Partial<NewAttribute>) => {
    const dataToPost = { ...data, certified: false }

    await runAction(
      { path: { endpoint: 'ATTRIBUTE_CREATE' }, config: { data: dataToPost } },
      { suppressToast: false }
    )
  }

  const openDialog = () => {
    setDialog({
      title: `Crea nuovo attributo ${ATTRIBUTE_TYPE_SINGULAR_LABEL[attributeKey]}`,
      Contents: function Contents({ control, errors }: any) {
        return (
          <React.Fragment>
            {[
              { id: 'name', label: "Nome dell'attributo", type: 'text' },
              { id: 'code', label: 'Id della fonte autoritativa', type: 'text' },
              { id: 'origin', label: 'Nome della fonte autoritativa', type: 'text' },
            ].map(({ id, label }, i) => {
              return (
                <StyledInputControlledText
                  focusOnMount={i === 0}
                  key={i}
                  name={id}
                  control={control}
                  rules={{ required: requiredValidationPattern }}
                  errors={errors}
                  label={label}
                />
              )
            })}

            <StyledInputControlledText
              name="description"
              control={control}
              rules={{ required: requiredValidationPattern }}
              errors={errors}
              label="Descrizione dell'attributo"
              multiline={true}
            />
          </React.Fragment>
        )
      },
      close: () => {
        setDialog(null)
      },
      proceedCallback: create,
    })
  }

  return { openDialog }
}
