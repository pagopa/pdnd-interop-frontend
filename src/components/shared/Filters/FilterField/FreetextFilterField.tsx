import type { FilterField } from '@/types/filters.types'
import { RHFTextField } from '../../react-hook-form-inputs'

type FreetextFilterFieldProps = {
  field: FilterField
}

export const FreetextFilterField: React.FC<FreetextFilterFieldProps> = ({ field }) => {
  // TODO: Replace the RHFTextField with updated component from MUINext
  return <RHFTextField name={field.name} label={field.label} />
}
