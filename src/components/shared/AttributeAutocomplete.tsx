import React from 'react'
import { AttributeQueries } from '@/api/attribute'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import type { AttributeKey } from '@/types/attribute.types'
import { Button, Stack } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { AttributeKind, DescriptorAttribute } from '@/api/api.generatedTypes'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { FEATURE_FLAG_ATTRIBUTE_CERTIFIED_DISCRETE } from '@/config/env'
import { match } from 'ts-pattern'

export type AttributeAutocompleteProps = {
  attributeKey: AttributeKey
  onAddAttribute: (attribute: DescriptorAttribute) => void
  alreadySelectedAttributeIds: string[]
  direction?: 'column' | 'row'
  onOpenConfigDrawer?: (attribute: DescriptorAttribute) => void
  areCertifiedDiscreteOptionsIncluded?: boolean
}

type AttributeAutocompleteFormValues = { attribute: null | DescriptorAttribute }

export const AttributeAutocomplete: React.FC<AttributeAutocompleteProps> = ({
  attributeKey,
  onAddAttribute,
  alreadySelectedAttributeIds,
  direction = 'row',
  onOpenConfigDrawer,
  areCertifiedDiscreteOptionsIncluded = false,
}) => {
  const { t } = useTranslation('attribute', { keyPrefix: 'group' })
  const [attributeSearchParam, setAttributeSearchParam] = useAutocompleteTextInput()

  const attributeAutocompleteFormMethods = useForm<AttributeAutocompleteFormValues>({
    defaultValues: { attribute: null },
  })

  const { watch: watchAttribute, handleSubmit } = attributeAutocompleteFormMethods
  const selectedAttribute = watchAttribute('attribute')
  const isSelected = !!selectedAttribute

  /**
   * TEMP: This is a workaround to avoid the "q" param in the query to be equal to the selected attribute name.
   */
  function getQ() {
    let result = attributeSearchParam

    if (selectedAttribute && attributeSearchParam === selectedAttribute.name) {
      result = ''
    }

    return result
  }

  const kindsFilter = match(attributeKey)
    .returnType<Array<AttributeKind>>()
    .with('certified', () => {
      if (areCertifiedDiscreteOptionsIncluded) return ['CERTIFIED', 'CERTIFIED_DISCRETE']
      return ['CERTIFIED']
    })
    .with('verified', () => ['VERIFIED'])
    .with('declared', () => ['DECLARED'])
    .exhaustive()

  const { data } = useQuery({
    ...AttributeQueries.getList({
      kinds: kindsFilter,
      q: getQ(),
      offset: 0,
      limit: 50,
    }),
    placeholderData: keepPreviousData,
  })

  const handleAddAttributeToGroup = handleSubmit(({ attribute }) => {
    if (!attribute) return
    onAddAttribute(attribute)
  })

  const options = React.useMemo(() => {
    const attributes = data?.results ?? []
    return attributes
      .filter((att) => !alreadySelectedAttributeIds.includes(att.id))
      .map((att) => ({
        label: att.name,
        value: att,
      }))
  }, [data?.results, alreadySelectedAttributeIds])

  const handleOpenConfigDrawer = handleSubmit(({ attribute }) => {
    if (!attribute || !onOpenConfigDrawer) return
    onOpenConfigDrawer(attribute)
  })

  const isConfigureCertifiedDiscrete =
    selectedAttribute?.kind === 'CERTIFIED_DISCRETE' &&
    FEATURE_FLAG_ATTRIBUTE_CERTIFIED_DISCRETE &&
    onOpenConfigDrawer

  return (
    <FormProvider {...attributeAutocompleteFormMethods}>
      <Stack direction={direction} alignItems="stretch" spacing={1} justifyContent="space-between">
        <RHFAutocompleteSingle
          label={t('autocompleteInput.label')}
          placeholder={t('autocompleteInput.placeholder')}
          onInputChange={(_, value) => setAttributeSearchParam(value)}
          sx={{ mb: 0, flex: 1 }}
          options={options}
          focusOnMount
          name="attribute"
          size="small"
          infoLabel={
            isConfigureCertifiedDiscrete
              ? t('autocompleteInput.certifiedDiscreteInfoSection')
              : undefined
          }
          isOptionEqualToValue={(option, { value }) => option.value.id === value.id}
        />
        {isSelected && (
          <Button
            onClick={
              isConfigureCertifiedDiscrete ? handleOpenConfigDrawer : handleAddAttributeToGroup
            }
            type="button"
            variant="contained"
          >
            {isConfigureCertifiedDiscrete ? t('config') : t('add')}
          </Button>
        )}
      </Stack>
    </FormProvider>
  )
}
