import { Drawer } from '@/components/shared/Drawer'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { Box, Typography } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type UpdateInstanceLabelFormValues = {
  instanceLabel: string
}

type UpdateInstanceLabelDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  eServiceId: string
  currentInstanceLabel: string
  templateName: string
  onSubmit: (eServiceId: string, instanceLabel: string) => void
}

export type UpdateInstanceLabelDrawerRef = {
  setFieldError: (message: string) => void
}

export const UpdateInstanceLabelDrawer = React.forwardRef<
  UpdateInstanceLabelDrawerRef,
  UpdateInstanceLabelDrawerProps
>(function UpdateInstanceLabelDrawer(
  { isOpen, onClose, eServiceId, currentInstanceLabel, templateName, onSubmit },
  ref
) {
  const { t: tCommon } = useTranslation('common')
  const { t: tDrawer } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.updateInstanceLabelDrawer',
  })

  const defaultValues = {
    instanceLabel: currentInstanceLabel,
  }

  const formMethods = useForm<UpdateInstanceLabelFormValues>({ defaultValues })

  const watchedInstanceLabel = formMethods.watch('instanceLabel')

  React.useImperativeHandle(ref, () => ({
    setFieldError: (message: string) => {
      formMethods.setError('instanceLabel', { type: 'manual', message })
    },
  }))

  React.useEffect(() => {
    formMethods.reset({ instanceLabel: currentInstanceLabel })
  }, [currentInstanceLabel, formMethods])

  const handleSubmit = (values: UpdateInstanceLabelFormValues) => {
    onSubmit(eServiceId, values.instanceLabel)
  }

  const handleCloseDrawer = () => {
    onClose()
  }

  const handleTransitionExited = () => {
    formMethods.reset(defaultValues)
  }

  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        onTransitionExited={handleTransitionExited}
        onClose={handleCloseDrawer}
        title={tDrawer('title')}
        subtitle={tDrawer('subtitle')}
        buttonAction={{
          action: formMethods.handleSubmit(handleSubmit),
          label: tCommon('actions.upgrade'),
        }}
      >
        <Box component="form" noValidate>
          <RHFTextField
            sx={{ mt: 2, mb: 2 }}
            focusOnMount
            name="instanceLabel"
            label={tDrawer('instanceLabelField.label')}
            infoLabel={tDrawer('instanceLabelField.infoLabel')}
            type="text"
            size="small"
            inputProps={{ maxLength: 12 }}
            rules={{
              required: tDrawer('instanceLabelField.validation.required'),
            }}
          />
          {watchedInstanceLabel && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {tDrawer('instanceLabelField.catalogPreviewLabel')}
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {templateName} - {watchedInstanceLabel}
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </FormProvider>
  )
})
