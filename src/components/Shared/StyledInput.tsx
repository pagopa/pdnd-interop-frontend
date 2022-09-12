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
  StyledInputControlledSwitch,
  StyledInputControlledSwitchProps,
} from './StyledInputControlledSwitch'
import {
  StyledInputControlledText,
  StyledInputControlledTextProps,
} from './StyledInputControlledText'

type StyledInput =
  | StyledInputControlledTextProps
  | StyledInputControlledRadioProps
  | StyledInputControlledCheckboxMultipleProps
  | StyledInputControlledSelectProps
  | StyledInputControlledSwitchProps

function match<T>(
  onText: (props: StyledInputControlledTextProps) => T,
  onRadio: (props: StyledInputControlledRadioProps) => T,
  onCheckbox: (props: StyledInputControlledCheckboxMultipleProps) => T,
  onSelect: (props: StyledInputControlledSelectProps) => T,
  onSwitch: (props: StyledInputControlledSwitchProps) => T
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
      case 'switch':
        return onSwitch(props)
      default:
        return null
    }
  }
}

export const StyledInput = match(
  (props) => <StyledInputControlledText {...props} />,
  (props) => <StyledInputControlledRadio {...props} />,
  (props) => <StyledInputControlledCheckboxMultiple {...props} />,
  (props) => <StyledInputControlledSelect {...props} />,
  (props) => <StyledInputControlledSwitch {...props} />
)
