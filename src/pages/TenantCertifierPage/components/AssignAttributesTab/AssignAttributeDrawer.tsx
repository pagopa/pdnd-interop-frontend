import type { CompactAttribute, CompactTenant } from '@/api/api.generatedTypes'
import { AttributeMutations, AttributeQueries } from '@/api/attribute'
import { PartyQueries } from '@/api/party'
import { Drawer } from '@/components/shared/Drawer'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { Stack } from '@mui/material'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type AssignAttributeDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

type AssignAttributeFormValues = {
  attribute: CompactAttribute | null //TODO
  assigneeTenant: CompactTenant | null //TODO
}

export const AssignAttributeDrawer: React.FC<AssignAttributeDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation('party', { keyPrefix: 'tenantCertifier.assignTab.drawer' })

  const { mutate: createVerifiedAttribute } = AttributeMutations.useCreateVerified() // TODO assegnazione attributo certificato, da implementare

  const [attributeSearchParam, setAttributeSearchParam] = useAutocompleteTextInput()
  const [tenantSearchParam, setTenantSearchParam] = useAutocompleteTextInput()

  const formMethods = useForm<AssignAttributeFormValues>({
    defaultValues: {
      attribute: null,
      assigneeTenant: null,
    },
  })

  const { watch } = formMethods
  const selectedAttribute = watch('attribute')
  const selectedTenant = watch('assigneeTenant')

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

  const { data: activeParty } = PartyQueries.useGetActiveUserParty()
  const { data: attributesData } = AttributeQueries.useGetList(
    {
      limit: 50,
      offset: 0,
      kinds: ['CERTIFIED'],
      // origin: activeParty.certifierId
      q: getAttributeQ(),
    },
    {
      suspense: false,
      keepPreviousData: true,
    }
  )

  const attributes = attributesData?.results ?? []

  const attributeOptions = attributes.map((attribute) => ({
    label: attribute.name,
    value: attribute.id,
  }))

  function getTenantQ() {
    let result = tenantSearchParam

    if (selectedTenant && tenantSearchParam === selectedTenant.name) {
      result = ''
    }

    return result
  }

  const { data: tenantsData } = PartyQueries.useGetTenants(
    {
      name: getTenantQ(),
      limit: 50,
    },
    {
      suspense: false,
      keepPreviousData: true,
    }
  )

  const tenants = tenantsData?.results ?? []

  const tenantOptions = tenants.map((tenant) => ({
    label: tenant.name,
    value: tenant.id,
  }))

  const onSubmit = formMethods.handleSubmit((values: AssignAttributeFormValues) => {
    // assignAttribute(values, { onSuccess: onClose })
    console.log('Assegnazione ATTRIBUTO')
    onClose()
  })

  return (
    <FormProvider {...formMethods}>
      <Drawer
        title={t('title')}
        subtitle={t('subtitle')}
        buttonAction={{
          action: onSubmit,
          label: t('submitBtnLabel'),
        }}
        onTransitionExited={formMethods.reset}
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
            name="assigneeTenant"
          />
        </Stack>
      </Drawer>
    </FormProvider>
  )
}
