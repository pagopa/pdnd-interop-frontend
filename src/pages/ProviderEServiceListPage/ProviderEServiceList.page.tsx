import React from 'react'
import { useTranslation } from 'react-i18next'
import { EServiceTable, EServiceTableSkeleton } from './components'
import { PageContainer } from '@/components/layout/containers'
import { useNavigate } from '@/router'
import { EServiceQueries } from '@/api/eservice'
import {
  Filters,
  Pagination,
  useAutocompleteTextInput,
  useFilters,
  usePagination,
} from '@pagopa/interop-fe-commons'
import type { GetProducerEServicesParams } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import type { ActionItemButton } from '@/types/common.types'
import { useDrawerState } from '@/hooks/useDrawerState'
import { ProviderEServiceImportVersionDrawer } from './components/ProviderEServiceImportVersionDrawer'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

const ProviderEServiceListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'providerEServiceList' })
  const { t: tCommon } = useTranslation('common')
  const { t: tEservice } = useTranslation('eservice', { keyPrefix: 'list.filters' })
  const navigate = useNavigate()
  const { isAdmin, isOperatorAPI } = AuthHooks.useJwt()
  const [consumersAutocompleteInput, setConsumersAutocompleteInput] = useAutocompleteTextInput('')

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const { data: consumersOptions = [] } = useQuery({
    ...EServiceQueries.getConsumers({ offset: 0, limit: 50, q: consumersAutocompleteInput }),
    placeholderData: keepPreviousData,
    select: ({ results }) =>
      results.map((o) => ({
        label: o.name,
        value: o.id,
      })),
  })

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetProducerEServicesParams, 'limit' | 'offset'>
  >([
    { name: 'q', label: tEservice('nameField.label'), type: 'freetext' },
    {
      name: 'consumersIds',
      label: tEservice('consumerField.label'),
      type: 'autocomplete-multiple',
      options: consumersOptions,
      onTextInputChange: setConsumersAutocompleteInput,
    },
  ])

  const queryParams = { ...paginationParams, ...filtersParams }

  const topSideActions: Array<ActionItemButton> = [
    {
      action: openDrawer,
      label: tCommon('actions.import'),
      variant: 'outlined',
      icon: UploadFileIcon,
    },
    {
      action: () => navigate('PROVIDE_ESERVICE_CREATE'),
      label: tCommon('createNewBtn'),
      variant: 'contained',
      icon: PlusOneIcon,
    },
  ]

  const { data: totalPageCount = 0 } = useQuery({
    ...EServiceQueries.getProviderList(queryParams),
    placeholderData: keepPreviousData,
    select: ({ pagination }) => getTotalPageCount(pagination.totalCount),
  })

  return (
    <PageContainer
      title={t('title')}
      description={t('description')}
      topSideActions={isAdmin || isOperatorAPI ? topSideActions : undefined}
    >
      <Filters {...filtersHandlers} />
      <EServiceTableWrapper params={queryParams} />
      <Pagination {...paginationProps} totalPages={totalPageCount} />
      <ProviderEServiceImportVersionDrawer isOpen={isOpen} onClose={closeDrawer} />
    </PageContainer>
  )
}

const EServiceTableWrapper: React.FC<{ params: GetProducerEServicesParams }> = ({ params }) => {
  const { data, isFetching } = useQuery(EServiceQueries.getProviderList(params))

  if (!data && isFetching) return <EServiceTableSkeleton />
  return <EServiceTable eservices={data?.results ?? []} />
}

export default ProviderEServiceListPage
