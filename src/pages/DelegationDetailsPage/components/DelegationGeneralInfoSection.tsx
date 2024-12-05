import { AuthHooks } from '@/api/auth'
import { DelegationDownloads, DelegationQueries } from '@/api/delegation'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { StatusChip } from '@/components/shared/StatusChip'
import { Link } from '@/router'
import { getLastDescriptor } from '@/utils/eservice.utils'
import { formatDateString } from '@/utils/format.utils'
import { Grid, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'
import DownloadIcon from '@mui/icons-material/Download'

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

  const delegationKindLabel = match(delegation.kind)
    .with('DELEGATED_PRODUCER', () => t('delegationKindField.kindProducer'))
    .with('DELEGATED_CONSUMER', () => t('delegationKindField.kindConsumer'))
    .exhaustive()

  const isReceived = match(jwt?.organizationId)
    .with(delegation.delegate.id, () => true)
    .with(delegation.delegator.id, () => false)
    .otherwise(() => false)

  const lastDescriptor = getLastDescriptor(delegation.eservice.descriptors)

  const downloadDelegationContract = DelegationDownloads.useDownloadDelegationContract()

  const handleDownloadDelegationDocument = () => {
    if (!delegation.activationContract) return
    downloadDelegationContract(
      {
        delegationId: delegationId,
        contractId: delegation.activationContract?.id,
      },
      `${delegation.activationContract.prettyName}.pdf`
    )
  }

  const handleDownloadRevokeDelegationDocument = () => {
    if (!delegation.revocationContract) return
    downloadDelegationContract(
      {
        delegationId: delegationId,
        contractId: delegation.revocationContract?.id,
      },
      `${delegation.revocationContract.prettyName}.pdf`
    )
  }

  const downloadDelegationContractAction = {
    startIcon: <DownloadIcon fontSize="small" />,
    label: t('downloadContractAction.label'),
    component: 'button',
    type: 'button',
    onClick: handleDownloadDelegationDocument,
  }

  const downloadRevokeDelegationContractAction = {
    startIcon: <DownloadIcon fontSize="small" />,
    label: t('downloadRevokedContractAction.label'),
    component: 'button',
    type: 'button',
    onClick: handleDownloadRevokeDelegationDocument,
  }

  const downloadContractActions = match(delegation.state)
    .with('ACTIVE', () => [downloadDelegationContractAction])
    .with('REVOKED', () => [
      downloadDelegationContractAction,
      downloadRevokeDelegationContractAction,
    ])
    .otherwise(() => [])

  return (
    <Grid container>
      <Grid item xs={7}>
        <SectionContainer title={t('title')} bottomActions={downloadContractActions}>
          <Stack spacing={2}>
            <InformationContainer
              label={t('eserviceNameField.label')}
              content={
                <Link
                  to={
                    lastDescriptor?.state === 'DRAFT'
                      ? 'PROVIDE_ESERVICE_SUMMARY'
                      : 'PROVIDE_ESERVICE_MANAGE'
                  }
                  params={{
                    eserviceId: delegation?.eservice.id,
                    descriptorId: lastDescriptor?.id ?? '',
                  }}
                >
                  {delegation.eservice.name}
                </Link>
              }
            />
            <InformationContainer
              label={t('eserviceProducerField.label')}
              content={delegation.eservice.producerName}
            />
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
