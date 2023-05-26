import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { SectionContainer } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import { API_GATEWAY_INTEFACE_URL } from '@/config/env'
import { Link } from '@/router'
import { Link as MUILink, Skeleton, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useClientKind } from '@/hooks/useClientKind'
import type { VoucherInstructionsStepProps } from '../../types/voucher-instructions.types'
import { InformationContainer } from '@pagopa/interop-fe-commons'

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
    <SectionContainer
      title={t('step3.consumer.title')}
      description={t('step3.consumer.description')}
    >
      <Stack spacing={4} sx={{ my: 4 }}>
        <InformationContainer
          label={t('step3.consumer.audField.label')}
          labelDescription={t('step3.consumer.audField.description')}
          content={
            <>
              {isLoadingDescriptor && !descriptorAudience && <Skeleton width={200} />}
              {descriptorAudience}
            </>
          }
          copyToClipboard={
            descriptorAudience
              ? {
                  value: descriptorAudience,
                  tooltipTitle: t('step3.consumer.audField.copySuccessFeedbackText'),
                }
              : undefined
          }
        />

        {purpose && (
          <InformationContainer
            label={t('step3.consumer.eserviceDetailsField.label')}
            content={
              <Link
                to="SUBSCRIBE_CATALOG_VIEW"
                params={{
                  eserviceId: purpose.eservice.id,
                  descriptorId: purpose.eservice.descriptor.id,
                }}
                target="_blank"
              >
                {purpose.eservice.name}
              </Link>
            }
          />
        )}
      </Stack>

      <StepActions back={{ label: t('backBtn'), type: 'button', onClick: back }} />
    </SectionContainer>
  )
}

const InteropM2MVoucherInstructionsStep3: React.FC<VoucherInstructionsStepProps> = ({ back }) => {
  const { t } = useTranslation('voucher')

  return (
    <SectionContainer title={t('step3.api.title')} description={t('step3.api.description')}>
      <InformationContainer
        sx={{ my: 4 }}
        label={t('step3.api.apiField.label')}
        content={
          <MUILink
            href={API_GATEWAY_INTEFACE_URL}
            target="_blank"
            rel="noreferrer"
            title={t('step3.api.apiField.link.title')}
          >
            {t('step3.api.apiField.link.label')}
          </MUILink>
        }
      />
      <StepActions back={{ label: t('backBtn'), type: 'button', onClick: back }} />
    </SectionContainer>
  )
}
