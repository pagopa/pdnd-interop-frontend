import React from 'react'
import { PurposeQueries } from '@/api/purpose'
import {
  InformationContainer,
  SectionContainer,
  SectionContainerSkeleton,
} from '@/components/layout/containers'
import { Accordion, AccordionEntry } from '@/components/shared/Accordion'
import { Button, Divider, Link, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import LaunchIcon from '@mui/icons-material/Launch'
import { useDialog } from '@/contexts'
import { purposeUpgradeGuideLink } from '@/config/constants'
import { formatDateString, formatThousands } from '@/utils/format.utils'

interface PurposeDetailsLoadEstimateUpdateSectionProps {
  purposeId: string
}

export const PurposeDetailsLoadEstimateUpdateSection: React.FC<
  PurposeDetailsLoadEstimateUpdateSectionProps
> = ({ purposeId }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'view.sections.loadEstimateUpdate' })
  const { data: purpose } = PurposeQueries.useGetSingle(purposeId)
  const { openDialog } = useDialog()

  const state = purpose?.currentVersion?.state

  if (!purpose || !purpose.mostRecentVersion || state === 'ARCHIVED' || state === 'DRAFT')
    return null

  const accordionEntries: Array<AccordionEntry> = t('faq', { returnObjects: true })

  const handleUpdateDailyCalls = () => {
    openDialog({
      type: 'updatePurposeDailyCalls',
      purposeId,
      dailyCalls: purpose.currentVersion?.dailyCalls,
    })
  }

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack sx={{ pt: 1 }} spacing={2}>
        {purpose.mostRecentVersion.state === 'WAITING_FOR_APPROVAL' && (
          <>
            <InformationContainer
              label={t('dateEstimateField.label')}
              labelDescription={t('dateEstimateField.description')}
            >
              {purpose.mostRecentVersion.expectedApprovalDate
                ? formatDateString(purpose.mostRecentVersion.expectedApprovalDate)
                : t('dateEstimateField.emptyLabel')}
            </InformationContainer>
            <InformationContainer label={t('loadEstimateRequestedField.label')}>
              {t('loadEstimateRequestedField.value', {
                value: formatThousands(purpose.mostRecentVersion?.dailyCalls ?? 0),
              })}
            </InformationContainer>
          </>
        )}
        <InformationContainer label="FAQ">
          <Accordion entries={accordionEntries} />
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
        <Stack direction="row" justifyContent="center">
          <Button onClick={handleUpdateDailyCalls} variant="outlined">
            {t('updateDailyCalls')}
          </Button>
        </Stack>
      </Stack>
    </SectionContainer>
  )
}

export const PurposeDetailsLoadEstimateUpdateSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={556} />
}
