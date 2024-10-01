import type { CompactAttribute, CompactTenant } from '@/api/api.generatedTypes'
import { AttributeMutations, AttributeQueries } from '@/api/attribute'
import { TenantHooks, TenantQueries } from '@/api/tenant'
import { Drawer } from '@/components/shared/Drawer'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { Stack } from '@mui/material'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type AssignAttributeDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

type AssignAttributeFormValues = {
  attribute: CompactAttribute
  tenant: CompactTenant
}

export const AssignAttributeDrawer: React.FC<AssignAttributeDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation('party', { keyPrefix: 'tenantCertifier.assignTab.drawer' })

  const { mutate: addCertifiedAttribute } = AttributeMutations.useAddCertifiedAttribute()

  const [attributeSearchParam, setAttributeSearchParam] = useAutocompleteTextInput()
  const [tenantSearchParam, setTenantSearchParam] = useAutocompleteTextInput()

  const formMethods = useForm<AssignAttributeFormValues>({
    defaultValues: {
      attribute: undefined,
      tenant: undefined,
    },
  })

  const { watch } = formMethods
  const selectedAttribute = watch('attribute')
  const selectedTenant = watch('tenant')

  /**
   * TEMP: This is a workaround to avoid the "q" param in the query to be equal to the selected attribute name.
   */
  function getAttributeQ() {
    let result = attributeSearchParam

    if (selectedAttribute && attributeSearchParam === selectedAttribute.name) {
      result = ''
    }

    return result
  }

  const { data: activeTenant } = TenantHooks.useGetActiveUserParty()
  const { data: attributeOptions = [] } = useQuery({
    ...AttributeQueries.getList({
      limit: 50,
      offset: 0,
      kinds: ['CERTIFIED'],
      origin: activeTenant.features[0]?.certifier?.certifierId,
      q: getAttributeQ(),
    }),
    placeholderData: keepPreviousData,
    select: ({ results }) =>
      results.map((attribute) => ({
        label: attribute.name,
        value: attribute,
      })),
  })

  /**
   * TEMP: This is a workaround to avoid the "q" param in the query to be equal to the selected tenant name.
   */
  function getTenantQ() {
    let result = tenantSearchParam

    if (selectedTenant && tenantSearchParam === selectedTenant.name) {
      result = ''
    }

    return result
  }

  const { data: tenantOptions = [] } = useQuery({
    ...TenantQueries.getTenants({
      name: getTenantQ(),
      limit: 50,
    }),
    placeholderData: keepPreviousData,
    select: ({ results }) =>
      results
        .filter((tenant) => tenant.id !== activeTenant.id)
        .map((tenant) => ({
          label: tenant.name,
          value: tenant,
        })),
  })

  const onSubmit = formMethods.handleSubmit((values: AssignAttributeFormValues) => {
    addCertifiedAttribute(
      { id: values.attribute.id, tenantId: values.tenant.id },
      { onSuccess: onClose }
    )
  })

  const handleTransitionExited = () => {
    formMethods.reset()

    setAttributeSearchParam('')
    setTenantSearchParam('')
  }

  return (
    <FormProvider {...formMethods}>
      <Drawer
        title={t('title')}
        subtitle={t('subtitle')}
        buttonAction={{
          action: onSubmit,
          label: t('submitBtnLabel'),
        }}
        onTransitionExited={handleTransitionExited}
        onClose={onClose}
        isOpen={isOpen}
      >
        <Stack component="form" noValidate spacing={3}>
          <RHFAutocompleteSingle
            label={t('form.attributeField.label')}
            labelType="external"
            size="small"
            onInputChange={(_, value) => setAttributeSearchParam(value)}
            sx={{ mb: 0, flex: 1 }}
            options={attributeOptions}
            focusOnMount
            name="attribute"
          />
          <RHFAutocompleteSingle
            label={t('form.tenantField.label')}
            labelType="external"
            size="small"
            onInputChange={(_, value) => setTenantSearchParam(value)}
            sx={{ mb: 0, flex: 1 }}
            options={tenantOptions}
            name="tenant"
          />
        </Stack>
      </Drawer>
    </FormProvider>
  )
}
