import React, { useContext, useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DialogContext } from '../lib/context'
import { requiredValidationPattern } from '../lib/validation'
import { AttributeKey, CatalogAttribute, CustomDialogContentsProps } from '../../types'
import { StyledInputControlledAsyncAutocomplete } from '../components/Shared/StyledInputControlledAsyncAutocomplete'
import { StyledInputControlledCheckbox } from '../components/Shared/StyledInputControlledCheckbox'
import { StyledAccordion } from '../components/Shared/StyledAccordion'
import { FieldValues, UseFormGetValues, UseFormWatch } from 'react-hook-form'

type ExistingAttributeDialogProps = {
  add: (attributeGroup: CatalogAttribute[], explicitAttributeVerification: boolean) => void
  attributeKey: AttributeKey
}

export const useExistingAttributeDialog = ({ add, attributeKey }: ExistingAttributeDialogProps) => {
  const { setDialog } = useContext(DialogContext)

  const confirm = async (data: {
    selection: CatalogAttribute[]
    verification: string | undefined
  }) => {
    add(data.selection, Boolean(data.verification))
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
      Contents: function Contents({
        control,
        errors,
        watch,
        getValues,
      }: CustomDialogContentsProps) {
        const sureWatch = watch as UseFormWatch<FieldValues>
        const sureGetValues = getValues as UseFormGetValues<FieldValues>

        const [selected, setSelected] = useState([])
        const watchSelection = sureWatch('selection')

        useEffect(() => {
          const { selection } = sureGetValues()
          setSelected(selection)
        }, [watchSelection]) // eslint-disable-line react-hooks/exhaustive-deps

        return (
          <React.Fragment>
            <Typography>Se selezioni più di un attributo verrà trattato come “gruppo”</Typography>

            <Box sx={{ mt: 3 }}>
              <StyledInputControlledAsyncAutocomplete
                label="Attributi selezionati"
                multiple={true}
                defaultValue={[]}
                labelKey="name"
                placeholder="..."
                path={{ endpoint: 'ATTRIBUTES_GET_LIST' }}
                transformFn={(data) =>
                  (data.attributes as CatalogAttribute[]).filter(
                    (a) => a.certified === certifiedCondition
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
                  sx={{ my: 0 }}
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
