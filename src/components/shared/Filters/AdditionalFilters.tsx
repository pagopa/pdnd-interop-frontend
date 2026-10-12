import type {
  FilterFieldsValues,
  FiltersHandler,
  AdditionalFiltersSection,
} from '@/types/filters.types'
import { Close, FilterAltOutlined } from '@mui/icons-material'
import {
  Drawer as MUIDrawer,
  Stack,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Badge,
} from '@mui/material'
import { MIButton as Button } from '@pagopa/mui-italia'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FilterField } from './FilterField'
import { getActiveFiltersCount, getFiltersDefaultValues } from '@/utils/filters.utils'
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import { isEqual } from 'lodash'

type AdditionalFiltersProps = {
  fields: AdditionalFiltersSection[]
  filters: FilterFieldsValues
  onChangeActiveFilters: FiltersHandler
}

export const AdditionalFilters: React.FC<AdditionalFiltersProps> = ({
  fields: sections,
  filters,
  onChangeActiveFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const { t: tShared } = useTranslation('shared-components', { keyPrefix: 'drawer' })
  const { t } = useTranslation('filters', { keyPrefix: 'additionals' })

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const defaultValues = getFiltersDefaultValues(
    sections.flatMap((section) => section.fields),
    filters
  )

  const formMethods = useForm<FilterFieldsValues>({
    defaultValues,
  })

  const { reset, getValues } = formMethods

  const activeFiltersCount = useMemo(() => {
    return getActiveFiltersCount(filters)
  }, [filters])

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

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  return (
    <>
      <Stack direction={'row'} alignItems={'center'} gap={1}>
        {activeFiltersCount > 0 && (
          <Badge
            badgeContent={activeFiltersCount}
            sx={{
              '& .MuiBadge-badge': {
                color: theme.colors.neutral.white,
                backgroundColor: theme.colors.blue[500],
                position: 'relative',
                transform: 'none',
              },
            }}
          />
        )}
        <Button
          variant="text"
          startIcon={!activeFiltersCount ? <FilterAltOutlined /> : undefined}
          onClick={() => setIsOpen(true)}
        >
          {t('trigger')}
        </Button>
      </Stack>
      <MUIDrawer
        variant="temporary"
        anchor={isMobile ? 'bottom' : 'right'}
        open={isOpen}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: '100%', md: 375 },
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
            <Stack
              direction={{ xs: 'column-reverse', md: 'row' }}
              pb={4}
              pt={3}
              px={3}
              justifyContent={{ xs: 'center', md: 'flex-end' }}
              gap={{ xs: 3, md: 4 }}
            >
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
