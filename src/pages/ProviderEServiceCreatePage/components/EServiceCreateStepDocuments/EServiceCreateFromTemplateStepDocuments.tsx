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
  EserviceInterfaceTemplatePayload,
  EServiceTechnology,
} from '@/api/api.generatedTypes'
import { EServiceMutations } from '@/api/eservice'

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
    name: descriptor?.templateRef?.interfaceMetadata?.name ?? '',
    email: descriptor?.templateRef?.interfaceMetadata?.email ?? '',
    url: descriptor?.templateRef?.interfaceMetadata?.url ?? '',
    termsAndConditionsUrl: descriptor?.templateRef?.interfaceMetadata?.termsAndConditionsUrl ?? '',
    serverUrls: descriptor?.templateRef?.interfaceMetadata?.serverUrls.map((url) => ({ url })) ?? [
      { url: '' },
    ],
  }

  const { mutate: updateEServiceRESTInterfaceInfo } =
    EServiceMutations.useUpdateEServiceInterfaceRESTInfo()
  const { mutate: updateEServiceSOAPInterfaceInfo } =
    EServiceMutations.useUpdateEServiceInterfaceSOAPInfo()

  const formMethods = useForm({ defaultValues })

  const fieldsArray = useFieldArray({
    control: formMethods.control,
    name: 'serverUrls',
  })

  // const sectionDescription =
  //   descriptor?.eservice.technology === 'SOAP' ? (
  //     t(`create.step4.interface.description.soap`)
  //   ) : (
  //     <>
  //       {t(`create.step4.interface.description.rest`)}{' '}
  //       <IconLink
  //         href={openApiCheckerLink}
  //         target="_blank"
  //         endIcon={<LaunchIcon fontSize="small" />}
  //         onClick={() => trackEvent('INTEROP_EXT_LINK_DTD_API_CHECKER', { src: 'CREATE_ESERVICE' })}
  //       >
  //         {t('create.step4.interface.description.restLinkLabel')}
  //       </IconLink>
  //     </>
  //   )

  const onSubmit = (values: ExtendedTemplateInstanceInterfaceMetadata) => {
    if (!descriptor) return

    const mapServerUrls = (
      serverUrls: ExtendedTemplateInstanceInterfaceMetadata['serverUrls']
    ): TemplateInstanceInterfaceMetadata['serverUrls'] => {
      return serverUrls.map((serverUrl) => serverUrl.url)
    }

    if (descriptor.eservice.technology === 'REST') {
      const payload: EserviceInterfaceTemplatePayload = {
        contactName: values.name,
        email: values.email,
        contactUrl: values.url,
        termsAndConditionsUrl: values.termsAndConditionsUrl,
        serverUrls: mapServerUrls(values.serverUrls),
      }

      updateEServiceRESTInterfaceInfo({
        ...payload,
        eserviceId: descriptor?.eservice.id,
        descriptorId: descriptor?.id,
      })

      return
    }
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
