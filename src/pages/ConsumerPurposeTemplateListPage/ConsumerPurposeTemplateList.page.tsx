import { AuthHooks } from '@/api/auth'
import type { ActionItemButton } from '@/types/common.types'
import { useTranslation } from 'react-i18next'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { PageContainer } from '@/components/layout/containers'
import {
  useFilters,
  Filters,
  usePagination,
  Pagination,
  useAutocompleteTextInput,
} from '@pagopa/interop-fe-commons'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  ConsumerPurposeTemplateTable,
  ConsumerPurposeTemplateTableSkeleton,
} from './components/ConsumerPurposeTemplateTable'
import type { GetConsumerPurposeTemplatesParams } from '@/api/purposeTemplate/mockedResponses'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { useDialog } from '@/stores'
import { PurposeTemplateMutations } from '@/api/purposeTemplate/purposeTemplate.mutations'
import type { PurposeTemplateSeed } from '@/api/api.generatedTypes'
import { useNavigate } from '@/router'
import { EServiceQueries } from '@/api/eservice'

const ConsumerPurposeTemplateListPage: React.FC = () => {
  const { isAdmin, isOperatorAPI } = AuthHooks.useJwt()
  const { t } = useTranslation('pages', { keyPrefix: 'consumerPurposeTemplatesList' })
  const { t: tCommon } = useTranslation('common')
  const { t: tPurposeTemplate } = useTranslation('purposeTemplate', { keyPrefix: 'list.filters' })
  const navigate = useNavigate()

  const [eservicesAutocompleteInput, setEServicesAutocompleteInput] = useAutocompleteTextInput()

  const { mutate: createDraft } = PurposeTemplateMutations.useCreateDraft()

  const { openDialog } = useDialog()

  const handleCreateDraft = (params: PurposeTemplateSeed) => {
    createDraft(
      { ...params },
      {
        onSuccess() {
          navigate(/*'SUBSCRIBE_PURPOSE_TEMPLATE_EDIT'*/ 'NOT_FOUND') //TODO TO FIX WHEN ROUTE IS AVAILABLE
        },
      }
    )
  }

  const topSideActions: Array<ActionItemButton> = [
    {
      action: () =>
        openDialog({
          type: 'tenantKindPurposeTemplate',
          onConfirm: handleCreateDraft,
        }),
      label: tCommon('createNewBtn'),
      variant: 'contained',
      icon: PlusOneIcon,
    },
  ]

  const { data: eservicesOptions = [] } = useQuery({
    ...EServiceQueries.getCatalogList({
      q: eservicesAutocompleteInput,
      states: ['PUBLISHED'],
      limit: 50,
      offset: 0,
      isConsumerDelegable: true,
    }),
    placeholderData: keepPreviousData,
    select: ({ results }) =>
      results.map((o) => ({
        label: o.name,
        value: o.id,
      })),
  })

  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetConsumerPurposeTemplatesParams, 'limit' | 'offset'>
  >([
    { name: 'q', label: tPurposeTemplate('nameField.label'), type: 'freetext' },
    {
      name: 'eservicesIds',
      label: tPurposeTemplate('eserviceField.label'),
      type: 'autocomplete-multiple',
      options: eservicesOptions,
      onTextInputChange: setEServicesAutocompleteInput,
    },
    {
      name: 'states',
      label: tPurposeTemplate('statusField.label'),
      type: 'autocomplete-multiple',
      options: [
        { label: tPurposeTemplate('statusField.optionLabels.ARCHIVED'), value: 'ARCHIVED' },
        { label: tPurposeTemplate('statusField.optionLabels.ACTIVE'), value: 'ACTIVE' },
        { label: tPurposeTemplate('statusField.optionLabels.DRAFT'), value: 'DRAFT' },
        { label: tPurposeTemplate('statusField.optionLabels.SUSPENDED'), value: 'SUSPENDED' },
      ],
    },
  ])

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 10 })
  const queryParams = { ...paginationParams, ...filtersParams }
  // const { data: totalPageCount } = useQuery({ //TODO WHEN API IS READY
  //   ...PurposeTemplateQueries.getConsumerPurposeTemplatesList(queryParams),
  //   placeholderData: keepPreviousData,
  //   select: ({ pagination }) => getTotalPageCount(pagination.totalCount),
  // })

  const totalPageCount = 10 //TODO TO REMOVE

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
  const { data, isFetching } = useQuery(
    PurposeTemplateQueries.getConsumerPurposeTemplatesList(params)
  )

  if (!data && isFetching) return <ConsumerPurposeTemplateTableSkeleton />
  return (
    <ConsumerPurposeTemplateTable
      purposeTemplates={data ?? []}
      data-testid="purpose-template-table-component"
    />
  )
}

export default ConsumerPurposeTemplateListPage
