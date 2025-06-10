import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Divider, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { IconLink } from '@/components/shared/IconLink'
import LaunchIcon from '@mui/icons-material/Launch'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EServiceMutations, EServiceQueries } from '@/api/eservice'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { SIGNALHUB_PERSONAL_DATA_PROCESS_URL } from '@/config/env'
import { SIGNALHUB_GUIDE_URL } from '@/config/constants'
import { useDrawerState } from '@/hooks/useDrawerState'
import { AuthHooks } from '@/api/auth'
import { useGetProducerDelegationUserRole } from '@/hooks/useGetProducerDelegationUserRole'
import EditIcon from '@mui/icons-material/Edit'
import { ProviderEServiceSignalHubUpdateDrawer } from './ProviderEServiceSignalHubUpdateDrawer'

export const ProviderEServiceSignalHubSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.signalHub',
  })
  const { t: tCommon } = useTranslation('common')

  const { eserviceId, descriptorId } = useParams<'PROVIDE_ESERVICE_MANAGE'>()
  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorProvider(eserviceId, descriptorId)
  )

  const { mutate: updateEserviceIsSignalHubEnabled } =
    EServiceMutations.useUpdateEServiceIsSignalHubEnabled()

  const isSignalHubEnabled = descriptor.eservice.isSignalHubEnabled ?? false

  const organizationId = AuthHooks.useJwt().jwt?.organizationId
  const { isDelegator } = useGetProducerDelegationUserRole({
    eserviceId,
    organizationId: organizationId,
  })

  const {
    isOpen: isSignalHubDrawerOpen,
    openDrawer: openSignalHubDrawer,
    closeDrawer: closeSignalHubDrawer,
  } = useDrawerState()

  const handleIsSignalHubEnabledUpdate = (eserviceId: string, isSignalHubEnabled: boolean) => {
    updateEserviceIsSignalHubEnabled(
      {
        eserviceId: eserviceId,
        isSignalHubEnabled: isSignalHubEnabled,
      },
      { onSuccess: closeSignalHubDrawer }
    )
  }

  return (
    <>
      <SectionContainer
        title={t('title')}
        description={
          <Typography color="text.secondary" variant="body2">
            {t('description.before')}{' '}
            <IconLink
              href={SIGNALHUB_GUIDE_URL}
              target="_blank"
              endIcon={<LaunchIcon fontSize="small" />}
            >
              {' '}
              {t('description.linkLabel')}
            </IconLink>{' '}
            {t('description.after')}
          </Typography>
        }
      >
        <Stack spacing={2}>
          <>
            <Divider />
            <SectionContainer
              innerSection
              title={t('innerSection.title')}
              topSideActions={
                isDelegator
                  ? []
                  : [
                      {
                        action: openSignalHubDrawer,
                        label: tCommon('actions.edit'),
                        icon: EditIcon,
                      },
                    ]
              }
            >
              <Stack spacing={2}>
                <InformationContainer
                  label={t('innerSection.status.label')}
                  content={t(`innerSection.status.content.${isSignalHubEnabled}`)}
                />
                {isSignalHubEnabled && (
                  <InformationContainer
                    label={t('innerSection.document.label')}
                    content={
                      <IconLink
                        href={SIGNALHUB_PERSONAL_DATA_PROCESS_URL}
                        target="_blank"
                        startIcon={<AttachFileIcon fontSize="small" />}
                      >
                        {' '}
                        {t('innerSection.document.content')}
                      </IconLink>
                    }
                  />
                )}
              </Stack>
            </SectionContainer>
          </>
        </Stack>
      </SectionContainer>
      <ProviderEServiceSignalHubUpdateDrawer
        isOpen={isSignalHubDrawerOpen}
        onClose={closeSignalHubDrawer}
        id={eserviceId}
        isSignalHubEnabled={isSignalHubEnabled}
        onSubmit={handleIsSignalHubEnabledUpdate}
      />
    </>
  )
}

export const ProviderEServiceSignalHubSectionSkeleton = () => {
  return <SectionContainerSkeleton sx={{ mt: 4 }} height={383} />
}
