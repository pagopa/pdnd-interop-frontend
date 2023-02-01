import React from 'react'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { InformationContainer, SectionContainer } from '@/components/layout/containers'
import { Button, Divider, Link, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import LaunchIcon from '@mui/icons-material/Launch'
import { purposeUpgradeGuideLink } from '@/config/constants'
import { formatDateString, formatThousands } from '@/utils/format.utils'
import { useDialog } from '@/stores'

interface PurposeDetailsLoadEstimateUpdateSectionProps {
  purposeId: string
}

export const PurposeDetailsLoadEstimateUpdateSection: React.FC<
  PurposeDetailsLoadEstimateUpdateSectionProps
> = ({ purposeId }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'view.sections.loadEstimateUpdate' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })
  const { mutate: activateVersion } = PurposeMutations.useActivateVersion()
  const { openDialog } = useDialog()

  const { data: purpose } = PurposeQueries.useGetSingle(purposeId)

  const waitingForApprovalVersion = purpose!.waitingForApprovalVersion!

  const handleConfirmUpdate = () => {
    activateVersion({ purposeId: purpose!.id, versionId: waitingForApprovalVersion.id })
  }

  const handleSetActivationDate = () => {
    openDialog({
      type: 'setPurposeExpectedApprovalDate',
      purposeId: purpose!.id,
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
        >
          {waitingForApprovalVersion.expectedApprovalDate
            ? formatDateString(waitingForApprovalVersion.expectedApprovalDate)
            : t('dateEstimateField.emptyLabel')}
        </InformationContainer>
        <InformationContainer label={t('loadEstimateRequestedField.providerLabel')}>
          {t('loadEstimateRequestedField.value', {
            value: formatThousands(waitingForApprovalVersion?.dailyCalls ?? 0),
          })}
        </InformationContainer>
        <InformationContainer label={t('linksField.label')}>
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
        </InformationContainer>
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
