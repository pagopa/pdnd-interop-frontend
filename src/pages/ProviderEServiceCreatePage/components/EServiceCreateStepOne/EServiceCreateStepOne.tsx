import React from 'react'
import { SectionContainerSkeleton } from '@/components/layout/containers'
import { Box } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { StepActions } from '@/components/shared/StepActions'
import { useNavigate, useParams } from '@/router'
import { EServiceMutations } from '@/api/eservice'
import type {
  EServiceMode,
  EServiceTechnology,
  EServiceTemplateDetails,
  InstanceEServiceSeed,
  ProducerEServiceDescriptor,
} from '@/api/api.generatedTypes'
import { compareObjects } from '@/utils/common.utils'
import SaveIcon from '@mui/icons-material/Save'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { AuthHooks } from '@/api/auth'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'
import { EServiceInfoSection } from '../sections/EServiceInfoSection'
import { EServiceDetailsSection } from '../sections/EServiceDetailsSection'
import { EServiceTemplateInfoSection } from '../sections/EServiceTemplateInfoSection'
import { DelegationSection } from '../sections/DelegationSection'
import { SignalHubSection } from '../sections/SignalHubSection'

export type EServiceCreateStepOneFormValues = {
  name: string
  description: string
  technology: EServiceTechnology
  mode: EServiceMode
  personalData: boolean | undefined
  isSignalHubEnabled: boolean
  isConsumerDelegable: boolean
  isClientAccessDelegable: boolean
}

export const EServiceCreateStepOne: React.FC = () => {
  const { isOrganizationAllowedToProduce } = AuthHooks.useJwt()

  const { t } = useTranslation('eservice')
  const navigate = useNavigate()

  const { eServiceTemplateId } = useParams<'PROVIDE_ESERVICE_FROM_TEMPLATE_CREATE'>()

  const {
    descriptor,
    areEServiceGeneralInfoEditable,
    forward,
    eserviceMode,
    onEserviceModeChange,
    eserviceTemplate,
  } = useEServiceCreateContext()

  const { mutate: updateDraft } = EServiceMutations.useUpdateDraft()
  const { mutate: createDraft } = EServiceMutations.useCreateDraft()
  const { mutate: createDraftFromTemplate } =
    EServiceTemplateMutations.useCreateInstanceFromEServiceTemplate()
  const { mutate: updateDraftFromTemplate } =
    EServiceTemplateMutations.useUpdateInstanceFromEServiceTemplate()

  const isEserviceFromTemplate = Boolean(descriptor?.templateRef) || !!eserviceTemplate

  // If Template ID is present we are inheriting an e-service fields from a eserviceTemplate
  const defaultValues = evaluateFormDefaultValues(eserviceTemplate, descriptor, eserviceMode)
  const formMethods = useForm({ defaultValues })

  const onSubmit = (formValues: EServiceCreateStepOneFormValues & InstanceEServiceSeed) => {
    // If we are editing an existing e-service, we update the draft
    if (descriptor) {
      // If nothing has changed skip the update call
      const isEServiceTheSame = compareObjects(formValues, descriptor?.eservice)

      if (!isEServiceTheSame) {
        isEserviceFromTemplate
          ? updateDraftFromTemplate(
              {
                eServiceId: descriptor.eservice.id,
                isClientAccessDelegable: formValues.isClientAccessDelegable,
                isConsumerDelegable: formValues.isConsumerDelegable,
                isSignalHubEnabled: formValues.isSignalHubEnabled,
              },
              { onSuccess: forward }
            )
          : updateDraft(
              { eserviceId: descriptor.eservice.id, ...formValues },
              { onSuccess: forward }
            )
      } else forward()

      return
    }

    onCreateDraft(formValues)
  }

  const onCreateDraft = (formValues: EServiceCreateStepOneFormValues & InstanceEServiceSeed) => {
    // If we are creating a new e-service we need to understand if we are creating it from a eserviceTemplate or not
    if (!eserviceTemplate) {
      createDraft(formValues, {
        onSuccess({ id, descriptorId }) {
          navigate('PROVIDE_ESERVICE_EDIT', {
            params: { eserviceId: id, descriptorId },
            replace: true,
            state: { stepIndexDestination: 1 },
          })
          forward()
        },
      })
    } else {
      const body: InstanceEServiceSeed & { eServiceTemplateId: string } = {
        eServiceTemplateId: eServiceTemplateId,
        isClientAccessDelegable: formValues.isClientAccessDelegable,
        isConsumerDelegable: formValues.isConsumerDelegable,
        isSignalHubEnabled: formValues.isSignalHubEnabled,
      }

      createDraftFromTemplate(body, {
        onSuccess({ id, descriptorId }) {
          navigate('PROVIDE_ESERVICE_EDIT', {
            params: { eserviceId: id, descriptorId },
            replace: true,
            state: { stepIndexDestination: 1 },
          })
          forward()
        },
      })
    }
  }

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        {eserviceTemplate ? (
          <EServiceTemplateInfoSection eserviceTemplate={eserviceTemplate} />
        ) : (
          <EServiceInfoSection />
        )}
        <EServiceDetailsSection
          areEServiceGeneralInfoEditable={areEServiceGeneralInfoEditable}
          eserviceTemplate={eserviceTemplate}
          eserviceMode={eserviceMode}
          onEserviceModeChange={onEserviceModeChange}
        />

        {isOrganizationAllowedToProduce && (
          <DelegationSection
            areEServiceGeneralInfoEditable={areEServiceGeneralInfoEditable}
            isConsumerDelegable={formMethods.watch('isConsumerDelegable')}
          />
        )}

        {/* Signalhub switch can be editable also if coming from a eservice eserviceTemplate */}
        <SignalHubSection isSignalHubActivationEditable={areEServiceGeneralInfoEditable} />

        <StepActions
          forward={
            !areEServiceGeneralInfoEditable
              ? {
                  label: t('create.forwardWithoutSaveBtn'),
                  endIcon: <ArrowForwardIcon />,
                  onClick: forward,
                  type: 'button',
                }
              : { label: t('create.forwardWithSaveBtn'), type: 'submit', startIcon: <SaveIcon /> }
          }
        />
      </Box>
    </FormProvider>
  )
}

export const EServiceCreateStepOneSkeleton: React.FC = () => {
  return (
    <>
      <SectionContainerSkeleton height={354} />
    </>
  )
}

function evaluateFormDefaultValues(
  eserviceTemplate: EServiceTemplateDetails | undefined,
  descriptor: ProducerEServiceDescriptor | undefined,
  eserviceMode: EServiceMode
): EServiceCreateStepOneFormValues {
  if (!eserviceTemplate)
    return {
      name: descriptor?.eservice.name ?? '',
      description: descriptor?.eservice.description ?? '',
      technology: descriptor?.eservice.technology ?? 'REST',
      mode: eserviceMode,
      personalData: descriptor?.eservice.personalData,
      isSignalHubEnabled: descriptor?.eservice.isSignalHubEnabled ?? false,
      isConsumerDelegable: descriptor?.eservice.isConsumerDelegable ?? true,
      isClientAccessDelegable: descriptor?.eservice.isClientAccessDelegable ?? true,
    }

  return {
    name: eserviceTemplate?.name,
    description: eserviceTemplate?.description,
    technology: eserviceTemplate?.technology,
    mode: eserviceTemplate?.mode,
    personalData: eserviceTemplate?.personalData,
    isSignalHubEnabled: eserviceTemplate?.isSignalHubEnabled ?? false,
    isConsumerDelegable: true,
    isClientAccessDelegable: true,
  }
}
