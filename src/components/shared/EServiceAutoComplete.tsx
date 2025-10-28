import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { Button, Stack } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { CatalogEService } from '@/api/api.generatedTypes'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { useQuery } from '@tanstack/react-query'

export type EServiceAutocompleteProps = {
  onAddEService: (eservice: CatalogEService) => void
  alreadySelectedEServiceIds: string[]
  direction?: 'column' | 'row'
}

type EServiceAutocompleteFormValues = { eservice: null | CatalogEService }

export const EServiceAutocomplete: React.FC<EServiceAutocompleteProps> = ({
  onAddEService,
  alreadySelectedEServiceIds,
  direction = 'row',
}) => {
  const { t } = useTranslation('purposeTemplate', { keyPrefix: 'edit.step2' })
  const [eserviceSearchParam, setEServiceSearchParam] = useAutocompleteTextInput()

  const eserviceAutocompleteFormMethods = useForm<EServiceAutocompleteFormValues>({
    defaultValues: { eservice: null },
  })

  const { watch: watchEService, handleSubmit } = eserviceAutocompleteFormMethods
  const selectedEService = watchEService('eservice')
  const isSelected = !!selectedEService

  /**
   * TEMP: This is a workaround to avoid the "q" param in the query to be equal to the selected eservice name.
   */
  function getQ() {
    let result = eserviceSearchParam

    if (selectedEService && eserviceSearchParam === selectedEService.name) {
      result = ''
    }

    return result
  }

  const { data } = useQuery(
    EServiceQueries.getCatalogList({
      q: getQ(),
      states: ['PUBLISHED', 'SUSPENDED'], //TODO: REMOVE SUSPENDED STATE
      limit: 50,
      offset: 0,
    })
  )

  const handleAddEServiceToGroup = handleSubmit(({ eservice }) => {
    if (!eservice) return
    onAddEService(eservice)
  })

  const options = React.useMemo(() => {
    const eservices = data?.results ?? []
    return eservices
      .filter((att) => !alreadySelectedEServiceIds.includes(att.id))
      .map((att) => ({
        label: att.name,
        value: att,
      }))
  }, [data?.results, alreadySelectedEServiceIds])

  return (
    <FormProvider {...eserviceAutocompleteFormMethods}>
      <Stack
        direction={direction}
        alignItems={direction === 'column' ? 'start' : 'center'}
        spacing={1}
      >
        <RHFAutocompleteSingle
          label={t('autocompleteInput.label')}
          onInputChange={(_, value) => setEServiceSearchParam(value)}
          sx={{ mb: 0, flex: 1 }}
          options={options}
          focusOnMount
          name="eservice"
        />
        <Button
          onClick={handleAddEServiceToGroup}
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
