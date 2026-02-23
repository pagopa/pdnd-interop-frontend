import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Box, Divider } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StepActions } from '@/components/shared/StepActions'
import type {
  DescriptorAttribute,
  UpdateEServiceTemplateVersionSeed,
} from '@/api/api.generatedTypes'
import type { AttributeKey } from '@/types/attribute.types'
import { compareObjects } from '@/utils/common.utils'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { CreateAttributeDrawer } from '../../../../components/shared/CreateAttributeDrawer'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'
import type { CreateStepAttributesFormValues } from '@/pages/ProviderEServiceCreatePage/components/EServiceCreateStepAttributes'
import { AddAttributesToForm } from '@/components/shared/AddAttributesToForm'

export const EServiceTemplateCreateStepAttributes: React.FC = () => {
  const { t } = useTranslation('eserviceTemplate', { keyPrefix: 'create' })
  const { eserviceTemplateVersion, forward, back } = useEServiceTemplateCreateContext()

  const { mutate: updateVersionDraft } = EServiceTemplateMutations.useUpdateVersionDraft({
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
    attributes: eserviceTemplateVersion?.attributes ?? {
      certified: [],
      verified: [],
      declared: [],
    },
  }

  const formMethods = useForm({ defaultValues })

  const onSubmit = (values: CreateStepAttributesFormValues) => {
    if (!eserviceTemplateVersion) return

    const removeEmptyAttributeGroups = (attributes: Array<Array<DescriptorAttribute>>) => {
      return attributes.filter((group) => group.length > 0)
    }

    const attributes = {
      certified: removeEmptyAttributeGroups(values.attributes.certified),
      verified: removeEmptyAttributeGroups(values.attributes.verified),
      declared: removeEmptyAttributeGroups(values.attributes.declared),
    }

    const areAttributesEquals = compareObjects(attributes, eserviceTemplateVersion.attributes)

    if (areAttributesEquals) {
      forward()
      return
    }

    const payload: UpdateEServiceTemplateVersionSeed & {
      eServiceTemplateId: string
      eServiceTemplateVersionId: string
    } = {
      dailyCallsPerConsumer: eserviceTemplateVersion.dailyCallsPerConsumer,
      dailyCallsTotal: eserviceTemplateVersion.dailyCallsTotal,
      agreementApprovalPolicy: eserviceTemplateVersion.agreementApprovalPolicy,
      description: eserviceTemplateVersion.description,
      eServiceTemplateVersionId: eserviceTemplateVersion.id,
      eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
      attributes: remapDescriptorAttributesToDescriptorAttributesSeed(attributes),
      voucherLifespan: eserviceTemplateVersion.voucherLifespan,
    }

    updateVersionDraft(payload, { onSuccess: forward })
  }

  return (
    <>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <SectionContainer
            title={t('step3.attributes.attributesTitle', {
              versionNumber: eserviceTemplateVersion?.version ?? 1,
            })}
            description={t('step3.attributes.attributesDescription')}
          >
            <AddAttributesToForm
              attributeKey="certified"
              readOnly={false}
              addGroupLabel={t('step3.attributesAddBtn')}
            />
            <Divider sx={{ my: 3 }} />
            <AddAttributesToForm
              attributeKey="verified"
              readOnly={false}
              addGroupLabel={t('step3.attributesAddBtn')}
              createAttributeAction={{
                label: t('step3.attributesCreateBtn'),
                openDrawer: handleOpenAttributeCreateDrawerFactory('verified'),
              }}
            />
            <Divider sx={{ my: 3 }} />
            <AddAttributesToForm
              attributeKey="declared"
              readOnly={false}
              addGroupLabel={t('step3.attributesAddBtn')}
              createAttributeAction={{
                label: t('step3.attributesCreateBtn'),
                openDrawer: handleOpenAttributeCreateDrawerFactory('declared'),
              }}
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

export const EServiceTemplateCreateStepAttributesSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={924} />
}
