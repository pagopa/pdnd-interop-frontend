import React from 'react'
import { EServiceMutations } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { PageBottomActionsCardContainer } from '@/components/layout/containers/PageBottomCardContainer'
import { InfoTooltip } from '@/components/shared/InfoTooltip'
import { StepActions } from '@/components/shared/StepActions'
import { useToastNotification } from '@/stores'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { useNavigate } from '@/router'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { EServiceCreateStep4DocumentsDoc } from './EServiceCreateStep4DocumentsDoc'
import { EServiceCreateStep4DocumentsInterface } from './EServiceCreateStep4DocumentsInterface'

export const EServiceCreateStep4Documents: React.FC<ActiveStepProps> = () => {
  const { t } = useTranslation('eservice')
  const { t: tMutations } = useTranslation('mutations-feedback')
  const navigate = useNavigate()

  const { showToast } = useToastNotification()
  const { descriptor, back } = useEServiceCreateContext()

  const { mutate: deleteVersion } = EServiceMutations.useDeleteVersionDraft()
  const { mutate: publishVersion } = EServiceMutations.usePublishVersionDraft()

  const goToProviderEServiceList = () => {
    navigate('PROVIDE_ESERVICE_LIST')
  }

  const goToEServiceDetails = (eserviceId: string, descriptorId: string) => {
    navigate('PROVIDE_ESERVICE_MANAGE', {
      params: {
        eserviceId: eserviceId,
        descriptorId: descriptorId,
      },
    })
  }

  const handleDeleteVersion = () => {
    if (!descriptor) return
    deleteVersion(
      { eserviceId: descriptor.eservice.id, descriptorId: descriptor.id },
      { onSuccess: goToProviderEServiceList }
    )
  }

  const handlePublishVersion = () => {
    if (!descriptor) return
    publishVersion(
      { eserviceId: descriptor.eservice.id, descriptorId: descriptor.id },
      { onSuccess: () => goToEServiceDetails(descriptor.eservice.id, descriptor.id) }
    )
  }

  const sectionDescription = `${t('create.step4.interface.description.before')} ${
    descriptor?.eservice.technology === 'REST' ? 'OpenAPI' : 'WSDL'
  }  ${t('create.step4.interface.description.after')}`

  const hasInterface = !!descriptor?.interface

  return (
    <>
      <SectionContainer
        newDesign
        title={t('create.step4.interface.title')}
        description={sectionDescription}
      >
        <EServiceCreateStep4DocumentsInterface />
      </SectionContainer>
      <SectionContainer
        newDesign
        title={t('create.step4.documentation.title')}
        description={t('create.step4.documentation.description')}
      >
        <EServiceCreateStep4DocumentsDoc />
      </SectionContainer>

      <StepActions
        back={{ label: t('create.backWithoutSaveBtn'), type: 'button', onClick: back }}
        forward={{
          label: t('create.endWithSaveBtn'),
          type: 'button',
          onClick: () => {
            showToast(tMutations('eservice.updateVersionDraft.outcome.success'), 'success')
            navigate('PROVIDE_ESERVICE_LIST')
          },
        }}
      />

      <PageBottomActionsCardContainer
        title={t('create.quickPublish.title')}
        description={t('create.quickPublish.description')}
      >
        <Button variant="outlined" onClick={handleDeleteVersion}>
          {t('create.quickPublish.deleteBtn')}
        </Button>
        <Button disabled={!hasInterface} variant="contained" onClick={handlePublishVersion}>
          {t('create.quickPublish.publishBtn')}
        </Button>
        {!hasInterface && <InfoTooltip label={t('create.quickPublish.noInterfaceTooltipLabel')} />}
      </PageBottomActionsCardContainer>
    </>
  )
}

export const EServiceCreateStep4DocumentsSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={600} />
}
