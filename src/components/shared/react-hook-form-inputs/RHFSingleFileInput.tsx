import React from 'react'
import {
  SingleFileInput as PagoPASingleFileInput,
  type SingleFileInputProps as PagoPASingleFileInputProps,
} from '@pagopa/mui-italia'
import { InputWrapper } from '../InputWrapper'
import { Controller, useFormContext } from 'react-hook-form'
import { Box, IconButton, Typography, type SxProps } from '@mui/material'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { mapValidationErrorMessages } from '@/utils/form.utils'
import CloseIcon from '@mui/icons-material/Close'
import AttachFileIcon from '@mui/icons-material/AttachFile'

export type RHFSingleFileInputProps = Omit<
  PagoPASingleFileInputProps,
  'value' | 'onFileSelected' | 'onFileRemoved' | 'dropzoneLabel' | 'loadingLabel'
> & {
  name: string
  infoLabel?: string | JSX.Element
  sx?: SxProps
  rules?: ControllerProps['rules']
  onValueChange?: (value: File | null) => void
  drawerStyle?: boolean
}

export const RHFSingleFileInput: React.FC<RHFSingleFileInputProps> = ({
  name,
  infoLabel,
  sx,
  rules,
  onValueChange,
  drawerStyle = false,
}) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'singleFileInput' })
  const { t: tCommon } = useTranslation()
  const { formState, setValue } = useFormContext()

  const error = formState.errors[name]?.message as string | undefined

  const handleFileRemoved = () => {
    setValue(name, null)
    if (onValueChange) onValueChange(null)
  }

  return (
    <InputWrapper error={error} sx={sx} infoLabel={infoLabel}>
      <Controller
        name={name}
        rules={mapValidationErrorMessages(rules, tCommon)}
        render={({ field }) => {
          if (drawerStyle && field.value) {
            return (
              <RHFSingleFileInputDisplay value={field.value} onFileRemoved={handleFileRemoved} />
            )
          }

          return (
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
          )
        }}
      />
    </InputWrapper>
  )
}

type RHFSingleFileInputDisplayProps = {
  value: File
  onFileRemoved: VoidFunction
}

const RHFSingleFileInputDisplay: React.FC<RHFSingleFileInputDisplayProps> = ({
  value,
  onFileRemoved,
}) => {
  const truncatedFileName = React.useMemo(() => {
    const splittedFileName = value.name.split('.')
    const truncatedFileName = splittedFileName[0]
    if (truncatedFileName.length >= 7) {
      return `${truncatedFileName.slice(0, 7)}...`
    }
    return value.name
  }, [value.name])

  const handleFileRemoved = () => {
    onFileRemoved()
  }

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{ width: '100%' }}
      height={80}
      border={'1px solid'}
      borderColor="primary.main"
      borderRadius="10px"
      bgcolor="white"
      px={4}
    >
      <Box display="flex" justifyContent="center" alignItems="center">
        <AttachFileIcon sx={{ mr: 1 }} color="primary" />
        <Typography color="primary">{truncatedFileName}</Typography>
        <Typography fontWeight={600} sx={{ marginLeft: '60px' }}>
          {(value.size / 1024).toFixed(0)}&nbsp;KB
        </Typography>
      </Box>
      <IconButton onClick={handleFileRemoved}>
        <CloseIcon />
      </IconButton>
    </Box>
  )
}
