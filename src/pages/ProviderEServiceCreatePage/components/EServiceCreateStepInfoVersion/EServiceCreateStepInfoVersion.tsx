import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { EServiceMutations } from '@/api/eservice'
import { compareObjects } from '@/utils/common.utils'
import {
  type UpdateEServiceDescriptorSeed,
  type UpdateEServiceDescriptorTemplateInstanceSeed,
} from '@/api/api.generatedTypes'
import { remapDescriptorAttributesToDescriptorAttributesSeed } from '@/utils/attribute.utils'
import { Box, Typography } from '@mui/material'
import { SectionContainer } from '@/components/layout/containers'
import { RHFSwitch, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { StepActions } from '@/components/shared/StepActions'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useNavigate } from '@/router'
import { UploadDoc } from './components/UploadDoc'
import { EServiceCreateStepDocumentsDoc } from '../EServiceCreateStepDocuments/EServiceCreateStepDocumentsDoc'
import { Stack } from '@mui/system'

type EServiceCreateStepVersionFormValues = {
  description: string
  agreementApprovalPolicy: boolean
}

export const EServiceCreateStepInfoVersion: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const navigate = useNavigate()

  const { descriptor, forward, back } = useEServiceCreateContext()

  const { mutate: updateVersionDraft } = EServiceMutations.useUpdateVersionDraft({
    suppressSuccessToast: true,
  })

  const { mutate: updateInstanceVersionDraft } = EServiceMutations.useUpdateInstanceVersionDraft({
    suppressSuccessToast: true,
  })

  const formMethods = useForm<EServiceCreateStepVersionFormValues>({
    defaultValues: {
      description: descriptor?.description ?? '',
      agreementApprovalPolicy: descriptor ? descriptor.agreementApprovalPolicy === 'MANUAL' : false,
    },
  })

  const isEServiceCreatedFromTemplate = Boolean(descriptor?.templateRef?.templateVersionId)

  const onSubmit: SubmitHandler<EServiceCreateStepVersionFormValues> = (values) => {
    if (!descriptor) return

    const newDescriptorData = {
      ...descriptor,
      description: values.description,
      agreementApprovalPolicy: values.agreementApprovalPolicy
        ? ('MANUAL' as const)
        : ('AUTOMATIC' as const),
    }

    // If nothing has changed skip the update call
    const areDescriptorsEquals = compareObjects(newDescriptorData, descriptor)
    if (areDescriptorsEquals) {
      navigate('PROVIDE_ESERVICE_SUMMARY', {
        params: {
          eserviceId: descriptor.eservice.id,
          descriptorId: descriptor.id,
        },
      })
      return
    }

    if (isEServiceCreatedFromTemplate) {
      const payload: UpdateEServiceDescriptorTemplateInstanceSeed = {
        agreementApprovalPolicy: newDescriptorData.agreementApprovalPolicy,
        audience: descriptor.audience,
        dailyCallsPerConsumer: descriptor.dailyCallsPerConsumer,
        dailyCallsTotal: descriptor.dailyCallsTotal,
      }

      updateInstanceVersionDraft(
        {
          ...payload,
          eserviceId: descriptor.eservice.id,
          descriptorId: descriptor.id,
        },
        {
          onSuccess: () => {
            if (!descriptor) return
            navigate('PROVIDE_ESERVICE_SUMMARY', {
              params: {
                eserviceId: descriptor.eservice.id,
                descriptorId: descriptor.id,
              },
            })
          },
        }
      )
    } else {
      const payload: UpdateEServiceDescriptorSeed & {
        eserviceId: string
        descriptorId: string
      } = {
        audience: descriptor.audience,
        voucherLifespan: descriptor.voucherLifespan,
        dailyCallsPerConsumer: descriptor.dailyCallsPerConsumer,
        dailyCallsTotal: descriptor.dailyCallsTotal,
        agreementApprovalPolicy: newDescriptorData.agreementApprovalPolicy,
        description: newDescriptorData.description,
        attributes: remapDescriptorAttributesToDescriptorAttributesSeed(descriptor.attributes),
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
      }
      updateVersionDraft(
        {
          ...payload,
          descriptorId: descriptor.id,
        },
        {
          onSuccess: () => {
            if (!descriptor) return
            navigate('PROVIDE_ESERVICE_SUMMARY', {
              params: {
                eserviceId: descriptor.eservice.id,
                descriptorId: descriptor.id,
              },
            })
          },
        }
      )
    }
  }
  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer title={t('step4.descriptionSection.title')}>
          {isEServiceCreatedFromTemplate ? (
            <Stack direction={'row'} gap={24}>
              <Typography color={'textSecondary'}>
                {t('step4.descriptionSection.readOnlyLabel')}
              </Typography>
              <Typography fontWeight={600}>{descriptor?.description}</Typography>
            </Stack>
          ) : (
            <RHFTextField
              size="small"
              name="description"
              label={t('step4.descriptionSection.field.label')}
              multiline
              focusOnMount
              inputProps={{ maxLength: 250 }}
              rules={{ required: true, minLength: 10 }}
              disabled={isEServiceCreatedFromTemplate}
              sx={{ my: 0, mt: 1 }}
            />
          )}
        </SectionContainer>

        <SectionContainer
          title={t('step4.documentationSection.title')}
          description={t('step4.documentationSection.subtitle')}
        >
          <UploadDoc readonly={isEServiceCreatedFromTemplate} />
        </SectionContainer>

        <SectionContainer title={t('step4.requestManagementSection.title')} sx={{ mt: 3 }}>
          <SectionContainer innerSection title={t('step4.requestManagementSection.field.title')}>
            {/* This box is used to align the switch */}
            <Box
              sx={{
                pl: '11px',
              }}
            >
              <RHFSwitch
                label={t('step4.requestManagementSection.field.label')}
                name="agreementApprovalPolicy"
                sx={{ m: 0 }}
              />
            </Box>
          </SectionContainer>
        </SectionContainer>

        <StepActions
          back={{
            label: t('backWithoutSaveBtn'),
            type: 'button',
            onClick: back,
            startIcon: <ArrowBackIcon />,
          }}
          forward={{
            label: t('goToSummary'),
            type: 'submit',
            endIcon: <ArrowForwardIcon />,
          }}
        />
      </Box>
    </FormProvider>
  )
}
