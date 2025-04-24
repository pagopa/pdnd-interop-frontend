import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { EServiceMutations } from '@/api/eservice'
import { Drawer } from '@/components/shared/Drawer'
import { RHFSwitch } from '@/components/shared/react-hook-form-inputs'
import { Box } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type UpdateAgreementApprovalPolicyFormValues = {
  isAgreementApprovalPolicyManual: boolean
}

type ProviderEServiceUpdateAgreementApprovalPolicyDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  descriptor: ProducerEServiceDescriptor
}

export const ProviderEServiceUpdateAgreementApprovalPolicyDrawer: React.FC<
  ProviderEServiceUpdateAgreementApprovalPolicyDrawerProps
> = ({ isOpen, onClose, descriptor }) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.updateAgreementApprovalPolicyDrawer',
  })
  const { t: tCommon } = useTranslation('common')

  const { mutate: updateAgreementApprovalPolicy } =
    EServiceMutations.useUpdateAgreementApprovalPolicy()

  const defaultValues = {
    isAgreementApprovalPolicyManual: descriptor.agreementApprovalPolicy === 'MANUAL' ? true : false,
  }

  const formMethods = useForm<UpdateAgreementApprovalPolicyFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({
      isAgreementApprovalPolicyManual:
        descriptor.agreementApprovalPolicy === 'MANUAL' ? true : false,
    })
  }, [descriptor, formMethods])

  const onSubmit = (values: UpdateAgreementApprovalPolicyFormValues) => {
    updateAgreementApprovalPolicy(
      {
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        agreementApprovalPolicy: values.isAgreementApprovalPolicyManual ? 'MANUAL' : 'AUTOMATIC',
      },
      { onSuccess: onClose }
    )
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
        onClose={handleCloseDrawer}
        title={t('title')}
        subtitle={t('subtitle')}
        buttonAction={{
          label: tCommon('actions.saveEdits'),
          action: formMethods.handleSubmit(onSubmit),
        }}
        onTransitionExited={handleTransitionExited}
      >
        <Box component="form" noValidate>
          <RHFSwitch
            name="isAgreementApprovalPolicyManual"
            label={t('agreementApprovalPolicyField.label')}
          />
        </Box>
      </Drawer>
    </FormProvider>
  )
}
