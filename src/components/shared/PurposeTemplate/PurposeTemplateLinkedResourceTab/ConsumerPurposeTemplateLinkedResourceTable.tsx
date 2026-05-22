import {
  Filters,
  Pagination,
  Table,
  TableRow,
  useAutocompleteTextInput,
  useFilters,
  usePagination,
} from '@pagopa/interop-fe-commons'
import React from 'react'
import { Alert, Skeleton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { EServiceQueries } from '@/api/eservice'
import { Link } from '@/router'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { NotFoundError } from '@/utils/errors.utils'
import type {
  GetPurposeTemplateLinkableResourcesParams,
  LinkableResource,
  PurposeTemplateWithCompactCreator,
} from '@/api/api.generatedTypes'

type ConsumerPurposeTemplateLinkedResourceTableProps = {
  purposeTemplate: PurposeTemplateWithCompactCreator
}

export const ConsumerPurposeTemplateLinkedResourceTable: React.FC<
  ConsumerPurposeTemplateLinkedResourceTableProps
> = ({ purposeTemplate }) => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'read.linkedResourcesTab' })

  const [producersAutocompleteInput, setProducersAutocompleteInput] = useAutocompleteTextInput()

  const { data: producersOptions = [] } = useQuery({
    ...EServiceQueries.getProducers({ offset: 0, limit: 50, q: producersAutocompleteInput }),
    placeholderData: keepPreviousData,
    select: (data) =>
      data.results.map((o) => ({
        label: o.name,
        value: o.id,
      })),
  })

  const { paginationParams, paginationProps, getTotalPageCount, rowPerPageOptions } =
    usePagination()

  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetPurposeTemplateLinkableResourcesParams, 'limit' | 'offset' | 'purposeTemplateId'>
  >([
    { name: 'q', label: t('filters.resourceField.label'), type: 'freetext' },
    {
      name: 'publisherIds',
      label: t('filters.providerField.label'),
      type: 'autocomplete-multiple',
      options: producersOptions,
      onTextInputChange: setProducersAutocompleteInput,
    },
  ])

  const queryParams = {
    ...paginationParams,
    ...filtersParams,
  }

  const { data: linkableResources, error, isFetching } = useQuery({
    ...PurposeTemplateQueries.getLinkableResources(purposeTemplate.id, queryParams),
    placeholderData: keepPreviousData,
  })

  if (error instanceof NotFoundError) {
    return <Alert severity="warning">{t('orphanLinkedResources')}</Alert>
  }

  const headLabels = [
    t('linkedResourceName'),
    t('linkedResourceKind'),
    t('linkedResourceProviderName'),
    '',
  ]
  const isEmpty = linkableResources === undefined || linkableResources.results.length === 0

  if (isFetching && linkableResources === undefined) {
    return <ConsumerPurposeTemplateLinkedResourceTableSkeleton />
  }

  return (
    <>
      <Filters {...filtersHandlers} />
      <Table headLabels={headLabels} isEmpty={isEmpty}>
        {linkableResources!.results.map((resource, idx) => (
          <ConsumerPurposeTemplateLinkedResourceTableRow
            key={`${resource.resourceKind}:${getResourceId(resource)}:${idx}`}
            resource={resource}
          />
        ))}
      </Table>
      <Pagination
        {...paginationProps}
        rowPerPageOptions={rowPerPageOptions}
        totalPages={getTotalPageCount(linkableResources!.pagination.totalCount)}
      />
    </>
  )
}

function getResourceId(resource: LinkableResource): string {
  return match(resource)
    .with({ resourceKind: 'ESERVICE' }, (r) => r.eservice.id)
    .with({ resourceKind: 'ESERVICE_TEMPLATE' }, (r) => r.eserviceTemplate.id)
    .exhaustive()
}

type RowProps = { resource: LinkableResource }

const ConsumerPurposeTemplateLinkedResourceTableRow: React.FC<RowProps> = ({ resource }) => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'read.linkedResourcesTab' })
  const { t: tCommon } = useTranslation('common')

  return match(resource)
    .with({ resourceKind: 'ESERVICE' }, (r) => (
      <TableRow cellData={[r.eservice.name, t('kind.eservice'), r.eservice.producer.name]}>
        <Link
          as="button"
          to="SUBSCRIBE_CATALOG_VIEW"
          params={{
            eserviceId: r.eservice.id,
            descriptorId: r.descriptor.id,
          }}
          variant="outlined"
          size="small"
        >
          {tCommon('actions.inspect')}
        </Link>
      </TableRow>
    ))
    .with({ resourceKind: 'ESERVICE_TEMPLATE' }, (r) => (
      <TableRow
        cellData={[
          r.eserviceTemplate.name,
          t('kind.eserviceTemplate'),
          r.eserviceTemplate.creator.name,
        ]}
      >
        <Link
          as="button"
          to="SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS"
          params={{
            eServiceTemplateId: r.eserviceTemplate.id,
            eServiceTemplateVersionId: r.eserviceTemplateVersion.id,
          }}
          variant="outlined"
          size="small"
        >
          {tCommon('actions.inspect')}
        </Link>
      </TableRow>
    ))
    .exhaustive()
}

export const ConsumerPurposeTemplateLinkedResourceTableSkeleton: React.FC = () => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'read.linkedResourcesTab' })

  const headLabels = [
    t('linkedResourceName'),
    t('linkedResourceKind'),
    t('linkedResourceProviderName'),
    '',
  ]
  return (
    <Table headLabels={headLabels}>
      <TableRow cellData={[<Skeleton key={0} width={120} />]}>
        <ButtonSkeleton size="small" width={103} />
      </TableRow>
      <TableRow cellData={[<Skeleton key={0} width={120} />]}>
        <ButtonSkeleton size="small" width={103} />
      </TableRow>
      <TableRow cellData={[<Skeleton key={0} width={120} />]}>
        <ButtonSkeleton size="small" width={103} />
      </TableRow>
    </Table>
  )
}
