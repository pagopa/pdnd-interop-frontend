import React from 'react'
import { useHistory } from 'react-router-dom'
import { ClientPurpose } from '../../../types'
import { useRoute } from '../../hooks/useRoute'
import { buildDynamicPath } from '../../lib/router-utils'
import { StyledButton } from './StyledButton'
import { StyledTableRow } from './StyledTableRow'
import { TableWithLoader } from './TableWithLoader'

type TableVoucherProps = {
  purposes: Array<ClientPurpose>
  clientId: string
  isLoading: boolean
}

export const TableVoucher = ({ purposes, clientId, isLoading }: TableVoucherProps) => {
  const history = useHistory()
  const { routes } = useRoute()
  const headData = ['Nome finalità', 'Nome E-Service', 'Ente Erogatore', '']

  return (
    <TableWithLoader
      isLoading={isLoading}
      loadingText="Stiamo caricando le finalità"
      headData={headData}
      noDataLabel="Questo client non è associato a nessuna finalità"
      // error={axiosErrorToError(error)}
    >
      {purposes &&
        Boolean(purposes.length > 0) &&
        purposes.map((item, i) => {
          return (
            <StyledTableRow
              key={i}
              cellData={[
                { label: item.title },
                { label: item.agreement.eservice.name },
                { label: 'abc' },
              ]}
            >
              <StyledButton
                variant="outlined"
                size="small"
                onClick={() => {
                  history.push(
                    buildDynamicPath(routes.SUBSCRIBE_CLIENT_VOUCHER_READ.PATH, {
                      clientId,
                      purposeId: item.purposeId,
                    })
                  )
                  //
                }}
              >
                Ispeziona
              </StyledButton>
            </StyledTableRow>
          )
        })}
    </TableWithLoader>
  )
}
