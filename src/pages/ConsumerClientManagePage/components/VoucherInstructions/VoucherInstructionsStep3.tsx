import { EServiceQueries } from '@/api/eservice'
import { InformationContainer, SectionContainer } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import { API_GATEWAY_INTEFACE_URL } from '@/config/env'
import { RouterLink } from '@/router'
import { Link, Skeleton, Stack, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useClientKind } from '@/hooks/useClientKind'
import type { VoucherInstructionsStepProps } from '../../types/voucher-instructions.types'
import { InlineClipboard } from '@/components/shared/InlineClipboard'

export const VoucherInstructionsStep3: React.FC<VoucherInstructionsStepProps> = (props) => {
  const clientKind = useClientKind()
  if (clientKind === 'CONSUMER') {
    return <ClientVoucherInstructionsStep3 {...props} />
  }
  return <InteropM2MVoucherInstructionsStep3 {...props} />
}

const ClientVoucherInstructionsStep3: React.FC<VoucherInstructionsStepProps> = ({
  purpose,
  back,
}) => {
  const { t } = useTranslation('voucher')

  const { data: descriptor, isLoading: isLoadingDescriptor } =
    EServiceQueries.useGetDescriptorCatalog(
      purpose?.eservice.id as string,
      purpose?.eservice.descriptor.id as string,
      { enabled: !!(purpose?.eservice.id && purpose?.eservice.descriptor.id), suspense: false }
    )

  const descriptorAudience = descriptor && descriptor.audience[0]

  return (
    <SectionContainer>
      <Typography component="h2" variant="h5">
        {t('step3.consumer.title')}
      </Typography>
      <Typography sx={{ mt: 1 }} component="p" variant="body1" color="text.secondary">
        {t('step3.consumer.description')}
      </Typography>

      <Stack spacing={4} sx={{ my: 4 }}>
        <InformationContainer
          label={t('step3.consumer.audField.label')}
          labelDescription={t('step3.consumer.audField.description')}
        >
          {isLoadingDescriptor && !descriptorAudience && <Skeleton width={200} />}
          {descriptorAudience && (
            <InlineClipboard
              textToCopy={descriptorAudience}
              successFeedbackText={t('step3.consumer.audField.copySuccessFeedbackText')}
            />
          )}
        </InformationContainer>

        {purpose && (
          <InformationContainer label={t('step3.consumer.eserviceDetailsField.label')}>
            <RouterLink
              to="SUBSCRIBE_CATALOG_VIEW"
              params={{
                eserviceId: purpose.eservice.id,
                descriptorId: purpose.eservice.descriptor.id,
              }}
              target="_blank"
            >
              {purpose.eservice.name}
            </RouterLink>
          </InformationContainer>
        )}
      </Stack>

      <StepActions back={{ label: t('backBtn'), type: 'button', onClick: back }} />
    </SectionContainer>
  )
}

const InteropM2MVoucherInstructionsStep3: React.FC<VoucherInstructionsStepProps> = ({ back }) => {
  const { t } = useTranslation('voucher')

  return (
    <SectionContainer>
      <Typography component="h2" variant="h5">
        {t('step3.api.title')}
      </Typography>
      <Typography sx={{ mt: 1 }} component="p" variant="body1" color="text.secondary">
        {t('step3.api.description')}
      </Typography>

      <InformationContainer sx={{ my: 4 }} label={t('step3.api.apiField.label')}>
        <Link
          href={API_GATEWAY_INTEFACE_URL}
          target="_blank"
          rel="noreferrer"
          title={t('step3.api.apiField.link.title')}
        >
          {t('step3.api.apiField.link.label')}
        </Link>
      </InformationContainer>

      <StepActions back={{ label: t('backBtn'), type: 'button', onClick: back }} />
    </SectionContainer>
  )
}
