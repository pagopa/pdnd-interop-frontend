import type { FilterFieldsValues, FiltersHandler, SideFiltersSection } from '@/types/filters.types'
import { Close, FilterAltOutlined } from '@mui/icons-material'
import { Drawer as MUIDrawer, Button, Stack, Typography, IconButton } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FilterField } from './FilterField'
import { getFiltersDefaultValues } from '@/utils/filters.utils'
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import { isEqual } from 'lodash'

type SideFiltersProps = {
  sections: SideFiltersSection[]
  filters: FilterFieldsValues
  onChangeActiveFilters: FiltersHandler
}

export const SideFilters: React.FC<SideFiltersProps> = ({
  sections,
  filters,
  onChangeActiveFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const { t: tShared } = useTranslation('shared-components', { keyPrefix: 'drawer' })
  const { t } = useTranslation('filters', { keyPrefix: 'side' })

  const defaultValues = getFiltersDefaultValues(
    sections.flatMap((section) => section.fields),
    filters
  )

  const formMethods = useForm<FilterFieldsValues>({
    defaultValues,
  })

  const { reset, getValues } = formMethods

  const onSubmit: SubmitHandler<FilterFieldsValues> = useCallback(
    (data) => {
      onChangeActiveFilters(data)
    },
    [onChangeActiveFilters]
  )

  const onReset = useCallback(() => {
    reset(
      getFiltersDefaultValues(
        sections.flatMap((section) => section.fields),
        {}
      )
    )
  }, [reset, sections])

  const onClose = useCallback(() => {
    setIsOpen(false)
    if (!isEqual(getValues(), defaultValues)) {
      reset(defaultValues)
    }
  }, [reset, getValues, defaultValues])

  return (
    <>
      <Button variant="text" startIcon={<FilterAltOutlined />} onClick={() => setIsOpen(true)}>
        {t('trigger')}
      </Button>
      <MUIDrawer
        variant="temporary"
        anchor="right"
        open={isOpen}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 375 },
            maxWidth: '100%',
          },
        }}
      >
        <FormProvider {...formMethods}>
          <Stack
            component={'form'}
            flexGrow={1}
            overflow={'hidden'}
            onSubmit={formMethods.handleSubmit(onSubmit)}
          >
            <Stack px={3} pt={2} flexGrow={1} overflow={'auto'}>
              <Stack spacing={1} pb={5}>
                <Stack direction="row" alignItems={'center'} justifyContent={'space-between'}>
                  <Typography variant="h6" fontWeight={600}>
                    {t('title')}
                  </Typography>
                  <IconButton onClick={onClose} aria-label={tShared('closeIconAriaLabel')}>
                    <Close fontSize="small" />
                  </IconButton>
                </Stack>
                <Typography variant="body2">{t('subtitle')}</Typography>
              </Stack>
              {sections.map((section) => (
                <Stack key={section.title} spacing={2} sx={{ mb: 4 }}>
                  <Typography variant="h6">{section.title}</Typography>
                  {section.fields.map((field) => (
                    <FilterField key={field.name} field={field} />
                  ))}
                </Stack>
              ))}
            </Stack>
            <Stack direction="row" pb={4} pt={0.5} px={3} justifyContent={'end'}>
              <Button variant="text" type="button" onClick={onReset}>
                {t('actions.reset')}
              </Button>
              <Button variant="contained" type="submit">
                {t('actions.apply')}
              </Button>
            </Stack>
          </Stack>
        </FormProvider>
      </MUIDrawer>
    </>
  )
}
