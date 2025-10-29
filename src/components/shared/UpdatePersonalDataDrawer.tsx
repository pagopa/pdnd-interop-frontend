import { Drawer } from '@/components/shared/Drawer'
import { Alert, Box } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RHFRadioGroup } from './react-hook-form-inputs'
import type { EServiceMode } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth/auth.hooks'

type UpdatePersonalDataFormValues = {
  personalData: boolean | undefined
}

type UpdatePersonalDataDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  eserviceId: string
  onSubmit: (id: string, personalData: boolean) => void
  personalData: boolean | undefined
  eserviceMode: EServiceMode
  where: 'e-service' | 'template e-service'
}

export const UpdatePersonalDataDrawer: React.FC<UpdatePersonalDataDrawerProps> = ({
  isOpen,
  onClose,
  eserviceId,
  onSubmit,
  personalData,
  eserviceMode,
  where,
}) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'personalDataDrawer' })
  const { t: tCommon } = useTranslation('common')

  const { isOperatorAPI } = AuthHooks.useJwt()

  const defaultValues = {
    personalData: personalData,
  }

  const formMethods = useForm<UpdatePersonalDataFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({ personalData: personalData })
  }, [personalData, formMethods])

  const handleSubmit = (values: UpdatePersonalDataFormValues) => {
    if (values.personalData === undefined) return
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
        title={t('title', { where })}
        subtitle={t('subtitle', { where })}
        buttonAction={{
          action: formMethods.handleSubmit(handleSubmit),
          label: tCommon('actions.save'),
        }}
      >
        <Alert severity="warning">
          {isOperatorAPI ? t('alertForAPIOperator') : t('alertLabel')}
        </Alert>
        <Box component="form" noValidate>
          <RHFRadioGroup
            name="personalData"
            options={[
              { value: false, label: t(`options.${eserviceMode}.false`) },
              { value: true, label: t(`options.${eserviceMode}.true`) },
            ]}
            isOptionValueAsBoolean
            rules={{
              validate: (value) =>
                value === true || value === false || tCommon('validation.mixed.required'),
            }}
          />
        </Box>
      </Drawer>
    </FormProvider>
  )
}
