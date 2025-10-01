import { Drawer } from '@/components/shared/Drawer'
import { Alert, Box } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RHFRadioGroup } from './react-hook-form-inputs'
import type { EServiceMode } from '@/api/api.generatedTypes'

type UpdateEServicePersonalDataFormValues = {
  personalData: boolean | undefined
}

type UpdateEServicePersonalDataDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  eserviceId: string
  onSubmit: (id: string, personalData: boolean | undefined) => void
  personalData: boolean | undefined
  eserviceMode: EServiceMode
}

export const UpdateEServicePersonalDataDrawer: React.FC<UpdateEServicePersonalDataDrawerProps> = ({
  isOpen,
  onClose,
  eserviceId,
  onSubmit,
  personalData,
  eserviceMode,
}) => {
  const { t: tCommon } = useTranslation('common')
  const { t: tDrawer } = useTranslation('eservice', {
    keyPrefix: 'list.drawers.personalDataDrawer',
  })

  const defaultValues = {
    personalData: personalData,
  }

  const formMethods = useForm<UpdateEServicePersonalDataFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({ personalData: personalData })
  }, [personalData, formMethods])

  const handleSubmit = (values: UpdateEServicePersonalDataFormValues) => {
    onSubmit(eserviceId, values.personalData)
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
          label: tCommon('actions.save'),
        }}
      >
        <Alert severity="warning">{tDrawer('alertLabel')}</Alert>
        <Box component="form" noValidate>
          <RHFRadioGroup
            name="personalData"
            options={[
              { value: 'false', label: tDrawer(`options.${eserviceMode}.false`) },
              { value: 'true', label: tDrawer(`options.${eserviceMode}.true`) },
            ]}
          />
        </Box>
      </Drawer>
    </FormProvider>
  )
}
