import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Box, Divider } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StepActions } from '@/components/shared/StepActions'
import type {
  DescriptorAttribute,
  DescriptorAttributes,
  UpdateEServiceDescriptorSeed,
  UpdateEServiceTemplateSeed,
  UpdateEServiceTemplateVersionSeed,
} from '@/api/api.generatedTypes'
import type { AttributeKey } from '@/types/attribute.types'
import { compareObjects } from '@/utils/common.utils'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { CreateAttributeDrawer } from '../../../../components/shared/CreateAttributeDrawer'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { TemplateMutations, TemplateQueries } from '@/api/template'
import { CreateStepAttributesFormValues } from '@/pages/ProviderEServiceCreatePage/components/EServiceCreateStepAttributes'
import { AddAttributesToForm } from '@/components/shared/AddAttributesToForm'
import { useQuery } from '@tanstack/react-query'

export const EServiceTemplateCreateStepAttributes: React.FC = () => {
  const { t } = useTranslation('template', { keyPrefix: 'create' })
  const { template: producerEserviceTemplate, forward, back } = useEServiceTemplateCreateContext()

  const templateId = producerEserviceTemplate?.id
  const versionTemplateId = producerEserviceTemplate?.draftVersion?.id

  const template =
    templateId && versionTemplateId
      ? useQuery(TemplateQueries.getSingle(templateId, versionTemplateId))
      : undefined

  const { mutate: updateVersionDraft } = TemplateMutations.useUpdateVersionDraft({
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
    attributes: template?.data?.attributes ?? { certified: [], verified: [], declared: [] },
  }

  const formMethods = useForm({ defaultValues })

  const onSubmit = (values: CreateStepAttributesFormValues) => {
    if (!template?.data) return //TODO CONTROLLO CHECK

    const removeEmptyAttributeGroups = (attributes: Array<Array<DescriptorAttribute>>) => {
      return attributes.filter((group) => group.length > 0)
    }

    const attributes = {
      certified: removeEmptyAttributeGroups(values.attributes.certified),
      verified: removeEmptyAttributeGroups(values.attributes.verified),
      declared: removeEmptyAttributeGroups(values.attributes.declared),
    }

    const areAttributesEquals = compareObjects(attributes, template.data.attributes)

    if (areAttributesEquals) {
      forward()
      return
    }

    const payload: UpdateEServiceTemplateVersionSeed & {
      eServiceTemplateId: string
      eServiceTemplateVersionId: string
    } = {
      eServiceTemplateVersionId: template.data.id,
      eServiceTemplateId: template.data.eserviceTemplate.id, //TODO
      attributes: remapDescriptorAttributesToDescriptorAttributesSeed(attributes),
      voucherLifespan: template.data.voucherLifespan,
    }

    updateVersionDraft(payload, { onSuccess: forward })
  }

  return (
    <>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <SectionContainer
            title={t('step3.attributesTitle', { versionNumber: template?.data?.version ?? 1 })}
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

export const EServiceTemplateCreateStepAttributesSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={924} />
}
