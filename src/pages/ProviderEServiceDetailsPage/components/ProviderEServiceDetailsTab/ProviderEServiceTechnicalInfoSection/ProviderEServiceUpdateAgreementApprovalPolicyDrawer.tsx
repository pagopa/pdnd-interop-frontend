import type { AgreementApprovalPolicy, ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { EServiceMutations } from '@/api/eservice'
import { Drawer } from '@/components/shared/Drawer'
import { RHFRadioGroup } from '@/components/shared/react-hook-form-inputs'
import { Box } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type UpdateAgreementApprovalPolicyFormValues = {
  agreementApprovalPolicy: AgreementApprovalPolicy
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
    agreementApprovalPolicy: descriptor.agreementApprovalPolicy,
  }

  const formMethods = useForm<UpdateAgreementApprovalPolicyFormValues>({ defaultValues })

  React.useEffect(() => {
    formMethods.reset({
      agreementApprovalPolicy: descriptor.agreementApprovalPolicy,
    })
  }, [descriptor, formMethods])

  const onSubmit = (values: UpdateAgreementApprovalPolicyFormValues) => {
    updateAgreementApprovalPolicy(
      {
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        agreementApprovalPolicy: values.agreementApprovalPolicy,
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
          <RHFRadioGroup
            name="agreementApprovalPolicy"
            options={[
              {
                label: t('agreementApprovalPolicyField.labelManual'),
                value: 'MANUAL',
              },
              {
                label: t('agreementApprovalPolicyField.labelAutomatic'),
                value: 'AUTOMATIC',
              },
            ]}
          />
        </Box>
      </Drawer>
    </FormProvider>
  )
}
