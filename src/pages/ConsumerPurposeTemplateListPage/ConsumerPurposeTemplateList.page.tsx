import { AuthHooks } from '@/api/auth'
import type { ActionItemButton } from '@/types/common.types'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import { PageContainer } from '@/components/layout/containers'
import { useFilters, Filters, usePagination, Pagination } from '@pagopa/interop-fe-commons'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type { GetProducerEServicesParams } from '@/api/api.generatedTypes'
import {
  ConsumerPurposeTemplateTable,
  ConsumerPurposeTemplateTableSkeleton,
} from './components/ConsumerPurposeTemplateTable'
import type { GetConsumerPurposeTemplatesParams } from '@/api/purposeTemplate/mockedResponses'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'

const ConsumerPurposeTemplateListPage: React.FC = () => {
  const { isAdmin, isOperatorAPI } = AuthHooks.useJwt()
  const { t } = useTranslation('pages', { keyPrefix: 'consumerPurposeTemplatesList' })
  const { t: tCommon } = useTranslation('common')
  const { t: tEServiceTemplate } = useTranslation('eserviceTemplate', { keyPrefix: 'list.filters' })
  const navigate = useNavigate()

  const topSideActions: Array<ActionItemButton> = [
    {
      action: () => navigate('PROVIDE_ESERVICE_TEMPLATE_CREATE'),
      label: tCommon('createNewBtn'),
      variant: 'contained',
      icon: PlusOneIcon,
    },
  ]

  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetProducerEServicesParams, 'limit' | 'offset'>
  >([{ name: 'q', label: tEServiceTemplate('nameField.label'), type: 'freetext' }])

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const queryParams = { ...paginationParams, ...filtersParams }
  const { data: totalPageCount = 0 } = useQuery({
    ...EServiceTemplateQueries.getProviderEServiceTemplatesList(queryParams),
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
      <PurposeTemplateTableWrapper params={queryParams} />
      <Pagination {...paginationProps} totalPages={totalPageCount} />
    </PageContainer>
  )
}

const PurposeTemplateTableWrapper: React.FC<{ params: GetConsumerPurposeTemplatesParams }> = ({
  params,
}) => {
  const { data, isFetching } = useQuery(PurposeTemplateQueries.getConsumerPurposeTemplatesList())

  if (!data && isFetching) return <ConsumerPurposeTemplateTableSkeleton />
  return <ConsumerPurposeTemplateTable purposeTemplates={data ?? []} />
}

export default ConsumerPurposeTemplateListPage
