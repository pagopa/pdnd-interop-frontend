import { SectionContainer } from '@/components/layout/containers'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { payloadVerificationGuideLink } from '@/config/constants'
import { Link, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { Trans, useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'

type EServiceVoucherSectionProps = {
  isEServiceCreatedFromTemplate: boolean
}

export const EServiceVoucherSection: React.FC<EServiceVoucherSectionProps> = ({
  isEServiceCreatedFromTemplate,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step2.voucherSection' })

  const { descriptor } = useEServiceCreateContext()

  return (
    <SectionContainer title={t('title')} sx={{ mt: 3 }}>
      <Stack
        direction={isEServiceCreatedFromTemplate ? 'column' : 'row'}
        spacing={isEServiceCreatedFromTemplate ? 4 : 2}
        sx={{ mt: 3 }}
      >
        {isEServiceCreatedFromTemplate ? (
          <InformationContainer
            label={t('voucherLifespanField.readOnlyLabel')}
            content={t('voucherLifespanField.valueLabel', { count: descriptor?.voucherLifespan })}
          />
        ) : (
          <RHFTextField
            size="small"
            name="voucherLifespan"
            label={t('voucherLifespanField.label')}
            infoLabel={t('voucherLifespanField.infoLabel')}
            type="number"
            inputProps={{ min: 1, max: 1440 }}
            rules={{ required: true, min: 1, max: 1440 }}
            sx={{ flex: 1, my: 0 }}
          />
        )}

        <RHFTextField
          size="small"
          name="audience"
          label={t('audienceField.label')}
          infoLabel={
            <Trans components={{ 1: <Link href={payloadVerificationGuideLink} target="_blank" /> }}>
              {t('audienceField.infoLabel')}
            </Trans>
          }
          inputProps={{ maxLength: 250 }}
          rules={{ required: true, minLength: 1 }}
          required
          sx={{ flex: 1, my: 0, width: '50%' }}
        />
      </Stack>
    </SectionContainer>
  )
}
