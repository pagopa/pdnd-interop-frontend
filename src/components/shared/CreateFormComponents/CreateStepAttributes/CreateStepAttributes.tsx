import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Box, Divider } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { EServiceMutations } from '@/api/eservice'
import { useTranslation } from 'react-i18next'
import { StepActions } from '@/components/shared/StepActions'
import type {
  DescriptorAttribute,
  DescriptorAttributes,
  UpdateEServiceDescriptorSeed,
} from '@/api/api.generatedTypes'
import type { AttributeKey } from '@/types/attribute.types'
import { compareObjects } from '@/utils/common.utils'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'
import { useCreateContext } from '../../CreateContext'
import { TemplateMutations } from '@/api/template'
import { CreateAttributeDrawer } from './CreateAttributeDrawer'
import { AddAttributesToForm } from './AddAttributesToForm/AddAttributeToForm'

export type CreateStepAttributesFormValues = {
  attributes: DescriptorAttributes
}

export const CreateStepAttributes: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' }) //TODO
  const { descriptor, template, forward, back } = useCreateContext()

  const { mutate: updateEServiceVersionDraft } = EServiceMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })
  const { mutate: updateTemplateVersionDraft } = TemplateMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  const [createAttributeCreateDrawerState, setCreateAttributeCreateDrawerState] = React.useState<{
    attributeKey: Exclude<AttributeKey, 'certified'>
    isOpen: boolean
  }>({
    attributeKey: 'verified',
    isOpen: false,
  })

  const handleCloseAttributeCreateDrawer = () => {
    setCreateAttributeCreateDrawerState((prevState) => ({ ...prevState, isOpen: false }))
  }

  const handleOpenAttributeCreateDrawerFactory =
    (attributeKey: Exclude<AttributeKey, 'certified'>) => () => {
      setCreateAttributeCreateDrawerState({ attributeKey, isOpen: true })
    }

  const defaultValues: CreateStepAttributesFormValues = {
    attributes: descriptor?.attributes ?? { certified: [], verified: [], declared: [] },
  }

  const formMethods = useForm({ defaultValues })

  const onSubmit = (values: CreateStepAttributesFormValues) => {
    if (!descriptor && !template) return //TODO

    const removeEmptyAttributeGroups = (attributes: Array<Array<DescriptorAttribute>>) => {
      return attributes.filter((group) => group.length > 0)
    }

    const attributes = {
      certified: removeEmptyAttributeGroups(values.attributes.certified),
      verified: removeEmptyAttributeGroups(values.attributes.verified),
      declared: removeEmptyAttributeGroups(values.attributes.declared),
    }

    const areAttributesEquals = descriptor
      ? compareObjects(attributes, descriptor.attributes)
      : template && compareObjects(attributes, template.attributes)

    if (areAttributesEquals) {
      forward()
      return
    }

    const payloadEService: UpdateEServiceDescriptorSeed & {
      eserviceId: string
      descriptorId: string
    } = descriptor && {
      audience: descriptor.audience,
      voucherLifespan: descriptor.voucherLifespan,
      dailyCallsPerConsumer: descriptor.dailyCallsPerConsumer,
      dailyCallsTotal: descriptor.dailyCallsTotal,
      agreementApprovalPolicy: descriptor.agreementApprovalPolicy,
      description: descriptor.description,
      attributes: remapDescriptorAttributesToDescriptorAttributesSeed(attributes),
      eserviceId: descriptor.eservice.id,
      descriptorId: descriptor.id,
    }

    const payloadTemplate: UpdateEServiceDescriptorSeed & {
      eserviceId: string
      descriptorId: string
    } = template && {
      audience: template.audience,
      voucherLifespan: template.voucherLifespan,
      dailyCallsPerConsumer: template.dailyCallsPerConsumer,
      dailyCallsTotal: template.dailyCallsTotal,
      agreementApprovalPolicy: template.agreementApprovalPolicy,
      description: template.description,
      attributes: remapDescriptorAttributesToDescriptorAttributesSeed(attributes),
      eserviceId: template.eservice.id,
    }

    if (descriptor) {
      updateEServiceVersionDraft(payloadEService, { onSuccess: forward })
    }
    if (template) {
      updateTemplateVersionDraft(payloadTemplate, { onSuccess: forward })
    }
  }

  return (
    <>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <SectionContainer
            title={t('step3.attributesTitle', { versionNumber: descriptor?.version ?? '1' })}
            description={t('step3.attributesDescription')}
          >
            <AddAttributesToForm attributeKey="certified" readOnly={false} />
            <Divider sx={{ my: 3 }} />
            <AddAttributesToForm
              attributeKey="verified"
              readOnly={false}
              openCreateAttributeDrawer={handleOpenAttributeCreateDrawerFactory('verified')}
            />
            <Divider sx={{ my: 3 }} />
            <AddAttributesToForm
              attributeKey="declared"
              readOnly={false}
              openCreateAttributeDrawer={handleOpenAttributeCreateDrawerFactory('declared')}
            />
          </SectionContainer>
          <StepActions
            back={{
              label: t('backWithoutSaveBtn'),
              type: 'button',
              onClick: back,
              startIcon: <ArrowBackIcon />,
            }}
            forward={{ label: t('forwardWithSaveBtn'), type: 'submit', startIcon: <SaveIcon /> }}
          />
        </Box>
      </FormProvider>
      <CreateAttributeDrawer
        {...createAttributeCreateDrawerState}
        onClose={handleCloseAttributeCreateDrawer}
      />
    </>
  )
}

export const CreateStepAttributesSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={924} />
}
