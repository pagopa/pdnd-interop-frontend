import { EServiceQueries } from '@/api/eservice'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from '@/router'
import { SectionContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { Filters, useAutocompleteTextInput, useFilters } from '@pagopa/interop-fe-commons'
import type { GetCatalogPurposeTemplatesParams } from '@/api/api.generatedTypes'

const ConsumerLinkedPurposeTemplatesTab: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.linkedPurposeTemplatesTab' })

  const [creatorsAutocompleteInput, setCreatorsAutocompleteInput] = useAutocompleteTextInput()

  const { data: creatorsOptions = [] } = useQuery({
    //TODO: REPLACE WHEN THE API IS AVAILABLE
    ...EServiceQueries.getProducers({ offset: 0, limit: 50, q: creatorsAutocompleteInput }),
    placeholderData: keepPreviousData,
    select: (data) =>
      data.results.map((o) => ({
        label: o.name,
        value: o.id,
      })),
  })

  const { filtersParams, ...filtersHandlers } = useFilters<
    Omit<GetCatalogPurposeTemplatesParams, 'limit' | 'offset'> //TODO: CHANGE PARAMS
  >([
    { name: 'q', label: t('filters.purposeTemplateNameField.label'), type: 'freetext' },
    {
      name: 'creatorIds',
      label: t('filters.creatorNameField.label'),
      type: 'autocomplete-multiple',
      options: creatorsOptions,
      onTextInputChange: setCreatorsAutocompleteInput,
    },
    {
      name: 'targetTenantKind',
      label: t('filters.targetTenantKindField.label'),
      type: 'autocomplete-multiple',
      options: [
        { label: t('filters.targetTenantKindField.values.labelPA'), value: 'PA' },
        { label: t('filters.targetTenantKindField.values.labelNotPA'), value: 'GSP' },
      ],
    },
  ])

  const descriptionLabel = t('description')
    .split('\n')
    .map((line, idx) => (
      <span key={idx}>
        {line}
        <br />
      </span>
    ))

  return (
    <>
      <SectionContainer
        title={t('title')}
        description={descriptionLabel}
        sx={{
          backgroundColor: 'transparent',
        }}
      >
        <Filters {...filtersHandlers} />
        TO DO
        {/* <React.Suspense fallback={<ConsumerPurposeTemplateLinkedEServiceTableSkeleton />}>
          <ConsumerPurposeTemplateLinkedEServiceTable purposeTemplate={purposeTemplate} />
        </React.Suspense> */}
      </SectionContainer>
    </>
  )
}

export default ConsumerLinkedPurposeTemplatesTab
