import React from 'react'
import { Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import isEqual from 'lodash/isEqual'
import { MISingleDropdownItem } from '@pagopa/mui-italia/components/MISingleDropdownItem'
import type { CompactTenant } from '@/api/api.generatedTypes'
import {
  formatHierarchyWithoutParentRoot,
  formatTenantHierarchy,
  getRootTenantFromHierarchy,
} from '@/utils/tenant.utils'
import RHFNewAutocompleteBase, {
  type RHFNewAutocompleteBaseProps,
} from '../RHFNewAutocomplete/RHFNewAutocompleteBase'
import { MIAvatar } from '@pagopa/mui-italia'

export type RHFTenantAutoCompleteMultipleFieldProps = Omit<
  RHFNewAutocompleteBaseProps<CompactTenant, true>,
  | 'options'
  | 'onChange'
  | 'value'
  | 'multiple'
  | 'getOptionLabel'
  | 'renderOption'
  | 'setInternalState'
> & {
  options: CompactTenant[]
}

const tenantLevelClampSx = {
  display: '-webkit-box',
  overflow: 'hidden',
  overflowWrap: 'anywhere',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
} as const

function TenantOption({ tenant }: { tenant: CompactTenant }) {
  const title = formatHierarchyWithoutParentRoot(tenant, tenant.parentTenants)
  const tenantRoot = getRootTenantFromHierarchy(tenant.parentTenants)

  return (
    <MISingleDropdownItem
      value={tenant.id}
      leftSlot={<MIAvatar size="small" alt={title} src={tenant.logoUrl} />}
      sx={(theme) => ({
        width: `calc(100% + ${theme.spacing(4)})`,
        marginLeft: theme.spacing(-2),
      })}
      centralSlot={
        <>
          <Typography
            component="span"
            variant="body1"
            title={title}
            sx={[
              tenantLevelClampSx,
              (theme) => ({
                fontSize: theme.typography.pxToRem(16),
                lineHeight: theme.typography.pxToRem(22),
                fontWeight: theme.typography.fontWeightMedium,
              }),
            ]}
          >
            {title}
          </Typography>
          {tenantRoot && (
            <Typography
              component="span"
              variant="caption"
              title={tenantRoot}
              sx={[
                tenantLevelClampSx,
                (theme) => ({
                  color: theme.palette.text.secondary,
                  fontSize: theme.typography.pxToRem(14),
                  fontWeight: theme.typography.fontWeightRegular,
                  lineHeight: theme.typography.pxToRem(20),
                }),
              ]}
            >
              {tenantRoot}
            </Typography>
          )}
        </>
      }
    />
  )
}

export function RHFTenantAutoCompleteMultipleField({
  options,
  ...props
}: RHFTenantAutoCompleteMultipleFieldProps) {
  const { watch } = useFormContext()
  const watchedValues = watch(props.name) as Array<string> | undefined

  const [internalState, setInternalState] = React.useState<CompactTenant[]>([])

  React.useEffect(() => {
    setInternalState((currentState) => {
      const nextState = (watchedValues ?? []).map((selectedValue) => {
        const availableOption = options.find(({ id }) => id === selectedValue)
        const previousOption = currentState.find(({ id }) => id === selectedValue)

        return availableOption ?? previousOption ?? { id: selectedValue, name: selectedValue }
      })

      return isEqual(currentState, nextState) ? currentState : nextState
    })
  }, [options, watchedValues])

  return (
    <RHFNewAutocompleteBase
      multiple
      {...props}
      options={options}
      //a11y: accessibility label for the autocomplete field
      getOptionLabel={(tenant) => formatTenantHierarchy(tenant.name, tenant.parentTenants)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionValue={(data) => data.map((tenant) => tenant.id)}
      value={internalState}
      showSelectionCountOnly
      setInternalState={setInternalState}
      renderOption={(tenant) => <TenantOption tenant={tenant} />}
    />
  )
}
