import React from 'react'
import { TextField as MUITextField, TextFieldProps as MUITextFieldProps } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { Controller, ControllerProps, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { InputWrapper } from '../InputWrapper'
import { mapValidationErrorMessages } from '@/utils/validation.utils'

export type FilterTextFieldProps = Omit<MUITextFieldProps, 'type'> & {
  name: string
  infoLabel?: string
  focusOnMount?: boolean
  rules?: ControllerProps['rules']
} & (
    | {
        type?: 'text' | 'email'
        onValueChange?: (value: string) => void
      }
    | {
        type?: 'number'
        onValueChange?: (value: number) => void
      }
  )

export const FilterTextField: React.FC<FilterTextFieldProps> = ({
  sx,
  name,
  infoLabel,
  focusOnMount,
  multiline,
  onValueChange,
  rules,
  InputProps,
  ...props
}) => {
  const { formState } = useFormContext()
  const { t } = useTranslation()

  const error = formState.errors[name]?.message as string | undefined

  return (
    <InputWrapper error={error} sx={sx} infoLabel={infoLabel}>
      <Controller
        name={name}
        rules={mapValidationErrorMessages(rules, t)}
        render={({ field: { ref, onChange: _onChange, ...fieldProps } }) => (
          <MUITextField
            autoFocus={focusOnMount}
            {...props}
            multiline={multiline}
            rows={multiline ? 6 : undefined}
            InputLabelProps={{ shrink: true, ...props?.InputLabelProps }}
            error={!!error}
            onChange={(e) => {
              let value: string | number = e.target.value
              if (props.type === 'number') {
                const valueAsNumber = parseInt(e.target.value, 10)
                value = isNaN(valueAsNumber) ? '' : valueAsNumber
              }
              _onChange(value)
              if (onValueChange) onValueChange(value as never)
            }}
            inputRef={ref}
            InputProps={{
              ...InputProps,
              endAdornment: (
                /* TODO put the right color */
                <>
                  <SearchIcon sx={{ color: 'background', size: 20 }} />
                </>
              ),
            }}
            {...fieldProps}
          />
        )}
      />
    </InputWrapper>
  )

  // return (
  //   <RHFTextField
  //     sx={sx}
  //     name={name}
  //     InputProps={{
  //       ...InputProps,
  //       endAdornment: (
  //         <>
  //           <SearchIcon sx={{ color: 'grey', size: 20 }} />
  //         </>
  //       ),
  //     }}
  //     {...props}
  //   />
  // )
}
