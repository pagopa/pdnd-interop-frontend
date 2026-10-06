import type { NumericFilterFieldOptions } from '@/types/filters.types'
import { RHFTextField } from '../../react-hook-form-inputs'

type NumericFilterFieldProps = {
  field: NumericFilterFieldOptions
}

export const NumericFilterField: React.FC<NumericFilterFieldProps> = ({ field }) => {
  // TODO: Replace the RHFTextField with updated component from MUINext
  return (
    <RHFTextField
      name={field.name}
      label={field.label}
      InputProps={{
        inputProps: {
          min: field.min,
          max: field.max,
        },
      }}
    />
  )
}
