import type { EServiceMode, EServiceTemplateDetails } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { RHFRadioGroup } from '@/components/shared/react-hook-form-inputs'
import { FEATURE_FLAG_ESERVICE_PERSONAL_DATA } from '@/config/env'
import { Alert, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'

type EServiceDetailsSectionProps = {
  areEServiceGeneralInfoEditable: boolean
  eserviceTemplate?: EServiceTemplateDetails
  eserviceMode: EServiceMode
  onEserviceModeChange?: (value: EServiceMode) => void
}

export const EServiceDetailsSection: React.FC<EServiceDetailsSectionProps> = ({
  areEServiceGeneralInfoEditable,
  eserviceTemplate,
  eserviceMode,
  onEserviceModeChange,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step1.detailsSection' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'validation.mixed' })

  if (eserviceTemplate) {
    return (
      <SectionContainer title={t('title')} description={t('description')}>
        <Stack spacing={2}>
          <InformationContainer
            label={t('technologyField.readOnlyLabel')}
            content={eserviceTemplate.technology}
          />
          <InformationContainer
            label={t('modeField.label')}
            content={t(`modeField.options.${eserviceTemplate.mode}`)}
          />
          {eserviceTemplate.personalData !== undefined ? (
            <InformationContainer
              label={t(`personalDataField.${eserviceTemplate.mode}.readOnlyLabel`)}
              content={t(
                `personalDataField.${eserviceTemplate.mode}.readOnlyOptions.${eserviceTemplate.personalData}`
              )}
            />
          ) : (
            <Alert severity="error" variant="outlined">
              {t('personalDataField.alertMissingPersonalData', {
                tenantName: eserviceTemplate?.creator.name,
              })}
            </Alert>
          )}
        </Stack>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer title={t('title')}>
      <Alert severity="warning" sx={{ mb: 0, mt: 3 }}>
        {t('firstVersionOnlyEditableInfo')}
      </Alert>
      <RHFRadioGroup
        name="technology"
        row
        label={t('technologyField.label')}
        options={[
          { label: 'REST', value: 'REST' },
          { label: 'SOAP', value: 'SOAP' },
        ]}
        disabled={!areEServiceGeneralInfoEditable}
        rules={{ required: true }}
        sx={{ mb: 0, mt: 3 }}
      />

      <RHFRadioGroup
        name="mode"
        row
        label={t('modeField.label')}
        options={[
          {
            label: t('modeField.options.DELIVER'),
            value: 'DELIVER',
          },
          {
            label: t('modeField.options.RECEIVE'),
            value: 'RECEIVE',
          },
        ]}
        disabled={!areEServiceGeneralInfoEditable}
        rules={{ required: true }}
        sx={{ mb: 0, mt: 3 }}
        onValueChange={(mode) => onEserviceModeChange!(mode as EServiceMode)}
      />
      {FEATURE_FLAG_ESERVICE_PERSONAL_DATA && (
        <>
          <RHFRadioGroup
            name="personalData"
            row
            label={t(`personalDataField.${eserviceMode}.label`)}
            options={[
              {
                label: t(`personalDataField.${eserviceMode}.options.true`),
                value: true,
              },
              {
                label: t(`personalDataField.${eserviceMode}.options.false`),
                value: false,
              },
            ]}
            disabled={!areEServiceGeneralInfoEditable}
            rules={{
              validate: (value) => value === true || value === false || tCommon('required'),
            }}
            sx={{ mb: 3, mt: 3 }}
            isOptionValueAsBoolean
          />
        </>
      )}
    </SectionContainer>
  )
}
