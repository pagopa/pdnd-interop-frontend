import React from 'react'
import { PurposeMutations } from '@/api/purpose'
import { SectionContainer } from '@/components/layout/containers'
import { Button, Divider, Link, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import LaunchIcon from '@mui/icons-material/Launch'
import { purposeUpgradeGuideLink } from '@/config/constants'
import { formatDateString, formatThousands } from '@/utils/format.utils'
import { useDialog } from '@/stores'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import type { Purpose } from '@/api/api.generatedTypes'
import { useJwt } from '@/hooks/useJwt'

interface ProviderPurposeDetailsLoadEstimateUpdateSectionProps {
  purpose?: Purpose
}

export const ProviderPurposeDetailsLoadEstimateUpdateSection: React.FC<
  ProviderPurposeDetailsLoadEstimateUpdateSectionProps
> = ({ purpose }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'view.sections.loadEstimateUpdate' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { isAdmin } = useJwt()

  const { mutate: activateVersion } = PurposeMutations.useActivateVersion()
  const { openDialog } = useDialog()

  const waitingForApprovalVersion = purpose?.waitingForApprovalVersion

  if (!purpose || !waitingForApprovalVersion || !isAdmin) return null

  const handleConfirmUpdate = () => {
    activateVersion({ purposeId: purpose!.id, versionId: waitingForApprovalVersion.id })
  }

  const handleSetActivationDate = () => {
    openDialog({
      type: 'setPurposeExpectedApprovalDate',
      purposeId: purpose.id,
      versionId: waitingForApprovalVersion.id,
      approvalDate: waitingForApprovalVersion.expectedApprovalDate,
    })
  }

  return (
    <SectionContainer title={t('title')} description={t('providerDescription')}>
      <Stack sx={{ pt: 1 }} spacing={2}>
        <InformationContainer
          label={t('dateEstimateField.label')}
          labelDescription={t('dateEstimateField.providerDescription')}
          content={
            waitingForApprovalVersion.expectedApprovalDate
              ? formatDateString(waitingForApprovalVersion.expectedApprovalDate)
              : t('dateEstimateField.emptyLabel')
          }
        />
        <InformationContainer
          label={t('loadEstimateRequestedField.providerLabel')}
          content={t('loadEstimateRequestedField.value', {
            value: formatThousands(waitingForApprovalVersion?.dailyCalls ?? 0),
          })}
        />
        <InformationContainer
          label={t('linksField.label')}
          content={
            <Stack>
              <Link
                component="a"
                href={purposeUpgradeGuideLink}
                target="_blank"
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >
                <LaunchIcon sx={{ mr: 1 }} /> {t('linksField.upgradeGuideLink.label')}
              </Link>
            </Stack>
          }
        />

        <Divider />
        <Stack direction="row" justifyContent="center" spacing={2}>
          <Button onClick={handleSetActivationDate} variant="outlined">
            {tCommon('updateCompletionDate')}
          </Button>
          <Button onClick={handleConfirmUpdate} variant="text">
            {tCommon('confirmUpdate')}
          </Button>
        </Stack>
      </Stack>
    </SectionContainer>
  )
}
