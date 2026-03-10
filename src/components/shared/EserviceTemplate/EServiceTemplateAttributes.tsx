import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import {
  AttributeGroupContainer,
  SectionContainer,
  SectionContainerSkeleton,
} from '@/components/layout/containers'
import { useParams } from '@/router'
import type { ActionItemButton } from '@/types/common.types'
import { Card, CardHeader, Divider, Stack } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import type { AttributeKey } from '@/types/attribute.types'
import { AuthHooks } from '@/api/auth'
import { AttributeGroupsListSection } from '@/components/shared/ReadOnlyDescriptorAttributes'
import { UpdateAttributesDrawer } from '../UpdateAttributesDrawer'
import { InformationContainer, theme } from '@pagopa/interop-fe-commons'

type EServiceTemplateAttributesProps = {
  readonly: boolean
  routeKey: 'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS' | 'PROVIDE_ESERVICE_TEMPLATE_DETAILS'
}
export const EServiceTemplateAttributes: React.FC<EServiceTemplateAttributesProps> = ({
  routeKey,
  readonly,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.sections.attributes' })
  const { t: tCommon } = useTranslation('common')
  const { t: tAttribute } = useTranslation('attribute')
  const { isAdmin } = AuthHooks.useJwt()

  const { eServiceTemplateId, eServiceTemplateVersionId } = useParams<typeof routeKey>()

  const { data: eserviceTemplate } = useSuspenseQuery(
    EServiceTemplateQueries.getSingle(eServiceTemplateId, eServiceTemplateVersionId)
  )

  const [editAttributeDrawerState, setEditAttributeDrawerState] = useState<{
    kind: AttributeKey
    isOpen: boolean
  }>({ isOpen: false, kind: 'certified' })

  const getAttributeSectionActions = (kind: AttributeKey): Array<ActionItemButton> | undefined => {
    if (eserviceTemplate.attributes[kind].length === 0 || !isAdmin) return

    return [
      {
        action: () => setEditAttributeDrawerState({ kind, isOpen: true }),
        label: tCommon('actions.edit'),
        icon: EditIcon,
      },
    ]
  }

  const noAttributes =
    eserviceTemplate.attributes.declared.length === 0 &&
    eserviceTemplate.attributes.certified.length === 0 &&
    eserviceTemplate.attributes.verified.length === 0

  const noThresholds =
    eserviceTemplate.dailyCallsTotal === undefined &&
    eserviceTemplate.dailyCallsPerConsumer === undefined

  return (
    <>
      <SectionContainer title={t('title')} description={t('description')}>
        <SectionContainer title={t('thresholds.title')} innerSection sx={{ p: 0 }}>
          {noThresholds ? (
            <Card>
              <CardHeader
                titleTypographyProps={{
                  variant: 'body1',
                  fontWeight: 600,
                }}
                title={t('thresholds.noThresholdTemplate')}
                sx={{
                  py: 1,
                  bgcolor: 'grey.200',
                }}
              />
            </Card>
          ) : (
            <Stack spacing={1} mt={1} mb={3}>
              <InformationContainer
                label={t('thresholds.dailyCallsPerConsumer.label')}
                content={`${eserviceTemplate.dailyCallsPerConsumer}`}
              />
              <InformationContainer
                label={t('thresholds.dailyCallsTotal.label')}
                content={`${eserviceTemplate.dailyCallsTotal}`}
              />
            </Stack>
          )}
        </SectionContainer>
        <Divider sx={{ my: 3 }} />
        {noAttributes ? (
          <SectionContainer
            title={tAttribute('noAttributesRequiredTemplate.title')}
            innerSection
            sx={{ p: 0 }}
          >
            <AttributeGroupContainer
              title={tAttribute('noAttributesRequiredTemplate.alert')}
              color="gray"
            />
          </SectionContainer>
        ) : (
          <>
            <AttributeGroupsListSection
              attributeKey="certified"
              descriptorAttributes={eserviceTemplate.attributes}
              topSideActions={readonly ? undefined : getAttributeSectionActions('certified')}
            />
            <Divider sx={{ my: 3 }} />
            <AttributeGroupsListSection
              attributeKey="verified"
              descriptorAttributes={eserviceTemplate.attributes}
              topSideActions={readonly ? undefined : getAttributeSectionActions('verified')}
            />
            <Divider sx={{ my: 3 }} />
            <AttributeGroupsListSection
              attributeKey="declared"
              descriptorAttributes={eserviceTemplate.attributes}
              topSideActions={readonly ? undefined : getAttributeSectionActions('declared')}
            />
          </>
        )}
      </SectionContainer>
      <UpdateAttributesDrawer
        isOpen={editAttributeDrawerState.isOpen}
        onClose={() => setEditAttributeDrawerState({ ...editAttributeDrawerState, isOpen: false })}
        attributeKey={editAttributeDrawerState.kind}
        attributes={eserviceTemplate.attributes}
        kind="ESERVICE_TEMPLATE"
      />
    </>
  )
}

export const EServiceTemplateAttributesSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={1000} />
}
