import React, { useContext, useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DialogContext } from '../lib/context'
import { requiredValidationPattern } from '../lib/validation'
import { AttributeKey, CatalogAttribute } from '../../types'
import { StyledInputControlledAsyncAutocomplete } from '../components/Shared/StyledInputControlledAsyncAutocomplete'
import { StyledInputControlledCheckbox } from '../components/Shared/StyledInputControlledCheckbox'
import { StyledAccordion } from '../components/Shared/StyledAccordion'

type ExistingAttributeDialogProps = {
  add: any
  attributeKey: AttributeKey
}

export const useExistingAttributeDialog = ({ add, attributeKey }: ExistingAttributeDialogProps) => {
  const { setDialog } = useContext(DialogContext)

  const confirm = async (data: any) => {
    add(data.selection, data.verification)
    closeDialog()
  }

  const closeDialog = () => {
    setDialog(null)
  }

  const certifiedCondition = attributeKey === 'certified'
  const verifiedCondition = attributeKey === 'verified'

  const openDialog = () => {
    setDialog({
      title: 'Aggiungi attributo esistente',
      Contents: ({ control, errors, watch, getValues }: any) => {
        const [selected, setSelected] = useState([])
        const watchSelection = watch('selection')

        useEffect(() => {
          const { selection } = getValues()
          setSelected(selection)
        }, [watchSelection]) // eslint-disable-line react-hooks/exhaustive-deps

        return (
          <React.Fragment>
            <Typography>Se selezioni più di un attributo verrà trattato come "gruppo"</Typography>

            <Box sx={{ mt: 3 }}>
              <StyledInputControlledAsyncAutocomplete
                label="Attributi selezionati"
                multiple={true}
                defaultValue={[]}
                labelKey="name"
                placeholder="..."
                path={{ endpoint: 'ATTRIBUTES_GET_LIST' }}
                transformFn={(data: any) =>
                  data.attributes.filter(
                    (a: CatalogAttribute) => a.certified === certifiedCondition
                  )
                }
                name="selection"
                control={control}
                rules={{ required: requiredValidationPattern }}
                errors={errors}
              />

              {verifiedCondition && (
                <StyledInputControlledCheckbox
                  name="verification"
                  control={control}
                  rules={{}}
                  errors={errors}
                  options={[
                    { label: "Richiedi nuova convalida dell'attributo", value: 'attribute' },
                  ]}
                  inline={true}
                />
              )}
            </Box>

            {selected && !!(selected.length > 0) && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ mt: 0, mb: 1 }} fontWeight={600}>
                  Hai selezionato
                </Typography>
                <StyledAccordion
                  entries={selected.map(({ name, description }) => ({
                    summary: name,
                    details: description,
                  }))}
                />
              </Box>
            )}
          </React.Fragment>
        )
      },
      close: closeDialog,
      proceedCallback: confirm,
    })
  }

  return { openDialog }
}
