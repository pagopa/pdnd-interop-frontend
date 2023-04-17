import React from 'react'
import { AttributeQueries } from '@/api/attribute'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import type { AttributeKey } from '@/types/attribute.types'
import { Button, Stack } from '@mui/material'
import { ButtonNaked } from '@pagopa/mui-italia'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { EServiceCreateStep1FormValues } from '../EServiceCreateStep1General'
import type { Attribute, AttributeKind } from '@/api/api.generatedTypes'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'

type AttributeAutocompleteProps = {
  groupIndex: number
  attributeKey: AttributeKey
  handleHideAutocomplete: VoidFunction
}

type AttributeAutocompleteFormValues = { attribute: null | Attribute }

export const AttributeAutocomplete: React.FC<AttributeAutocompleteProps> = ({
  groupIndex,
  attributeKey,
  handleHideAutocomplete,
}) => {
  const { t } = useTranslation('attribute', { keyPrefix: 'group' })
  const [attributeSearchParam, setAttributeSearchParam] = useAutocompleteTextInput()
  const { data, isLoading } = AttributeQueries.useGetList(
    {
      kinds: [attributeKey.toUpperCase() as AttributeKind],
      q: attributeSearchParam,
      offset: 0,
      limit: 50,
    },
    {
      suspense: false,
    }
  )

  const { watch, setValue } = useFormContext<EServiceCreateStep1FormValues>()
  const attributeGroups = watch(`attributes.${attributeKey}`)

  const attributeAutocompleteFormMethods = useForm<AttributeAutocompleteFormValues>({
    defaultValues: { attribute: null },
  })

  const { watch: watchAttribute, handleSubmit } = attributeAutocompleteFormMethods
  const isSelected = !!watchAttribute('attribute')

  const handleAddAttributeToGroup = handleSubmit(({ attribute }) => {
    if (!attribute) return
    const newAttributeGroups = [...attributeGroups]
    newAttributeGroups[groupIndex].attributes.push(attribute)
    setValue(`attributes.${attributeKey}`, newAttributeGroups)
    handleHideAutocomplete()
  })

  const options = React.useMemo(() => {
    const attributes = data?.results ?? []
    const attributesAlreadyInGroups = attributeGroups.reduce(
      (acc, group) => [...acc, ...group.attributes.map(({ id }) => id)],
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
      <RHFAutocompleteSingle
        label={t('autocompleteInput.label')}
        placeholder={t('autocompleteInput.placeholder')}
        onInputChange={(_, value) => setAttributeSearchParam(value)}
        loading={isLoading}
        sx={{ mb: 0, flex: 1 }}
        options={options}
        variant="standard"
        focusOnMount
        name="attribute"
      />
      <Stack sx={{ mt: 2 }} direction="row" alignItems="center" spacing={1}>
        <Button
          onClick={handleAddAttributeToGroup}
          disabled={!isSelected}
          type="button"
          size="small"
          variant="outlined"
        >
          {t('addBtn')}
        </Button>
        <ButtonNaked
          onClick={handleHideAutocomplete}
          type="button"
          size="small"
          color="error"
          variant="text"
        >
          {t('cancelBtn')}
        </ButtonNaked>
      </Stack>
    </FormProvider>
  )
}
