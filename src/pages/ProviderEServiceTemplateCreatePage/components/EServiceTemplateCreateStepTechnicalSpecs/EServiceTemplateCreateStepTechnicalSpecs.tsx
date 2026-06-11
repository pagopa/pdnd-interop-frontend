import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { useTranslation } from 'react-i18next'
import { EServiceTemplateCreateStepTechnicalSpecsInterface } from './EServiceTemplateCreateStepTechnicalSpecsInterface'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { Alert, Box, Stack } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'
import { minutesToSeconds, secondsToMinutes } from '@/utils/format.utils'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'
import type { UpdateEServiceTemplateVersionSeed } from '@/api/api.generatedTypes'
import { getAsyncExchangePropertiesWithDefaults } from '@/utils/eservice.utils'
import { EServiceTemplateAsyncExchangeSection } from './EServiceTemplateAsyncExchangeSection'
import { RestInterfaceDescription } from '@/components/shared/RestInterfaceDescription'

type EServiceTemplateCreateStepTechnicalSpecsFormValues = {
  voucherLifespan: number
  asyncExchangeProperties: {
    responseTime: number | ''
    resourceAvailableTime: number | ''
    maxResultSet: number | ''
    confirmation: boolean
    bulk: boolean
  }
}

export const EServiceTemplateCreateStepTechnicalSpecs: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eserviceTemplate')

  const { eserviceTemplateVersion, forward, back } = useEServiceTemplateCreateContext()

  const { mutate: updateVersionDraft } = EServiceTemplateMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  const defaultValues: EServiceTemplateCreateStepTechnicalSpecsFormValues = {
    voucherLifespan: eserviceTemplateVersion
      ? secondsToMinutes(eserviceTemplateVersion.voucherLifespan)
      : 1,
    asyncExchangeProperties: getAsyncExchangePropertiesWithDefaults(
      eserviceTemplateVersion?.asyncExchangeProperties
    ),
  }

  const formMethods = useForm({ defaultValues })

  const onSubmit = (values: EServiceTemplateCreateStepTechnicalSpecsFormValues) => {
    if (!eserviceTemplateVersion) return
    const { asyncExchangeProperties } = values
    const isAsyncExchange = eserviceTemplateVersion.eserviceTemplate.asyncExchange === true
    const isSoap = eserviceTemplateVersion.eserviceTemplate.technology === 'SOAP'

    const payload: UpdateEServiceTemplateVersionSeed = {
      description: eserviceTemplateVersion.description,
      attributes: remapDescriptorAttributesToDescriptorAttributesSeed(
        eserviceTemplateVersion.attributes
      ),
      voucherLifespan: minutesToSeconds(values.voucherLifespan),
      agreementApprovalPolicy: eserviceTemplateVersion.agreementApprovalPolicy,
      dailyCallsPerConsumer: eserviceTemplateVersion.dailyCallsPerConsumer,
      dailyCallsTotal: eserviceTemplateVersion.dailyCallsTotal,
      ...(isAsyncExchange
        ? {
            asyncExchangeProperties: {
              responseTime: Number(asyncExchangeProperties.responseTime),
              resourceAvailableTime: Number(asyncExchangeProperties.resourceAvailableTime),
              maxResultSet: Number(asyncExchangeProperties.maxResultSet),
              confirmation: asyncExchangeProperties.confirmation,
              bulk: isSoap ? false : asyncExchangeProperties.bulk,
            },
          }
        : {}),
    }

    updateVersionDraft(
      {
        ...payload,
        eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
        eServiceTemplateVersionId: eserviceTemplateVersion.id,
      },
      { onSuccess: forward }
    )
  }

  const sectionDescription =
    eserviceTemplateVersion?.eserviceTemplate.technology === 'SOAP' ? (
      t(`create.step3.technicalSpecs.interface.description.soap`)
    ) : (
      <RestInterfaceDescription
        description={t('create.step3.technicalSpecs.interface.description.rest')}
        beforePublishing={t('create.step3.technicalSpecs.interface.description.beforePublishing')}
        technicalCompliance={t(
          'create.step3.technicalSpecs.interface.description.technicalCompliance'
        )}
        technicalComplianceDescription={t(
          'create.step3.technicalSpecs.interface.description.technicalComplianceDescription'
        )}
        semanticCompliance={t(
          'create.step3.technicalSpecs.interface.description.semanticCompliance'
        )}
        semanticComplianceDescription={t(
          'create.step3.technicalSpecs.interface.description.semanticComplianceDescription'
        )}
        openApiCheckerLabel={t('create.step3.technicalSpecs.interface.description.restLinkLabel')}
        schemaEditorLabel={t(
          'create.step3.technicalSpecs.interface.description.schemaEditorLinkLabel'
        )}
      />
    )

  return (
    <FormProvider {...formMethods}>
      <SectionContainer
        title={t('create.step3.technicalSpecs.interface.title')}
        description={sectionDescription}
        descriptionTypographyProps={{
          component:
            eserviceTemplateVersion?.eserviceTemplate.technology === 'REST' ? 'div' : undefined,
        }}
      >
        <Stack spacing={3}>
          <Alert severity="info"> {t('create.step3.technicalSpecs.interface.alert')}</Alert>
          <EServiceTemplateCreateStepTechnicalSpecsInterface />
        </Stack>
      </SectionContainer>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer title={t('create.step3.technicalSpecs.voucher.title')}>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <RHFTextField
              size="small"
              name="voucherLifespan"
              label={t('create.step3.technicalSpecs.voucher.voucherLifespanField.label')}
              infoLabel={t('create.step3.technicalSpecs.voucher.voucherLifespanField.infoLabel')}
              type="number"
              inputProps={{ min: 1, max: 1440 }}
              rules={{ required: true, min: 1, max: 1440 }}
              sx={{ flex: 0.49, my: 0 }}
            />
          </Stack>
        </SectionContainer>
        {eserviceTemplateVersion?.eserviceTemplate.asyncExchange && (
          <EServiceTemplateAsyncExchangeSection />
        )}
        <StepActions
          back={{
            label: t('create.backWithoutSaveBtn'),
            type: 'button',
            onClick: back,
            startIcon: <ArrowBackIcon />,
          }}
          forward={{
            label: t('create.forwardWithSaveBtn'),
            type: 'submit',
            startIcon: <SaveIcon />,
          }}
        />
      </Box>
    </FormProvider>
  )
}

export const EServiceTemplateCreateStepTechnicalSpecsSkeleton: React.FC = () => {
  return (
    <>
      <SectionContainerSkeleton height={365} />
      <SectionContainerSkeleton height={178} />
    </>
  )
}
