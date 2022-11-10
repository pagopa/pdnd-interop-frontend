import React from 'react'
import {
  SingleFileInput as PagoPASingleFileInput,
  SingleFileInputProps as PagoPASingleFileInputProps,
} from '@pagopa/mui-italia'
import { InputWrapper } from '../InputWrapper'
import { Controller, useFormContext } from 'react-hook-form'
import { SxProps } from '@mui/material'
import { useTranslation } from 'react-i18next'

type SingleFileInputProps = Omit<
  PagoPASingleFileInputProps,
  'value' | 'onFileSelected' | 'onFileRemoved' | 'dropzoneLabel' | 'loadingLabel'
> & {
  name: string
  infoLabel?: string | JSX.Element
  sx?: SxProps
}

export const SingleFileInput: React.FC<SingleFileInputProps> = ({ name, infoLabel, sx }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'singleFileInput' })
  const { formState, control, setValue } = useFormContext()

  const error = formState.errors[name]?.message as string | undefined

  return (
    <InputWrapper name={name} error={error} sx={sx} infoLabel={infoLabel}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <PagoPASingleFileInput
            value={field.value}
            onFileSelected={field.onChange}
            onFileRemoved={() => setValue(name, null)}
            dropzoneLabel={t('dropzoneLabel')}
            loadingLabel={t('loadingLabel')}
          />
        )}
      />
    </InputWrapper>
  )
}
