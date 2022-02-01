import React, { useContext } from 'react'
import { TableCell, TableRow } from '@mui/material'
import { Box } from '@mui/system'
import { object, string } from 'yup'
import {
  AttributeKey,
  CatalogAttribute,
  DialogExistingAttributeProps,
  ExistingAttributeFormInputValues,
  FrontendAttribute,
  NewAttributeFormInputValues,
} from '../../types'
import { StyledButton } from './Shared/StyledButton'
import { TableWithLoader } from './Shared/TableWithLoader'
import { DialogContext } from '../lib/context'
import { useFeedback } from '../hooks/useFeedback'
import { useCloseDialog } from '../hooks/useCloseDialog'

type EServiceAttributeGroupProps = {
  attributesGroup: Array<FrontendAttribute>
  canRequireVerification?: boolean
  canCreateNewAttributes?: boolean
  add: (attributeGroup: Array<CatalogAttribute>, explicitAttributeVerification: boolean) => void
  remove: (attributeGroupToRemove: Array<CatalogAttribute>) => void
  attributeKey: AttributeKey
}

export function EServiceAttributeGroup({
  attributesGroup,
  canRequireVerification = false,
  canCreateNewAttributes = false,
  remove,
  add,
  attributeKey,
}: EServiceAttributeGroupProps) {
  const { setDialog } = useContext(DialogContext)
  const { runAction } = useFeedback()
  const { closeDialog } = useCloseDialog()

  const openCreateNewAttributeDialog = () => {
    const createNewAttributeInitialValues = { name: '', code: '', origin: '', description: '' }
    const createNewAttributeValidationSchema = object({
      name: string().required(),
      code: string().required(),
      origin: string().required(),
      description: string().required(),
    })

    const createNewAttribute = async (data: NewAttributeFormInputValues) => {
      const dataToPost = { ...data, certified: false }

      await runAction(
        { path: { endpoint: 'ATTRIBUTE_CREATE' }, config: { data: dataToPost } },
        { suppressToast: false }
      )
    }

    setDialog({
      type: 'newAttribute',
      attributeKey,
      onSubmit: createNewAttribute,
      initialValues: createNewAttributeInitialValues,
      validationSchema: createNewAttributeValidationSchema,
    })
  }

  const openExistingAttributeDialog = () => {
    const existingAttributeInitialValues: ExistingAttributeFormInputValues = {
      selected: [],
      verifiedCondition: {
        attribute: false,
      },
    }

    const addExistingAttributes = ({
      selected,
      verifiedCondition,
    }: ExistingAttributeFormInputValues) => {
      add(selected, Boolean(verifiedCondition?.attribute))
      closeDialog()
    }

    setDialog({
      type: 'existingAttribute',
      attributeKey,
      initialValues: existingAttributeInitialValues,
      onSubmit: addExistingAttributes,
    } as DialogExistingAttributeProps)
  }

  const headData = canRequireVerification
    ? ['nome attributo', 'convalida richiesta', '']
    : ['nome attributo', '']

  const wrapRemove = (attributes: Array<CatalogAttribute>) => () => {
    remove(attributes)
  }

  return (
    <React.Fragment>
      <TableWithLoader
        loadingText={null}
        headData={headData}
        data={attributesGroup}
        noDataLabel="Nessun attributo presente"
      >
        {attributesGroup.map(({ attributes, explicitAttributeVerification }, j) => {
          return (
            <TableRow key={j} sx={{ bgcolor: 'common.white' }}>
              <TableCell
                dangerouslySetInnerHTML={{
                  __html: attributes.map(({ name }) => name).join(' <em>oppure</em> '),
                }}
              />
              {canRequireVerification && (
                <TableCell>{explicitAttributeVerification ? 'Sì' : 'No'}</TableCell>
              )}
              <TableCell>
                <StyledButton onClick={wrapRemove(attributes)}>Elimina</StyledButton>
              </TableCell>
            </TableRow>
          )
        })}
      </TableWithLoader>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
        <StyledButton sx={{ mr: 2 }} variant="contained" onClick={openExistingAttributeDialog}>
          Aggiungi attributo o gruppo
        </StyledButton>

        {canCreateNewAttributes && (
          <StyledButton variant="outlined" onClick={openCreateNewAttributeDialog}>
            Crea nuovo attributo
          </StyledButton>
        )}
      </Box>
    </React.Fragment>
  )
}
