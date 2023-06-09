import React from 'react'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Accordion } from '@/components/shared/Accordion'
import type { AccordionEntry } from '@/components/shared/Accordion'
import { Button, Divider, Link, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import LaunchIcon from '@mui/icons-material/Launch'
import { useDialog } from '@/stores'
import { purposeUpgradeGuideLink } from '@/config/constants'
import { formatDateString, formatThousands } from '@/utils/format.utils'
import { useJwt } from '@/hooks/useJwt'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import type { Purpose } from '@/api/api.generatedTypes'

interface ConsumerPurposeDetailsLoadEstimateUpdateSectionProps {
  purpose?: Purpose
}

export const ConsumerPurposeDetailsLoadEstimateUpdateSection: React.FC<
  ConsumerPurposeDetailsLoadEstimateUpdateSectionProps
> = ({ purpose }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'view.sections.loadEstimateUpdate' })
  const { isAdmin } = useJwt()

  const { openDialog } = useDialog()

  const state = purpose?.currentVersion?.state

  if (!purpose || state === 'ARCHIVED' || state === 'DRAFT' || !isAdmin) return null

  const accordionEntries: Array<AccordionEntry> = t('faq', { returnObjects: true })

  const handleUpdateDailyCalls = () => {
    openDialog({
      type: 'updatePurposeDailyCalls',
      purposeId: purpose.id,
      dailyCalls: purpose.currentVersion?.dailyCalls,
    })
  }

  return (
    <SectionContainer title={t('title')} description={t('consumerDescription')}>
      <Stack sx={{ pt: 1 }} spacing={2}>
        {purpose.waitingForApprovalVersion && (
          <>
            <InformationContainer
              label={t('dateEstimateField.label')}
              labelDescription={t('dateEstimateField.consumerDescription')}
              content={
                purpose.waitingForApprovalVersion.expectedApprovalDate
                  ? formatDateString(purpose.waitingForApprovalVersion.expectedApprovalDate)
                  : t('dateEstimateField.emptyLabel')
              }
            />

            <InformationContainer
              label={t('loadEstimateRequestedField.consumerLabel')}
              content={t('loadEstimateRequestedField.value', {
                value: formatThousands(purpose.waitingForApprovalVersion?.dailyCalls ?? 0),
              })}
            />
          </>
        )}
        <InformationContainer label="FAQ" content={<Accordion entries={accordionEntries} />} />

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

        {!purpose.waitingForApprovalVersion && (
          <>
            <Divider />
            <Stack direction="row" justifyContent="center">
              <Button onClick={handleUpdateDailyCalls} variant="outlined">
                {t('updateDailyCalls')}
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </SectionContainer>
  )
}

export const ConsumerPurposeDetailsLoadEstimateUpdateSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={556} />
}
