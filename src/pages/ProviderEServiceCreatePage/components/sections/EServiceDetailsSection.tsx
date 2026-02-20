import type { EServiceMode, EServiceTemplateDetails } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { RHFRadioGroup } from '@/components/shared/react-hook-form-inputs'
import { FEATURE_FLAG_ESERVICE_PERSONAL_DATA } from '@/config/env'
import { Alert } from '@mui/material'
import { useTranslation } from 'react-i18next'

type EServiceDetailsSectionProps = {
  isEserviceFromTemplate: boolean
  areEServiceGeneralInfoEditable: boolean
  eserviceTemplate?: EServiceTemplateDetails
  eserviceMode: EServiceMode
  onEserviceModeChange?: (value: EServiceMode) => void
}

export const EServiceDetailsSection: React.FC<EServiceDetailsSectionProps> = ({
  isEserviceFromTemplate,
  areEServiceGeneralInfoEditable,
  eserviceTemplate,
  eserviceMode,
  onEserviceModeChange,
}) => {
  const { t } = useTranslation('eservice')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'validation.mixed' })
  return (
    <SectionContainer title={t('create.step1.detailsSection.title')}>
      {!isEserviceFromTemplate && (
        <Alert severity="warning" sx={{ mb: 0, mt: 3 }}>
          {t('create.step1.firstVersionOnlyEditableInfo')}
        </Alert>
      )}
      <RHFRadioGroup
        name="technology"
        row
        label={t('create.step1.eserviceTechnologyField.label')}
        options={[
          { label: 'REST', value: 'REST' },
          { label: 'SOAP', value: 'SOAP' },
        ]}
        disabled={!areEServiceGeneralInfoEditable || isEserviceFromTemplate}
        rules={{ required: true }}
        sx={{ mb: 0, mt: 3 }}
      />

      <RHFRadioGroup
        name="mode"
        row
        label={t('create.step1.eserviceModeField.label')}
        options={[
          {
            label: t('create.step1.eserviceModeField.options.DELIVER'),
            value: 'DELIVER',
          },
          {
            label: t('create.step1.eserviceModeField.options.RECEIVE'),
            value: 'RECEIVE',
          },
        ]}
        disabled={!areEServiceGeneralInfoEditable || isEserviceFromTemplate}
        rules={{ required: true }}
        sx={{ mb: 0, mt: 3 }}
        onValueChange={(mode) => onEserviceModeChange!(mode as EServiceMode)}
      />
      {FEATURE_FLAG_ESERVICE_PERSONAL_DATA && (
        <>
          <RHFRadioGroup
            name="personalData"
            row
            label={t(`create.step1.eservicePersonalDataField.${eserviceMode}.label`)}
            options={[
              {
                label: t(`create.step1.eservicePersonalDataField.${eserviceMode}.options.true`),
                value: true,
              },
              {
                label: t(`create.step1.eservicePersonalDataField.${eserviceMode}.options.false`),
                value: false,
              },
            ]}
            disabled={!areEServiceGeneralInfoEditable || isEserviceFromTemplate}
            rules={{
              validate: (value) => value === true || value === false || tCommon('required'),
            }}
            sx={{ mb: 3, mt: 3 }}
            isOptionValueAsBoolean
          />
          {isEserviceFromTemplate && eserviceTemplate?.personalData === undefined && (
            <Alert severity="error" variant="outlined">
              {t('create.step1.eservicePersonalDataField.alertMissingPersonalData', {
                tenantName: eserviceTemplate?.creator.name,
              })}
            </Alert>
          )}
        </>
      )}
    </SectionContainer>
  )
}
