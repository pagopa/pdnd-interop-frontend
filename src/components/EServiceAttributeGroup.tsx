import React, { useContext } from 'react'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
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
import { ButtonNaked } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('attributes')

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

      await runAction({ path: { endpoint: 'ATTRIBUTE_CREATE' }, config: { data: dataToPost } })
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
    ? [t('addAttributeTable.attributeName'), t('addAttributeTable.canRequireVerification'), '']
    : [t('addAttributeTable.attributeName'), '']

  const wrapRemove = (attributes: Array<CatalogAttribute>) => () => {
    remove(attributes)
  }

  return (
    <React.Fragment>
      <TableWithLoader
        isLoading={false}
        headData={headData}
        noDataLabel={t('addAttributeTable.noDataLabel')}
      >
        {Boolean(attributesGroup.length > 0) &&
          attributesGroup.map(({ attributes, explicitAttributeVerification }, j) => {
            const attributesLabel = {
              label: (
                <React.Fragment>
                  {attributes.map(({ name }, i) => {
                    if (i < attributes.length - 1) {
                      return (
                        <React.Fragment key={i}>
                          {name}{' '}
                          <Typography component="span" fontWeight={600}>
                            {t('addAttributeTable.groupOr')}
                          </Typography>{' '}
                        </React.Fragment>
                      )
                    }

                    return <React.Fragment key={i}>{name}</React.Fragment>
                  })}
                </React.Fragment>
              ),
            }

            const explicitAttributeVerificationLabel = {
              label: t(
                `addAttributeTable${
                  explicitAttributeVerification
                    ? 'explicitAttributeVerificationYes'
                    : 'explicitAttributeVerificationNo'
                }`
              ),
            }

            const cellData =
              attributeKey === 'verified'
                ? [attributesLabel, explicitAttributeVerificationLabel]
                : [attributesLabel]

            return (
              <StyledTableRow key={j} cellData={cellData}>
                {!disabled && (
                  <ButtonNaked onClick={wrapRemove(attributes)}>
                    <DeleteOutlineIcon fontSize="small" color="primary" />
                  </ButtonNaked>
                )}
              </StyledTableRow>
            )
          })}
      </TableWithLoader>

      {!disabled && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <StyledButton
            sx={{ mr: 2 }}
            size="small"
            variant="contained"
            onClick={openExistingAttributeDialog}
          >
            {t('addAttributeTable.addBtn')}
          </StyledButton>

          {canCreateNewAttributes && (
            <StyledButton size="small" variant="outlined" onClick={openCreateNewAttributeDialog}>
              {t('addAttributeTable.createBtn')}
            </StyledButton>
          )}
        </Box>
      )}
    </React.Fragment>
  )
}
