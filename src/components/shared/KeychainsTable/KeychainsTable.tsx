import { ClientQueries } from '@/api/client'
import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { KeychainsTableRow, KeychainsTableRowSkeleton } from './KeychainsTableRow'
import { Filters, Pagination, Table, useFilters, usePagination } from '@pagopa/interop-fe-commons'
import type { GetClientsParams } from '@/api/api.generatedTypes'

interface KeychainsTableProps {}

export const KeychainsTable: React.FC<KeychainsTableProps> = () => {
  const { t } = useTranslation('client', { keyPrefix: 'list.filters' })
  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const { filtersParams, ...handlers } = useFilters([
    { name: 'q', type: 'freetext', label: t('nameField.label') },
  ])

  const params = {
    ...filtersParams,
    ...paginationParams,
  }

  /*const { data: clients } = ClientQueries.useGetList(params, {
    keepPreviousData: true,
    suspense: false,
  })*/

  return (
    <>
      <Filters {...handlers} />
      <Suspense fallback={<KeychainsTableSkeleton />}>
        <KeychainsTableWrapper params={params} />
      </Suspense>
      <Pagination {...paginationProps} totalPages={3} />
    </>
  )
}

const KeychainsTableWrapper: React.FC<{
  params: GetClientsParams
}> = ({ params }) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'table.headData' })
  const { t } = useTranslation('client')
  //const { data: clients } = ClientQueries.useGetList(params)

  const headLabels = [tCommon('keychains'), '']
  //const isEmpty = clients && clients.results.length === 0

  return (
    <Table headLabels={headLabels} noDataLabel={t('noMultiDataLabel')}>
      <KeychainsTableRow />
    </Table>
  )
}

export const KeychainsTableSkeleton: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'table.headData' })
  const headLabels = [t('keychains'), '']
  return (
    <Table headLabels={headLabels}>
      <KeychainsTableRowSkeleton />
    </Table>
  )
}
