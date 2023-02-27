import type { GetListAgreementQueryFilters } from '@/api/agreement/agreement.api.types'
// import { EServiceQueries } from '@/api/eservice'
import { AutocompleteMultiple } from '@/components/shared/ReactHookFormInputs'
// import { useAutocompleteFilterInput } from '@/hooks/useAutocompleteFilterInput'
// import { useJwt } from '@/hooks/useJwt'
import type { InputOption } from '@/types/common.types'
import { Button, Stack } from '@mui/material'
import React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type ProviderAgreementsTableFiltersProps = {
  clearFilters: VoidFunction
  enableFilters: VoidFunction
  filtersUseFormMethods: UseFormReturn<GetListAgreementQueryFilters, unknown>
}

export const ProviderAgreementsTableFilters: React.FC<ProviderAgreementsTableFiltersProps> = ({
  clearFilters,
  enableFilters,
  filtersUseFormMethods,
}) => {
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  return (
    <FormProvider {...filtersUseFormMethods}>
      <Stack
        onSubmit={enableFilters}
        component="form"
        noValidate
        direction="row"
        spacing={2}
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Stack direction="row" spacing={2} sx={{ width: '60%' }}>
          {/* <EServiceFilterAutocomplete /> */}
          <StateFilterAutocomplete />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button size="small" variant="outlined" type="submit">
            {tCommon('filter')}
          </Button>
          <Button size="small" variant="text" type="button" onClick={clearFilters}>
            {tCommon('cancelFilter')}
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  )
}

// const EServiceFilterAutocomplete: React.FC = () => {
//   const { t } = useTranslation('agreement', { keyPrefix: 'list.filters' })
//   const [eserviceAutocompleteText, handleAutocompleteInputChange] = useAutocompleteFilterInput()

//   const { jwt } = useJwt()

//   const { data: eservices } = EServiceQueries.useGetProviderList(
//     {
//       q: eserviceAutocompleteText,
//       consumersIds: [jwt?.organizationId] as Array<string>,
//       limit: 50,
//       offset: 0,
//     },
//     { suspense: false, keepPreviousData: true, enabled: !!jwt?.organizationId }
//   )

//   const eservicesOptions =
//     eservices?.results.map((o) => ({
//       label: o.name,
//       value: o.id,
//     })) || []

//   return (
//     <AutocompleteMultiple
//       placeholder=""
//       sx={{ m: 0, width: '55%' }}
//       size="small"
//       name="eservicesIds"
//       onInputChange={handleAutocompleteInputChange}
//       label={t('eserviceField.label')}
//       options={eservicesOptions}
//     />
//   )
// }

const StateFilterAutocomplete: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'list.filters' })

  const stateOptions: Array<InputOption> = [
    { label: t('statusField.optionLabels.ARCHIVED'), value: 'ARCHIVED' },
    { label: t('statusField.optionLabels.ACTIVE'), value: 'ACTIVE' },
    { label: t('statusField.optionLabels.PENDING'), value: 'PENDING' },
    { label: t('statusField.optionLabels.REJECTED'), value: 'REJECTED' },
    { label: t('statusField.optionLabels.SUSPENDED'), value: 'SUSPENDED' },
  ]

  return (
    <AutocompleteMultiple
      placeholder=""
      sx={{ width: '45%' }}
      size="small"
      name="states"
      label={t('statusField.label')}
      options={stateOptions}
    />
  )
}
