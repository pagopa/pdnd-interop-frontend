import React, { useState } from 'react'
import { Alert, Box } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import { useNavigate as useReactRouterNavigate } from 'react-router-dom'
import { StepActions } from '@/components/shared/StepActions'
import { SectionContainer } from '@/components/layout/containers'
import { useGeneratePath, useParams } from '@/router'
import type { ActiveStepProps } from '@/hooks/useActiveStep'
import { PurposeTemplateQueries } from '@/api/purposeTemplate/purposeTemplate.queries'
import { NotFoundError } from '@/utils/errors.utils'
import type {
  CatalogEService,
  CatalogEServiceTemplate,
  LinkableResource,
} from '@/api/api.generatedTypes'
import type { LinkableCandidate } from '@/utils/purposeTemplate.utils'
import { AddResourceToForm, type EditStepLinkedResourcesForm } from './AddResourceToForm'

function normalizeLinkableResource(resource: LinkableResource): LinkableCandidate {
  return match(resource)
    .with({ resourceKind: 'ESERVICE' }, (r) => {
      const value: CatalogEService = {
        id: r.eservice.id,
        name: r.eservice.name,
        description: r.eservice.description ?? '',
        producer: r.eservice.producer,
        activeDescriptor: r.descriptor,
        isMine: false,
      }
      return { resourceKind: 'ESERVICE' as const, value }
    })
    .with({ resourceKind: 'ESERVICE_TEMPLATE' }, (r) => {
      const value: CatalogEServiceTemplate = {
        id: r.eserviceTemplate.id,
        name: r.eserviceTemplate.name,
        description: r.eserviceTemplate.description ?? '',
        creator: r.eserviceTemplate.creator,
        publishedVersion: r.eserviceTemplateVersion,
      }
      return { resourceKind: 'ESERVICE_TEMPLATE' as const, value }
    })
    .exhaustive()
}

function hasInvalidLinkableResource(resource: LinkableResource): boolean {
  return match(resource)
    .with({ resourceKind: 'ESERVICE' }, (r) => {
      const state = r.descriptor.state
      return state === 'ARCHIVED' || state === 'SUSPENDED'
    })
    .with({ resourceKind: 'ESERVICE_TEMPLATE' }, (r) => {
      const state = r.eserviceTemplateVersion.state
      return state === 'DEPRECATED' || state === 'SUSPENDED'
    })
    .exhaustive()
}

export const PurposeTemplateEditLinkedResource: React.FC<ActiveStepProps> = ({
  forward,
  back,
}) => {
  const { t } = useTranslation('purposeTemplate')
  const { t: tCommon } = useTranslation('common')

  const [isWarningShown, setIsWarningShown] = useState(false)

  const { purposeTemplateId } = useParams<'SUBSCRIBE_PURPOSE_TEMPLATE_EDIT'>()
  const { data: purposeTemplateFromQuery } = useQuery(
    PurposeTemplateQueries.getSingle(purposeTemplateId)
  )
  const { data: linkableResourcesData, error: linkableResourcesError } = useQuery({
    ...PurposeTemplateQueries.getLinkableResources(purposeTemplateId, { offset: 0, limit: 50 }),
    enabled: Boolean(purposeTemplateId),
  })

  const purposeTemplate = purposeTemplateFromQuery
  const rawResources = linkableResourcesData?.results ?? []
  const hasOrphanResources = linkableResourcesError instanceof NotFoundError

  const linkedResources: LinkableCandidate[] = rawResources.map(normalizeLinkableResource)

  const reactRouterNavigate = useReactRouterNavigate()
  const generatePath = useGeneratePath()

  const isInDraftState = purposeTemplate?.state === 'DRAFT'

  const handleBack = () => {
    if (isInDraftState) {
      back()
    } else {
      const path = generatePath('SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS', {
        purposeTemplateId,
      })
      reactRouterNavigate(`${path}?tab=linkedResources`)
    }
  }

  const defaultValues: EditStepLinkedResourcesForm = { resources: [] }
  const formMethods = useForm<EditStepLinkedResourcesForm>({ defaultValues })

  const onSubmit = () => {
    const hasInvalid = rawResources.some(hasInvalidLinkableResource)
    if (hasInvalid) {
      setIsWarningShown(true)
      return
    }
    if (isInDraftState) {
      forward()
    } else {
      const path = generatePath('SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS', {
        purposeTemplateId,
      })
      reactRouterNavigate(path)
    }
  }

  if (!purposeTemplate) return null

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
        <SectionContainer
          title={t('edit.step2.detailsTitle')}
          description={t('edit.step2.detailsDescription')}
        >
          {hasOrphanResources && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {t('edit.step2.warning.orphanLinkedResources')}
            </Alert>
          )}
          <AddResourceToForm
            readOnly={false}
            purposeTemplate={purposeTemplate}
            linkedResources={linkedResources}
            showWarning={isWarningShown}
          />
          <StepActions
            back={{
              onClick: handleBack,
              label: isInDraftState ? t('edit.backWithoutSaveBtn') : tCommon('actions.cancel'),
              type: 'button',
              startIcon: isInDraftState ? <ArrowBackIcon /> : undefined,
            }}
            forward={{
              label: isInDraftState
                ? t('edit.forwardWithSaveBtn')
                : t('edit.step2.editLinkedResources'),
              type: 'submit',
              startIcon: <SaveIcon />,
            }}
          />
        </SectionContainer>
      </Box>
    </FormProvider>
  )
}
