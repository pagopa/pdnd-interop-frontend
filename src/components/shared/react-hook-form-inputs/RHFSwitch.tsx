import { InputWrapper } from '../InputWrapper'
import React from 'react'
import {
  Switch as MUISwitch,
  type SwitchProps as MUISwitchProps,
  FormControlLabel,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'

export type RHFSwitchProps = Omit<MUISwitchProps, 'checked' | 'onChange'> & {
  label: string | React.ReactNode
  infoLabel?: string
  name: string
  rules?: ControllerProps['rules']
  inputRef?: React.Ref<HTMLInputElement>
}

export const RHFSwitch: React.FC<RHFSwitchProps> = ({
  label,
  infoLabel,
  name,
  sx,
  rules,
  disabled,
  inputRef,
  ...props
}) => {
  const { formState } = useFormContext()
  const { t } = useTranslation()

  const error = formState.errors[name]?.message as string | undefined

  const { accessibilityProps, ids } = getAriaAccessibilityInputProps(name, {
    label,
    infoLabel,
    error,
  })

  return (
    <InputWrapper error={error} sx={sx} infoLabel={infoLabel} {...ids}>
      <Controller
        name={name}
        rules={mapValidationErrorMessages(rules, t)}
        render={({ field: { value, ref, ...fieldProps } }) => (
          <FormControlLabel
            control={
              <MUISwitch
                {...props}
                {...fieldProps}
                disabled={disabled}
                inputProps={{ ...props.inputProps, ...accessibilityProps }}
                checked={value}
                inputRef={mergeRefs(ref, inputRef)}
                sx={{ marginRight: 1 }}
              />
            }
            label={label}
          />
        )}
      />
    </InputWrapper>
  )
}

export function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  //Merging the refs so that both the RHF ref and the consumer's inputRef receive the underlying DOM node when it mounts.
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref != null) {
        ;(ref as React.MutableRefObject<T | null>).current = value
      }
    })
  }
}
