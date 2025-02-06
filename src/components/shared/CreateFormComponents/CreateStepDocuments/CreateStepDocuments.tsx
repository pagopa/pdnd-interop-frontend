import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { useNavigate } from '@/router'
import { useTranslation } from 'react-i18next'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { IconLink } from '@/components/shared/IconLink'
import LaunchIcon from '@mui/icons-material/Launch'
import { openApiCheckerLink } from '@/config/constants'
import { trackEvent } from '@/config/tracking'
import { useCreateContext } from '../../CreateContext'
import { CreateStepDocumentsInterface } from './CreateStepDocumentsInterface'
import { CreateStepDocumentsDoc } from './CreateStepDocumentsDoc'

export const CreateStepDocuments: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eservice') //TODO
  const navigate = useNavigate()

  const { descriptor, template, back } = useCreateContext()

  const sectionDescription =
    descriptor?.eservice.technology || template?.eservice.technology === 'SOAP' ? (
      t(`create.step4.interface.description.soap`)
    ) : (
      <>
        {t(`create.step4.interface.description.rest`)}{' '}
        <IconLink
          href={openApiCheckerLink}
          target="_blank"
          endIcon={<LaunchIcon fontSize="small" />}
          onClick={() => trackEvent('INTEROP_EXT_LINK_DTD_API_CHECKER', { src: 'CREATE_ESERVICE' })} //TODO
        >
          {t('create.step4.interface.description.restLinkLabel')}
        </IconLink>
      </>
    )

  return (
    <>
      <SectionContainer title={t('create.step4.interface.title')} description={sectionDescription}>
        <CreateStepDocumentsInterface />
      </SectionContainer>
      <SectionContainer
        title={t('create.step4.documentation.title')}
        description={t('create.step4.documentation.description')}
      >
        <CreateStepDocumentsDoc />
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
    </>
  )
}

export const CreateStepDocumentsSkeleton: React.FC = () => {
  return (
    <>
      <SectionContainerSkeleton height={365} />
      <SectionContainerSkeleton height={178} />
    </>
  )
}
