import React from 'react'
import { SectionContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { StatusChip } from '../../StatusChip'
import { Chip, Stack } from '@mui/material'
import { formatThousands, secondsToHoursMinutes } from '@/utils/format.utils'
import { useEServiceDetailsContext } from '../EServiceDetailsContext'
import { InformationContainer } from '@pagopa/interop-fe-commons'

export const EServiceVersionInfoSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.versionInformations',
  })
  const { t: tCommon } = useTranslation('common')

  const { descriptor, isViewingDescriptorCurrentVersion } = useEServiceDetailsContext()

  if (!descriptor) return null

  const getFormattedVoucherLifespan = () => {
    const { hours, minutes } = secondsToHoursMinutes(descriptor.voucherLifespan)

    const minutesLabel = tCommon('time.minute', { count: minutes })
    const hoursLabel = tCommon('time.hour', { count: hours })
    const and = tCommon('conjunctions.and')

    if (hours === 0) {
      return `${minutes} ${minutesLabel}`
    }

    if (minutes === 0) {
      return `${hours} ${hoursLabel}`
    }

    return `${hours} ${hoursLabel} ${and} ${minutes} ${minutesLabel}`
  }

  return (
    <SectionContainer title={t('title')}>
      <Stack spacing={2}>
        <InformationContainer
          label={t('actualVersion')}
          content={
            <Stack spacing={1} direction="row" alignItems="center">
              <span>{descriptor.version}</span>
              {isViewingDescriptorCurrentVersion && (
                <Chip label={t('currentVersionChipLabel')} color="primary" />
              )}
            </Stack>
          }
        />
        <InformationContainer
          label={t('versionStatus')}
          content={<StatusChip for="eservice" state={descriptor.state} />}
        />
        <InformationContainer label={t('description')} content={descriptor.description ?? ''} />
        <InformationContainer
          label={t('audience')}
          labelDescription={t('audienceDescription')}
          content={descriptor.audience.join(', ')}
        />
        <InformationContainer
          label={t('voucherLifespan')}
          content={getFormattedVoucherLifespan()}
        />
        <InformationContainer
          label={t('dailyCallsPerConsumer')}
          content={`${formatThousands(descriptor.dailyCallsPerConsumer)} ${t('callsPerDay')}`}
        />
        <InformationContainer
          label={t('dailyCallsTotal')}
          content={`${formatThousands(descriptor.dailyCallsTotal)} ${t('callsPerDay')}`}
        />
        <InformationContainer
          label={t('agreementApprovalPolicy.label')}
          content={t(`agreementApprovalPolicy.${descriptor.agreementApprovalPolicy}`)}
        />
      </Stack>
    </SectionContainer>
  )
}
