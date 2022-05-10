import React, { ChangeEventHandler, FocusEventHandler, Ref } from 'react'
import { InputBaseComponentProps, TextField, InputProps } from '@mui/material'
import { StyledInputWrapper } from './StyledInputWrapper'
import { SxProps } from '@mui/system'

export type StyledInputTextType = 'text' | 'email' | 'number'

export type StyledInputControlledTextProps =
  | {
      name: string
      error?: string
      onChange?: ChangeEventHandler
      onBlur?: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>
      label?: string

      disabled?: boolean
      infoLabel?: string | JSX.Element

      inputProps?: InputBaseComponentProps
      InputProps?: InputProps
      multiline?: boolean
      rows?: number
      focusOnMount?: boolean
      sx?: SxProps
    } & (
      | {
          type?: 'text' | 'email'
          value?: string
        }
      | {
          type?: 'number'
          value?: number
        }
    )

const StyledInputControlledTextComponent = React.forwardRef<
  HTMLInputElement,
  StyledInputControlledTextProps
>(
  (
    {
      label,
      disabled = false,
      infoLabel,

      name,
      value,
      onChange,
      onBlur,
      error,

      inputProps,
      InputProps,
      type = 'text',
      multiline = false,
      rows = 6,
      focusOnMount = false,
      sx,
    },
    ref: Ref<HTMLInputElement>
  ) => {
    const hasFieldError = Boolean(error)

    return (
      <StyledInputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
        <TextField
          inputRef={ref}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          id={name} // used to generate the a11y htmlFor in label and id in input
          autoFocus={focusOnMount}
          multiline={multiline}
          rows={multiline ? rows : 1}
          disabled={disabled}
          sx={{ width: '100%' }}
          variant="outlined"
          label={label}
          type={type}
          error={hasFieldError}
          inputProps={inputProps}
          InputProps={InputProps}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </StyledInputWrapper>
    )
  }
)

StyledInputControlledTextComponent.displayName = 'StyledInputControlledText'

export const StyledInputControlledText = StyledInputControlledTextComponent
