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
import React, { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FilterField } from './FilterField'
import {
  getActiveFiltersCount,
  getFiltersDefaultValues,
  getFiltersValues,
} from '@/utils/filters.utils'
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import isEqual from 'lodash/isEqual'

type AdditionalFiltersProps = {
  fields: AdditionalFiltersSection[]
  filters: FilterFieldsValues
  onChangeActiveFilters: FiltersHandler
  /** Compact, unsectioned layout with actions directly below the fields. */
  layout?: 'default' | 'compact'
}

export const AdditionalFilters: React.FC<AdditionalFiltersProps> = ({
  fields: sections,
  filters,
  onChangeActiveFilters,
  layout = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const titleId = useId()
  const descriptionId = useId()
  const isCompact = layout === 'compact'

  const { t: tShared } = useTranslation('shared-components', { keyPrefix: 'drawer' })
  const { t } = useTranslation('filters', { keyPrefix: 'additionals' })

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const additionals = useMemo(() => {
    return sections.flatMap((section) => section.fields)
  }, [sections])

  const values = getFiltersValues(additionals, filters)

  const formMethods = useForm<FilterFieldsValues>({
    values,
  })

  const { reset, getValues } = formMethods

  const defaultValues = useMemo(() => {
    return getFiltersDefaultValues(additionals)
  }, [additionals])

  const activeFiltersCount = useMemo(() => {
    return getActiveFiltersCount(isCompact ? getFiltersValues(additionals, filters) : filters)
  }, [filters, additionals, isCompact])

  const onSubmit: SubmitHandler<FilterFieldsValues> = useCallback(
    (data) => {
      onChangeActiveFilters(data)
      setIsOpen(false)
    },
    [onChangeActiveFilters]
  )

  const onReset = useCallback(() => {
    reset()
    onChangeActiveFilters(defaultValues)
    setIsOpen(false)
  }, [reset, defaultValues, onChangeActiveFilters])

  const onClose = useCallback(() => {
    setIsOpen(false)
    if (!isEqual(getValues(), values)) {
      reset(values)
    }
  }, [reset, getValues, values])

  useEffect(() => {
    // Reset form values when filters change and there are no active filters / Remove all active filters
    const activeFiltersCount = getActiveFiltersCount(filters)
    const currentValues = getValues()
    if (!activeFiltersCount && !isEqual(defaultValues, currentValues)) reset(defaultValues)
  }, [reset, filters, getValues, defaultValues])

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
          role: 'dialog',
          'aria-modal': true,
          'aria-labelledby': titleId,
          'aria-describedby': descriptionId,
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
            <Stack px={3} pt={2} flexGrow={isCompact ? 0 : 1} overflow={'auto'}>
              <Stack mb={isCompact ? 4 : 5}>
                <Stack
                  direction="row"
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  mb={3}
                >
                  <Typography id={titleId} variant="h5" color={theme.colors.neutral.black}>
                    {t('title')}
                  </Typography>
                  <IconButton onClick={onClose} aria-label={tShared('closeIconAriaLabel')}>
                    <Close
                      fontSize="small"
                      sx={{
                        color: theme.colors.neutral.black,
                      }}
                    />
                  </IconButton>
                </Stack>
                <Typography
                  id={descriptionId}
                  variant="body2"
                  color={theme.colors.neutral.grey[700]}
                >
                  {t('subtitle')}
                </Typography>
              </Stack>
              {sections.map((section) => (
                <Stack key={section.title} gap={3} sx={{ mb: isCompact ? 0 : 4 }}>
                  {!isCompact && (
                    <Typography
                      fontSize={'16px'}
                      fontWeight={700}
                      color={theme.colors.neutral.black}
                    >
                      {section.title}
                    </Typography>
                  )}
                  {section.fields.map((field) => (
                    <FilterField key={field.name} field={field} />
                  ))}
                </Stack>
              ))}
            </Stack>
            <Stack
              direction={{ xs: 'column-reverse', md: 'row' }}
              pb={4}
              pt={isCompact ? 4 : 3}
              px={3}
              justifyContent={{ xs: 'center', md: 'flex-end' }}
              gap={isCompact ? 2 : { xs: 3, md: 4 }}
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
