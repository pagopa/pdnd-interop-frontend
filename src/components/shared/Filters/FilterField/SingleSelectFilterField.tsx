import type { SelectFilterFieldOptions } from '@/types/filters.types'
import { RHFSelect } from '../../react-hook-form-inputs'

type SingleSelectFilterFieldProps = {
  field: SelectFilterFieldOptions
}

export const SingleSelectFilterField: React.FC<SingleSelectFilterFieldProps> = ({ field }) => {
  // TODO: Replace the RHFSelect with updated component from MUINext
  return <RHFSelect name={field.name} label={field.label} options={field.options} />
}
