import React from 'react'
import {
  SingleFileInput as PagoPASingleFileInput,
  type SingleFileInputProps as PagoPASingleFileInputProps,
} from '@pagopa/mui-italia'
import { InputWrapper } from '../InputWrapper'
import { Controller, useFormContext } from 'react-hook-form'
import type { SxProps } from '@mui/material'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { mapValidationErrorMessages } from '@/utils/form.utils'

export type RHFSingleFileInputProps = Omit<
  PagoPASingleFileInputProps,
  'value' | 'onFileSelected' | 'onFileRemoved' | 'dropzoneLabel' | 'loadingLabel'
> & {
  name: string
  infoLabel?: string | JSX.Element
  sx?: SxProps
  rules?: ControllerProps['rules']
  onValueChange?: (value: File | null) => void
}

export const RHFSingleFileInput: React.FC<RHFSingleFileInputProps> = ({
  name,
  infoLabel,
  sx,
  rules,
  onValueChange,
}) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'singleFileInput' })
  const { t: tCommon } = useTranslation()
  const { formState, setValue } = useFormContext()

  const error = formState.errors[name]?.message as string | undefined

  return (
    <InputWrapper error={error} sx={sx} infoLabel={infoLabel}>
      <Controller
        name={name}
        rules={mapValidationErrorMessages(rules, tCommon)}
        render={({ field }) => (
          <PagoPASingleFileInput
            value={field.value}
            onFileSelected={(file: File) => {
              field.onChange(file)
              if (onValueChange) onValueChange(file)
            }}
            onFileRemoved={() => {
              setValue(name, null)
              if (onValueChange) onValueChange(null)
            }}
            error={!!error}
            dropzoneLabel={t('dropzoneLabel')}
            loadingLabel={t('loadingLabel')}
          />
        )}
      />
    </InputWrapper>
  )
}
