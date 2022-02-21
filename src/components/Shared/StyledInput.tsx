import React from 'react'
import {
  StyledInputControlledCheckboxMultiple,
  StyledInputControlledCheckboxMultipleProps,
} from './StyledInputControlledCheckboxMultiple'
import {
  StyledInputControlledRadio,
  StyledInputControlledRadioProps,
} from './StyledInputControlledRadio'
import {
  StyledInputControlledSelect,
  StyledInputControlledSelectProps,
} from './StyledInputControlledSelect'
import {
  StyledInputControlledText,
  StyledInputControlledTextProps,
} from './StyledInputControlledText'

type StyledInput =
  | StyledInputControlledTextProps
  | StyledInputControlledRadioProps
  | StyledInputControlledCheckboxMultipleProps
  | StyledInputControlledSelectProps

function match<T>(
  onText: (props: StyledInputControlledTextProps) => T,
  onRadio: (props: StyledInputControlledRadioProps) => T,
  onCheckbox: (props: StyledInputControlledCheckboxMultipleProps) => T,
  onSelect: (props: StyledInputControlledSelectProps) => T
) {
  return (props: StyledInput) => {
    switch (props.type) {
      case 'text':
        return onText(props)
      case 'radio':
        return onRadio(props)
      case 'checkbox':
        return onCheckbox(props)
      case 'select-one':
        return onSelect(props)
      default:
        return null
    }
  }
}

export const StyledInput = match(
  (props) => <StyledInputControlledText {...props} />,
  (props) => <StyledInputControlledRadio {...props} />,
  (props) => <StyledInputControlledCheckboxMultiple {...props} />,
  (props) => <StyledInputControlledSelect {...props} />
)
