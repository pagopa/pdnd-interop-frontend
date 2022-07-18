import React from 'react'
import { Link } from '@mui/material'
import { useRoute } from '../hooks/useRoute'
import { buildDynamicPath } from '../lib/router-utils'
import { ClientVoucherStepProps, InteropM2MVoucherStepProps } from './VoucherRead'
import { StepActions } from './Shared/StepActions'
import { StyledIntro } from './Shared/StyledIntro'
import { DescriptionBlock } from './DescriptionBlock'
import { InlineClipboard } from './Shared/InlineClipboard'
import { StyledLink } from './Shared/StyledLink'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { EServiceReadType } from '../../types'
import { useTranslation } from 'react-i18next'
import { API_GATEWAY_INTEFACE_URL } from '../lib/env'
import { StyledPaper } from './StyledPaper'

export const VoucherReadStep3 = ({
  clientKind,
  back,
  forward,
  ...props
}: ClientVoucherStepProps | InteropM2MVoucherStepProps) => {
  return clientKind === 'CONSUMER' ? (
    <ClientVoucherReadStep3
      clientKind={clientKind}
      forward={forward}
      back={back}
      purposeId=""
      {...props}
    />
  ) : (
    <InteropM2MVoucherReadStep3 clientKind={clientKind} forward={forward} back={back} {...props} />
  )
}

const ClientVoucherReadStep3 = ({ data, back }: ClientVoucherStepProps) => {
  const { routes } = useRoute()
  const { t } = useTranslation('voucher')

  const { data: eserviceData } = useAsyncFetch<EServiceReadType>({
    path: {
      endpoint: 'ESERVICE_GET_SINGLE',
      endpointParams: { eserviceId: data?.eservice.id, descriptorId: data?.eservice.descriptor.id },
    },
  })

  const descriptorAudience =
    eserviceData &&
    eserviceData.descriptors.find((d) => d.id === data?.eservice.descriptor.id)?.audience[0]

  return (
    <StyledPaper>
      <StyledIntro component="h2">
        {{
          title: t('step3.consumer.title'),
          description: t('step3.consumer.description'),
        }}
      </StyledIntro>

      <DescriptionBlock
        label={t('step3.consumer.audField.label')}
        labelDescription={t('step3.consumer.audField.description')}
      >
        {descriptorAudience && (
          <InlineClipboard
            textToCopy={descriptorAudience}
            successFeedbackText={t('step3.consumer.audField.copySuccessFeedbackText')}
          />
        )}
      </DescriptionBlock>

      <DescriptionBlock label={t('step3.consumer.eserviceDetailsField.label')}>
        <StyledLink
          to={buildDynamicPath(routes.SUBSCRIBE_CATALOG_VIEW.PATH, {
            eserviceId: data?.eservice.id,
            descriptorId: data?.eservice.descriptor.id,
          })}
        >
          {data?.eservice.name}
        </StyledLink>
      </DescriptionBlock>

      <StepActions back={{ label: t('backBtn'), type: 'button', onClick: back }} />
    </StyledPaper>
  )
}

const InteropM2MVoucherReadStep3 = ({ back }: InteropM2MVoucherStepProps) => {
  const { t } = useTranslation('voucher')

  return (
    <StyledPaper>
      <StyledIntro component="h2">
        {{
          title: t('step3.api.title'),
          description: t('step3.api.description'),
        }}
      </StyledIntro>

      <DescriptionBlock label={t('step3.api.apiField.label')}>
        <Link
          href={API_GATEWAY_INTEFACE_URL}
          target="_blank"
          rel="noreferrer"
          title={t('step3.api.apiField.link.title')}
        >
          {t('step3.api.apiField.link.label')}
        </Link>
      </DescriptionBlock>

      <StepActions back={{ label: t('backBtn'), type: 'button', onClick: back }} />
    </StyledPaper>
  )
}
