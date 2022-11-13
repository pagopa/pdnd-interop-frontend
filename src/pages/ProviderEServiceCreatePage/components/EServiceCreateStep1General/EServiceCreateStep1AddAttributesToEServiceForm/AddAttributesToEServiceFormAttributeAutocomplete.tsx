import { AttributeQueries } from '@/api/attribute'
import { AutocompleteSingle } from '@/components/shared/ReactHookFormInputs'
import { AttributeKey, CatalogAttribute } from '@/types/attribute.types'
import { Button, Stack } from '@mui/material'
import { ButtonNaked } from '@pagopa/mui-italia'
import React from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { EServiceCreateStep1FormValues } from '../EServiceCreateStep1General'

type AddAttributesToEServiceFormAttributeAutocompleteProps = {
  groupIndex: number
  attributeKey: AttributeKey
  handleHideAutocomplete: VoidFunction
}

type AttributeAutocompleteFormValues = { attribute: null | CatalogAttribute }

export const AddAttributesToEServiceFormAttributeAutocomplete: React.FC<
  AddAttributesToEServiceFormAttributeAutocompleteProps
> = ({ groupIndex, attributeKey, handleHideAutocomplete }) => {
  const { t } = useTranslation('attribute', { keyPrefix: 'group' })
  const { data: attributes = [], isFetching } = AttributeQueries.useGetList(undefined, {
    suspense: false,
  })

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
    const attributesAlreadyInGroups = attributeGroups.reduce(
      (acc, group) => [...acc, ...group.attributes.map(({ id }) => id)],
      [] as Array<string>
    )
    return attributes
      .filter(
        (att) =>
          att.kind === attributeKey.toUpperCase() && !attributesAlreadyInGroups.includes(att.id)
      )
      .map((att) => ({
        label: att.name,
        value: att,
      }))
  }, [attributes, attributeKey, attributeGroups])

  return (
    <FormProvider {...attributeAutocompleteFormMethods}>
      <AutocompleteSingle
        label={t('autocompleteInput.label')}
        placeholder={t('autocompleteInput.placeholder')}
        loading={isFetching}
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
