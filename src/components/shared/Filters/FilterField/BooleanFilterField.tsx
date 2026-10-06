import type { FilterField } from '@/types/filters.types'
import { RHFSwitch } from '../../react-hook-form-inputs'

type BooleanFilterFieldProps = {
  field: FilterField
}

export const BooleanFilterField: React.FC<BooleanFilterFieldProps> = ({ field }) => {
  // TODO: Replace the RHFSwitch with updated component from MUINext
  return <RHFSwitch name={field.name} label={field.label} infoLabel={field.description} />
}
