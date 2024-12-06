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

export type AttributeAutocompleteProps = {
  attributeKey: AttributeKey
  onAddAttribute: (attribute: DescriptorAttribute) => void
  alreadySelectedAttributeIds: string[]
  direction?: 'column' | 'row'
}

type AttributeAutocompleteFormValues = { attribute: null | DescriptorAttribute }

export const AttributeAutocomplete: React.FC<AttributeAutocompleteProps> = ({
  attributeKey,
  onAddAttribute,
  alreadySelectedAttributeIds,
  direction = 'row',
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

  const { data } = useQuery({
    ...AttributeQueries.getList({
      kinds: [attributeKey.toUpperCase() as AttributeKind],
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

  return (
    <FormProvider {...attributeAutocompleteFormMethods}>
      <Stack direction={direction} alignItems="center" spacing={1}>
        <RHFAutocompleteSingle
          label={t('autocompleteInput.label')}
          placeholder={t('autocompleteInput.placeholder')}
          onInputChange={(_, value) => setAttributeSearchParam(value)}
          sx={{ mb: 0, flex: 1 }}
          options={options}
          focusOnMount
          name="attribute"
        />
        <Button
          onClick={handleAddAttributeToGroup}
          fullWidth={direction === 'column'}
          disabled={!isSelected}
          type="button"
          variant="contained"
        >
          {t('addBtn')}
        </Button>
      </Stack>
    </FormProvider>
  )
}
