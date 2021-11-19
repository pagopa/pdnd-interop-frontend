import React from 'react'
import { TableCell, TableRow } from '@mui/material'
import { Box } from '@mui/system'
import { AttributeKey, CatalogAttribute, FrontendAttribute } from '../../types'
import { useNewAttributeDialog } from '../hooks/useNewAttributeDialog'
import { useExistingAttributeDialog } from '../hooks/useExistingAttributeDialog'
import { StyledButton } from './Shared/StyledButton'
import { TableWithLoader } from './Shared/TableWithLoader'

type EServiceAttributeGroupProps = {
  attributesGroup: FrontendAttribute[]
  canRequireVerification?: boolean
  canCreateNewAttributes?: boolean
  add: (attributeGroup: CatalogAttribute[], explicitAttributeVerification: boolean) => void
  remove: (attributeGroupToRemove: CatalogAttribute[]) => void
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
  const { openDialog: openCreateNewAttributeDialog } = useNewAttributeDialog({ attributeKey })
  const { openDialog: openExistingAttributeDialog } = useExistingAttributeDialog({
    attributeKey,
    add,
  })

  const headData = canRequireVerification
    ? ['nome attributo', 'convalida richiesta', '']
    : ['nome attributo', '']

  const wrapRemove = (attributes: CatalogAttribute[]) => () => {
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
