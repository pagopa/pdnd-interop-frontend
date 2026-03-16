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
import { AxiosError } from 'axios'
import SaveIcon from '@mui/icons-material/Save'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { AuthHooks } from '@/api/auth'
import {
  EServiceTemplateMutations,
  DUPLICATE_ESERVICENAME_ERROR_CODE,
} from '@/api/eserviceTemplate'
import { EServiceInfoSection } from '../sections/EServiceInfoSection'
import { EServiceDetailsSection } from '../sections/EServiceDetailsSection'
import { EServiceTemplateInfoSection } from '../sections/EServiceTemplateInfoSection'
import { DelegationSection } from '../sections/DelegationSection'
import { SignalHubSection } from '../sections/SignalHubSection'
import { EServiceTemplateDetailsSection } from '../sections/EServiceTemplateDetailsSection'
import { InstanceLabelSection } from './InstanceLabelSection'

export type EServiceCreateStepGeneralFormValues = {
  name: string
  description: string
  technology: EServiceTechnology
  mode: EServiceMode
  personalData: boolean | undefined
  isSignalHubEnabled: boolean
  isConsumerDelegable: boolean
  isClientAccessDelegable: boolean
  instanceLabel: string
}

export const EServiceCreateStepGeneral: React.FC = () => {
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
  const isInstanceLabelReadonly = Boolean(descriptor && descriptor.version !== '1')

  // If Template ID is present we are inheriting an e-service fields from a eserviceTemplate
  const defaultValues = evaluateFormDefaultValues(eserviceTemplate, descriptor, eserviceMode)
  const formMethods = useForm({ defaultValues })

  /**
   * Resolves the instanceLabel form value to the API payload value:
   * - non-empty string → trimmed string (BE validates the label)
   * - empty string, whitespace-only string → undefined (axios omits the key from JSON, BE validates the undefined value for the label)
   */
  const resolveInstanceLabel = (instanceLabelFormValue: string): string | undefined => {
    const trimmed = instanceLabelFormValue.trim()
    return trimmed === '' ? undefined : trimmed
  }

  /**
   * Handles duplicate instance label errors by showing an inline error on the field.
   * Other errors are handled by the mutation's errorToastLabel (generic toast).
   */
  const handleDuplicateInstanceLabelError = (error: unknown) => {
    if (!(error instanceof AxiosError)) return
    const errorCode = error.response?.data?.errors?.[0]?.code
    if (errorCode === DUPLICATE_ESERVICENAME_ERROR_CODE) {
      const instanceLabelValue = formMethods.getValues('instanceLabel')
      formMethods.setError(
        'instanceLabel',
        {
          message: instanceLabelValue
            ? t('create.step1.instanceLabelField.validation.duplicate')
            : t('create.step1.instanceLabelField.validation.emptyNotAvailable'),
        },
        { shouldFocus: true }
      )
    }
  }

  const onSubmit = (formValues: EServiceCreateStepGeneralFormValues & InstanceEServiceSeed) => {
    // If we are editing an existing e-service, we update the draft
    if (descriptor) {
      // If nothing has changed skip the update call
      const isEServiceTheSame = compareObjects(formValues, descriptor?.eservice)

      if (!isEServiceTheSame) {
        const { instanceLabel: _, ...eserviceData } = formValues
        isEserviceFromTemplate
          ? updateDraftFromTemplate(
              {
                eServiceId: descriptor.eservice.id,
                isClientAccessDelegable: formValues.isClientAccessDelegable,
                isConsumerDelegable: formValues.isConsumerDelegable,
                isSignalHubEnabled: formValues.isSignalHubEnabled,
                instanceLabel: resolveInstanceLabel(formValues.instanceLabel),
              },
              { onSuccess: forward, onError: handleDuplicateInstanceLabelError }
            )
          : updateDraft(
              { eserviceId: descriptor.eservice.id, ...eserviceData },
              { onSuccess: forward }
            )
      } else forward()

      return
    }

    onCreateDraft(formValues)
  }

  const onCreateDraft = (
    formValues: EServiceCreateStepGeneralFormValues & InstanceEServiceSeed
  ) => {
    // If we are creating a new e-service we need to understand if we are creating it from a eserviceTemplate or not
    if (!eserviceTemplate) {
      const { instanceLabel: _, ...eserviceData } = formValues
      createDraft(eserviceData, {
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
        instanceLabel: resolveInstanceLabel(formValues.instanceLabel),
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
        onError: handleDuplicateInstanceLabelError,
      })
    }
  }

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        {eserviceTemplate ? (
          <EServiceTemplateInfoSection eserviceTemplate={eserviceTemplate} />
        ) : (
          <EServiceInfoSection
            descriptor={descriptor}
            areEServiceGeneralInfoEditable={areEServiceGeneralInfoEditable}
          />
        )}
        {eserviceTemplate ? (
          <EServiceTemplateDetailsSection eserviceTemplate={eserviceTemplate} />
        ) : (
          <EServiceDetailsSection
            areEServiceGeneralInfoEditable={areEServiceGeneralInfoEditable}
            eserviceMode={eserviceMode}
            descriptor={descriptor}
            onEserviceModeChange={onEserviceModeChange}
          />
        )}

        {isOrganizationAllowedToProduce && (
          <DelegationSection
            areEServiceGeneralInfoEditable={areEServiceGeneralInfoEditable}
            isConsumerDelegable={formMethods.watch('isConsumerDelegable')}
          />
        )}

        {isEserviceFromTemplate && (
          <InstanceLabelSection
            templateName={eserviceTemplate?.name ?? descriptor?.templateRef?.templateName ?? ''}
            instanceLabel={formMethods.watch('instanceLabel')}
            disabled={isInstanceLabelReadonly}
          />
        )}

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

export const EServiceCreateStepGeneralSkeleton: React.FC = () => {
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
): EServiceCreateStepGeneralFormValues {
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
      instanceLabel: '', //instanceLabel will not be used
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
    instanceLabel: descriptor?.eservice.instanceLabel ?? '',
  }
}
