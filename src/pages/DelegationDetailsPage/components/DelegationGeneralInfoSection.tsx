import type { DelegationKind } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { DelegationQueries } from '@/api/delegation'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StatusChip } from '@/components/shared/StatusChip'
import { Link } from '@/router'
import { formatDateString } from '@/utils/format.utils'
import { Grid, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

type DelegationGeneralInfoSectionProps = {
  delegationId: string
}

export const DelegationGeneralInfoSection: React.FC<DelegationGeneralInfoSectionProps> = ({
  delegationId,
}) => {
  const { t } = useTranslation('party', { keyPrefix: 'delegations.details.generalInfoSection' })
  const { data: delegation } = useSuspenseQuery(
    DelegationQueries.getSingle({ delegationId: delegationId })
  )

  const { jwt } = AuthHooks.useJwt()

  const delegationKind = 'DELEGATED_PRODUCER' as DelegationKind

  const delegationKindLabel = match(delegationKind)
    .with('DELEGATED_PRODUCER', () => t('delegationKindField.kindProducer'))
    .with('DELEGATED_CONSUMER', () => t('delegationKindField.kindConsumer'))
    .exhaustive()

  const isReceived = match(jwt?.organizationId)
    .with(delegation.delegate.id, () => true)
    .with(delegation.delegator.id, () => false)
    .otherwise(() => false)

  return (
    <Grid container>
      <Grid item xs={7}>
        <SectionContainer title={t('title')}>
          <Stack spacing={2}>
            <InformationContainer
              label={t('eserviceNameField.label')}
              content={
                <Link
                  to="PROVIDE_ESERVICE_MANAGE"
                  params={{
                    eserviceId: delegation?.eservice.id,
                    descriptorId: delegation?.eservice.id, //TODO fare chiamata di getDescriptor!?
                  }}
                >
                  {delegation.eservice.name}
                </Link>
              }
            />
            {/* TODO inserire lato BFF il producer dell'eservice */}
            {/* <InformationContainer
              label={t('eserviceProducerField.label')}
              content={delegation.eservice.provider}
            /> */}
            <InformationContainer
              label={t('delegationKindField.label')}
              content={delegationKindLabel}
            />
            {isReceived && (
              <InformationContainer
                label={t('delegatorField.label')}
                content={delegation.delegator.name}
              />
            )}
            {!isReceived && (
              <InformationContainer
                label={t('delegateField.label')}
                content={delegation.delegate.name}
              />
            )}
            {delegation.submittedAt && (
              <InformationContainer
                label={t('submissionDateField.label')}
                content={formatDateString(delegation.submittedAt)}
              />
            )}
            <InformationContainer
              label={t('delegationStateField.label')}
              content={<StatusChip for="delegation" state={delegation.state} />}
            />
          </Stack>
        </SectionContainer>
      </Grid>
    </Grid>
  )
}

export const DelegationGeneralInfoSectionSkeleton = () => {
  return (
    <Grid container>
      <Grid item xs={7}>
        <SectionContainerSkeleton sx={{ mt: 4 }} height={310} />
      </Grid>
    </Grid>
  )
}
