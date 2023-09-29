import { Drawer } from '@/components/shared/Drawer'
import React from 'react'
import { useVoucherInstructionsContext } from '../VoucherInstructionsContext'
import { PurposeQueries } from '@/api/purpose'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { Trans, useTranslation } from 'react-i18next'
import { Link, Stack } from '@mui/material'
import { apiGuideLink } from '@/config/constants'

type VoucherInstructionsStep1CurrentIdsDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
}

export const VoucherInstructionsStep1CurrentIdsDrawer: React.FC<
  VoucherInstructionsStep1CurrentIdsDrawerProps
> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('voucher', { keyPrefix: 'new-step1.currentIdsDrawer' })

  const { clientId, selectedPurposeId } = useVoucherInstructionsContext()
  const { data: purpose } = PurposeQueries.useGetSingle(selectedPurposeId!, {
    enabled: !!selectedPurposeId,
    suspense: false,
  })

  return (
    <Drawer
      title={t('title')}
      subtitle={
        <Trans components={{ 1: <Link href={apiGuideLink} target="_blank" /> }}>
          {t('subtitle')}
        </Trans>
      }
      isOpen={isOpen}
      onClose={onClose}
    >
      <Stack sx={{ mt: 2, mb: 8 }} spacing={2}>
        {purpose && (
          <>
            <InformationContainer
              direction="column"
              label="eserviceId"
              labelDescription={t('eserviceIdDescription')}
              copyToClipboard={{ value: purpose.eservice.id }}
              content={purpose.eservice.id}
            />

            <InformationContainer
              direction="column"
              label="descriptorId"
              labelDescription={t('descriptorIdDescription')}
              copyToClipboard={{ value: purpose.eservice.descriptor.id }}
              content={purpose.eservice.descriptor.id}
            />

            <InformationContainer
              direction="column"
              label="agreementId"
              labelDescription={t('agreementIdDescription')}
              copyToClipboard={{ value: purpose.agreement.id }}
              content={purpose.agreement.id}
            />

            <InformationContainer
              direction="column"
              label="purposeId"
              labelDescription={t('purposeIdDescription')}
              copyToClipboard={{ value: purpose.id }}
              content={purpose.id}
            />
          </>
        )}

        <InformationContainer
          direction="column"
          label="clientId"
          labelDescription={t('clientIdDescription')}
          copyToClipboard={{ value: clientId }}
          content={clientId}
        />

        {purpose && (
          <>
            <InformationContainer
              direction="column"
              label={t('producerOrganizationId.label')}
              labelDescription={t('producerOrganizationId.description')}
              copyToClipboard={{ value: purpose.eservice.producer.id }}
              content={purpose.eservice.producer.id}
            />

            <InformationContainer
              direction="column"
              label={t('consumerOrganizationId.label')}
              labelDescription={t('consumerOrganizationId.description')}
              copyToClipboard={{ value: purpose.consumer.id }}
              content={purpose.consumer.id}
            />
          </>
        )}
      </Stack>
    </Drawer>
  )
}
