import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { useNavigate } from '@/router'
import { useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { EServiceCreateStepDocumentsDoc } from './EServiceCreateStepDocumentsDoc'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { EServiceEditInfoInterface } from './EServiceEditInfoInterface'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { Box, Stack } from '@mui/system'
import { Button } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import type {
  TemplateInstanceInterfaceMetadata,
  EServiceTechnology,
  TemplateInstanceInterfaceSOAPSeed,
  TemplateInstanceInterfaceRESTSeed,
} from '@/api/api.generatedTypes'
import { EServiceMutations } from '@/api/eservice'
import { waitFor } from '@/utils/common.utils'

/* This interface is needed just for useFieldArrays with work only with objects and not with array
 https://github.com/orgs/react-hook-form/discussions/7586 
*/
export interface ExtendedTemplateInstanceInterfaceMetadata
  extends Omit<TemplateInstanceInterfaceMetadata, 'serverUrls'> {
  serverUrls: { url: string }[]
}

export const EServiceFromTemplateCreateStepDocuments: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eservice')
  const navigate = useNavigate()

  const { descriptor, back } = useEServiceCreateContext()

  const descriptionLabelByTechnology = descriptor?.eservice.technology === 'REST' ? 'rest' : 'soap'

  const defaultValues: ExtendedTemplateInstanceInterfaceMetadata = {
    contactName: descriptor?.templateRef?.interfaceMetadata?.contactName ?? '',
    contactEmail: descriptor?.templateRef?.interfaceMetadata?.contactEmail ?? '',
    contactUrl: descriptor?.templateRef?.interfaceMetadata?.contactUrl ?? '',
    termsAndConditionsUrl: descriptor?.templateRef?.interfaceMetadata?.termsAndConditionsUrl ?? '',
    serverUrls: descriptor?.serverUrls?.map((url) => ({ url })) ?? [{ url: '' }],
  }

  const { mutate: deleteAndUpdateEServiceRESTInterfaceInfo } =
    EServiceMutations.useDeleteAndUpdateEServiceInterfaceRESTInfo()
  const { mutate: deleteAndupdateEServiceSOAPInterfaceInfo } =
    EServiceMutations.useDeleteAndUpdateEServiceInterfaceSOAPInfo()

  const { mutateAsync: deleteDocument } = EServiceMutations.useDeleteVersionDraftDocument()

  const formMethods = useForm({ defaultValues })

  const fieldsArray = useFieldArray({
    control: formMethods.control,
    name: 'serverUrls',
  })

  const onSubmit = async (values: ExtendedTemplateInstanceInterfaceMetadata) => {
    if (!descriptor) return

    const mapServerUrls = (
      serverUrls: ExtendedTemplateInstanceInterfaceMetadata['serverUrls']
    ): string[] => {
      return serverUrls.map((serverUrl) => serverUrl.url)
    }

    if (descriptor.eservice.technology === 'REST') {
      onRestApiSubmit(
        values,
        mapServerUrls(values.serverUrls),
        descriptor?.eservice.id,
        descriptor?.id
      )
    } else {
      onSoapApiSubmit(mapServerUrls(values.serverUrls), descriptor?.eservice.id, descriptor?.id)
    }
  }

  const onRestApiSubmit = (
    values: ExtendedTemplateInstanceInterfaceMetadata,
    serverUrls: string[],
    eserviceId: string,
    descriptorId: string
  ) => {
    const payload: TemplateInstanceInterfaceRESTSeed = {
      contactName: values?.contactName as string,
      contactEmail: values.contactEmail as string,
      contactUrl: values.contactUrl,
      termsAndConditionsUrl: values.termsAndConditionsUrl,
      serverUrls,
    }

    deleteAndUpdateEServiceRESTInterfaceInfo({
      ...payload,
      eserviceId,
      descriptorId,
      documentId: descriptor?.interface?.id,
    })
  }

  const onSoapApiSubmit = (serverUrls: string[], eserviceId: string, descriptorId: string) => {
    const payload: TemplateInstanceInterfaceSOAPSeed = {
      serverUrls,
    }
    deleteAndupdateEServiceSOAPInterfaceInfo({
      ...payload,
      eserviceId,
      descriptorId,
      documentId: descriptor?.interface?.id,
    })
  }

  return (
    <FormProvider {...formMethods}>
      <SectionContainer
        title={t('create.step4.template.interface.title')}
        description={t(
          `create.step4.template.interface.description.${descriptionLabelByTechnology}`
        )}
      >
        <Box component="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
          <EServiceEditInfoInterface
            fieldsArray={fieldsArray}
            eServiceTechnology={descriptor?.eservice?.technology as EServiceTechnology}
          />
          <Stack direction="row" justifyContent="flex-start" mt={2}>
            <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
              {t('create.step4.template.interface.save')}
            </Button>
          </Stack>
        </Box>
      </SectionContainer>
      <SectionContainer
        title={t('create.step4.template.interface.documentation.title')}
        description={t('create.step4.template.interface.documentation.description')}
      >
        <EServiceCreateStepDocumentsDoc readonly />
      </SectionContainer>
      <StepActions
        back={{
          label: t('create.backWithoutSaveBtn'),
          type: 'button',
          onClick: back,
          startIcon: <ArrowBackIcon />,
        }}
        forward={{
          label: t('create.goToSummary'),
          type: 'button',
          onClick: () => {
            if (!descriptor) return
            navigate('PROVIDE_ESERVICE_SUMMARY', {
              params: {
                eserviceId: descriptor.eservice.id,
                descriptorId: descriptor.id,
              },
            })
          },
          endIcon: <ArrowForwardIcon />,
        }}
      />
    </FormProvider>
  )
}

export const EServiceCreateFromTemplateStepDocumentsSkeleton: React.FC = () => {
  return (
    <>
      <SectionContainerSkeleton height={365} />
      <SectionContainerSkeleton height={178} />
    </>
  )
}
