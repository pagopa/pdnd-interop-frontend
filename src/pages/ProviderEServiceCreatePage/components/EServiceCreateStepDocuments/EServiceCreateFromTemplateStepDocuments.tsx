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

export const EServiceFromTemplateCreateStepDocuments: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eservice')
  const navigate = useNavigate()

  const { descriptor, back } = useEServiceCreateContext()

  const defaultValues = {
    name: descriptor?.name ?? '',
    email: descriptor?.email ?? '',
    url: descriptor?.url ?? '',
    termsAndConditions: descriptor?.termsAndConditions ?? '',
    serverUrl: descriptor?.serverUrl ?? ['url1', 'url2'],
  }

  const formMethods = useForm({ defaultValues })

  const fieldsArray = useFieldArray({
    control: formMethods.control,
    name: 'serverUrl',
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

  const onSubmit = (values: any) => {
    console.log('values', values)
    alert('SUBMIT')
  }

  return (
    <FormProvider {...formMethods}>
      {' '}
      <SectionContainer
        title={t('create.step4.template.interface.title')}
        description={t('create.step4.template.interface.description.rest')}
        onSubmit={formMethods.handleSubmit(() => alert('SUBMIT'))}
      >
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          <EServiceEditInfoInterface fieldsArray={fieldsArray} defaultValues={defaultValues} />
        </Box>
        <Stack direction="row" justifyContent="flex-start" mt={2}>
          <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
            {t('create.step4.template.interface.save')}
          </Button>
        </Stack>
      </SectionContainer>
      <SectionContainer
        title={t('create.step4.documentation.title')}
        description={t('create.step4.documentation.description')}
      >
        <EServiceCreateStepDocumentsDoc />
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
