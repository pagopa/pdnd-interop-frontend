import React from 'react'
import { Button, Stack } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { useQuery } from '@tanstack/react-query'
import { EServiceQueries } from '@/api/eservice'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import type { PurposeTemplateWithCompactCreator } from '@/api/api.generatedTypes'
import { mergeLinkableCandidates, type LinkableCandidate } from '@/utils/purposeTemplate.utils'

export type AlreadySelectedResourceId = {
  resourceKind: 'ESERVICE' | 'ESERVICE_TEMPLATE'
  id: string
}

export type ResourceAutoCompleteProps = {
  onAddResource: (resource: LinkableCandidate) => void
  alreadySelectedResourceIds: AlreadySelectedResourceId[]
  purposeTemplate: PurposeTemplateWithCompactCreator
  direction?: 'column' | 'row'
}

type ResourceAutoCompleteFormValues = { resource: LinkableCandidate | null }

export const ResourceAutoComplete: React.FC<ResourceAutoCompleteProps> = ({
  onAddResource,
  alreadySelectedResourceIds,
  purposeTemplate,
  direction = 'row',
}) => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'edit.step2' })
  const [searchParam, setSearchParam] = useAutocompleteTextInput()

  const formMethods = useForm<ResourceAutoCompleteFormValues>({
    defaultValues: { resource: null },
  })
  const { watch, handleSubmit } = formMethods
  const selectedResource = watch('resource')
  const isSelected = !!selectedResource

  const personalDataFilter: 'TRUE' | 'FALSE' =
    purposeTemplate.handlesPersonalData === true ? 'TRUE' : 'FALSE'

  const formatResourceLabel = React.useCallback(
    (candidate: LinkableCandidate) => {
      const publisher =
        candidate.resourceKind === 'ESERVICE'
          ? candidate.value.producer.name
          : candidate.value.creator.name
      const labelKey =
        candidate.resourceKind === 'ESERVICE' ? 'options.eservice' : 'options.eserviceTemplate'
      return t(labelKey, { name: candidate.value.name, publisher })
    },
    [t]
  )

  // Once a resource is selected, the autocomplete input mirrors the option label —
  // don't re-query for it as the user's "search" term.
  const q =
    selectedResource && searchParam === formatResourceLabel(selectedResource) ? '' : searchParam

  const { data: eservicesData } = useQuery(
    EServiceQueries.getCatalogList({
      q,
      states: ['PUBLISHED'],
      limit: 50,
      offset: 0,
      personalData: personalDataFilter,
    })
  )

  const { data: templatesData } = useQuery(
    EServiceTemplateQueries.getProviderEServiceTemplatesCatalogList({
      q,
      limit: 50,
      offset: 0,
      personalData: personalDataFilter,
    })
  )

  const handleAddResource = handleSubmit(({ resource }) => {
    if (!resource) return
    onAddResource(resource)
  })

  const options = React.useMemo(() => {
    const eservices = eservicesData?.results ?? []
    const templates = templatesData?.results ?? []
    const merged = mergeLinkableCandidates(eservices, templates)
    const alreadyKeys = new Set(alreadySelectedResourceIds.map((r) => `${r.resourceKind}:${r.id}`))
    return merged
      .filter((c) => !alreadyKeys.has(`${c.resourceKind}:${c.value.id}`))
      .map((c) => ({
        label: formatResourceLabel(c),
        value: c,
      }))
  }, [
    eservicesData?.results,
    templatesData?.results,
    alreadySelectedResourceIds,
    formatResourceLabel,
  ])

  return (
    <FormProvider {...formMethods}>
      <Stack
        direction={direction}
        alignItems={direction === 'column' ? 'start' : 'center'}
        spacing={1}
      >
        <RHFAutocompleteSingle
          label={t('autocompleteInput.label')}
          onInputChange={(_, value) => setSearchParam(value)}
          sx={{ mb: 0, flex: 1 }}
          options={options}
          focusOnMount
          name="resource"
        />
        <Button
          onClick={handleAddResource}
          disabled={!isSelected}
          type="button"
          variant="contained"
        >
          {t('saveBtn')}
        </Button>
      </Stack>
    </FormProvider>
  )
}
