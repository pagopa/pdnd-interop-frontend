import React from 'react'
import { SectionContainer, InformationContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { StatusChip } from '../../StatusChip'
import { Chip, Divider, Link, Stack, Typography } from '@mui/material'
import { formatThousands, secondsToHoursMinutes } from '@/utils/format.utils'
import { useEServiceDetailsContext } from '../EServiceDetailsContext'
import { useCurrentRoute } from '@/router'
import { eserviceHelpLink } from '@/config/constants'

export const EServiceVersionInfoSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.versionInformations',
  })
  const { t: tCommon } = useTranslation('common')
  const { mode } = useCurrentRoute()

  const { eservice, isViewingDescriptorCurrentVersion } = useEServiceDetailsContext()
  const currentViewingDescriptor = eservice?.viewingDescriptor

  if (!eservice || !currentViewingDescriptor) return null

  const getFormattedVoucherLifespan = () => {
    const { hours, minutes } = secondsToHoursMinutes(currentViewingDescriptor.voucherLifespan)

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
    <SectionContainer>
      <SectionContainer.Title>{t('title')}</SectionContainer.Title>
      <SectionContainer.Content>
        <Stack spacing={2}>
          <InformationContainer label={t('actualVersion')}>
            <Stack spacing={1} direction="row" alignItems="center">
              <span>{currentViewingDescriptor.version}</span>
              {isViewingDescriptorCurrentVersion && (
                <Chip label={tCommon('table.headData.currentVersion')} color="primary" />
              )}
            </Stack>
          </InformationContainer>
          <InformationContainer label={t('versionStatus')}>
            <StatusChip for="eservice" state={currentViewingDescriptor.state} />
          </InformationContainer>
          <InformationContainer label={t('description')}>
            {currentViewingDescriptor?.description}
          </InformationContainer>
          <InformationContainer label={t('audience')} labelDescription={t('audienceDescription')}>
            {currentViewingDescriptor.audience.join(', ')}
          </InformationContainer>
          <InformationContainer label={t('voucherLifespan')}>
            {getFormattedVoucherLifespan()}
          </InformationContainer>
          <InformationContainer label={t('dailyCallsPerConsumer')}>
            {formatThousands(currentViewingDescriptor.dailyCallsPerConsumer)} {t('callsPerDay')}
          </InformationContainer>
          <InformationContainer label={t('dailyCallsTotal')}>
            {formatThousands(currentViewingDescriptor.dailyCallsTotal)} {t('callsPerDay')}
          </InformationContainer>
          <InformationContainer label={t('agreementApprovalPolicy.label')}>
            {t(`agreementApprovalPolicy.${currentViewingDescriptor.agreementApprovalPolicy}`)}
          </InformationContainer>

          {mode === 'provider' && (
            <>
              <Divider />

              <Typography variant="body2">
                {t('doubtsQuestion')}{' '}
                <Link href={eserviceHelpLink} target="_blank">
                  {t('doubtsLink')}
                </Link>
              </Typography>
            </>
          )}
        </Stack>
      </SectionContainer.Content>
    </SectionContainer>
  )
}
