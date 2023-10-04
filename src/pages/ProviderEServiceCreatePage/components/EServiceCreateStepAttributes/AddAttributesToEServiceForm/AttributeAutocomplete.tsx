import React from 'react'
import { AttributeQueries } from '@/api/attribute'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import type { AttributeKey } from '@/types/attribute.types'
import { Button, Stack } from '@mui/material'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { AttributeKind, DescriptorAttribute } from '@/api/api.generatedTypes'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import type { EServiceCreateStepAttributesFormValues } from '..'

export type AttributeAutocompleteProps = {
  groupIndex: number
  attributeKey: AttributeKey
  handleHideAutocomplete: VoidFunction
}

type AttributeAutocompleteFormValues = { attribute: null | DescriptorAttribute }

export const AttributeAutocomplete: React.FC<AttributeAutocompleteProps> = ({
  groupIndex,
  attributeKey,
  handleHideAutocomplete,
}) => {
  const { t } = useTranslation('attribute', { keyPrefix: 'group' })
  const [attributeSearchParam, setAttributeSearchParam] = useAutocompleteTextInput()

  const { watch, setValue } = useFormContext<EServiceCreateStepAttributesFormValues>()
  const attributeGroups = watch(`attributes.${attributeKey}`)

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

  const { data } = AttributeQueries.useGetList(
    {
      kinds: [attributeKey.toUpperCase() as AttributeKind],
      q: getQ(),
      offset: 0,
      limit: 50,
    },
    {
      suspense: false,
      keepPreviousData: true,
    }
  )

  const handleAddAttributeToGroup = handleSubmit(({ attribute }) => {
    if (!attribute) return
    const newAttributeGroups = [...attributeGroups]
    newAttributeGroups[groupIndex].push(attribute)
    setValue(`attributes.${attributeKey}`, newAttributeGroups)
    handleHideAutocomplete()
  })

  const options = React.useMemo(() => {
    const attributes = data?.results ?? []
    const attributesAlreadyInGroups = attributeGroups.reduce(
      (acc, group) => [...acc, ...group.map(({ id }) => id)],
      [] as Array<string>
    )
    return attributes
      .filter((att) => !attributesAlreadyInGroups.includes(att.id))
      .map((att) => ({
        label: att.name,
        value: att,
      }))
  }, [data?.results, attributeGroups])

  return (
    <FormProvider {...attributeAutocompleteFormMethods}>
      <Stack direction="row" alignItems="center" spacing={1}>
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
