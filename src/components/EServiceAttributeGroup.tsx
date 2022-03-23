import React, { useContext } from 'react'
import { Box } from '@mui/system'
import { mixed, object, string } from 'yup'
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
import { StyledTableRow } from './Shared/StyledTableRow'
import { DeleteOutline as DeleteOutlineIcon } from '@mui/icons-material'

type EServiceAttributeGroupProps = {
  attributesGroup: Array<FrontendAttribute>
  canRequireVerification?: boolean
  canCreateNewAttributes?: boolean
  add: (attributeGroup: Array<CatalogAttribute>, explicitAttributeVerification: boolean) => void
  remove: (attributeGroupToRemove: Array<CatalogAttribute>) => void
  attributeKey: AttributeKey
  disabled: boolean
}

export function EServiceAttributeGroup({
  attributesGroup,
  canRequireVerification = false,
  canCreateNewAttributes = false,
  remove,
  add,
  attributeKey,
  disabled,
}: EServiceAttributeGroupProps) {
  const { setDialog } = useContext(DialogContext)
  const { runAction } = useFeedback()
  const { closeDialog } = useCloseDialog()

  const openCreateNewAttributeDialog = () => {
    const createNewAttributeInitialValues = {
      name: '',
      code: '',
      origin: '',
      description: '',
      kind: attributeKey.toUpperCase(),
    }
    const createNewAttributeValidationSchema = object({
      name: string().required(),
      code: string().required(),
      origin: string().required(),
      description: string().required(),
      kind: mixed().oneOf(['CERTIFIED', 'VERIFIED', 'DECLARED']).required(),
    })

    const createNewAttribute = async (data: NewAttributeFormInputValues) => {
      const dataToPost = { ...data }

      await runAction(
        { path: { endpoint: 'ATTRIBUTE_CREATE' }, config: { data: dataToPost } },
        { suppressToast: false }
      )
    }

    setDialog({
      type: 'createNewAttribute',
      attributeKey,
      onSubmit: createNewAttribute,
      initialValues: createNewAttributeInitialValues,
      validationSchema: createNewAttributeValidationSchema,
    })
  }

  const openExistingAttributeDialog = () => {
    const existingAttributeInitialValues: ExistingAttributeFormInputValues = {
      selected: [],
      verifiedCondition: { attribute: true },
    }

    const addExistingAttributes = ({
      selected,
      verifiedCondition,
    }: ExistingAttributeFormInputValues) => {
      add(selected, Boolean(verifiedCondition?.attribute))
      closeDialog()
    }

    const selectedIds = attributesGroup.reduce<Array<string>>((acc, next) => {
      const ids = next.attributes.map((a) => a.id)
      return [...acc, ...ids]
    }, [])

    setDialog({
      type: 'addExistingAttribute',
      attributeKey,
      initialValues: existingAttributeInitialValues,
      selectedIds,
      onSubmit: addExistingAttributes,
    } as DialogExistingAttributeProps)
  }

  const headData = canRequireVerification
    ? ['Nome attributo', 'Convalida richiesta']
    : ['Nome attributo']

  const wrapRemove = (attributes: Array<CatalogAttribute>) => () => {
    remove(attributes)
  }

  return (
    <React.Fragment>
      <TableWithLoader
        loadingText={null}
        headData={headData}
        noDataLabel="Nessun attributo presente"
      >
        {Boolean(attributesGroup.length > 0) &&
          attributesGroup.map(({ attributes, explicitAttributeVerification }, j) => {
            const explicitAttributeVerificationLabel =
              attributeKey === 'verified'
                ? { label: explicitAttributeVerification ? 'Sì' : 'No' }
                : { label: '' }

            return (
              <StyledTableRow
                key={j}
                cellData={[
                  { label: attributes.map(({ name }) => name).join(' oppure ') },
                  explicitAttributeVerificationLabel,
                ]}
              >
                {!disabled && (
                  <StyledButton onClick={wrapRemove(attributes)}>
                    <DeleteOutlineIcon fontSize="small" color="primary" />
                  </StyledButton>
                )}
              </StyledTableRow>
            )
          })}
      </TableWithLoader>

      {!disabled && (
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
      )}
    </React.Fragment>
  )
}
