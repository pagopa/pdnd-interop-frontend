import type { EServiceMode, EServiceTechnology } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { RHFRadioGroup } from '@/components/shared/react-hook-form-inputs'
import { Alert, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export type EServiceDetails = {
  asyncExchange?: boolean
  technology: EServiceTechnology
  mode: EServiceMode
  personalData?: boolean
}

type EServiceDetailsSectionBaseProps = {
  isEditable: boolean
  eserviceMode: EServiceMode
  details?: EServiceDetails
  description?: string
  readOnlyDescription?: string
  missingPersonalDataTenantName?: string
  showFirstVersionOnlyEditableInfo?: boolean
  showOperatorApiWarning?: boolean
  onEserviceModeChange?: (value: EServiceMode) => void
}

const isEServiceMode = (value: string): value is EServiceMode =>
  value === 'DELIVER' || value === 'RECEIVE'

export const EServiceDetailsSectionBase: React.FC<EServiceDetailsSectionBaseProps> = ({
  isEditable,
  eserviceMode,
  details,
  description,
  readOnlyDescription,
  missingPersonalDataTenantName,
  showFirstVersionOnlyEditableInfo = false,
  showOperatorApiWarning = false,
  onEserviceModeChange,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step1.detailsSection' })

  if (!isEditable && details) {
    return (
      <SectionContainer title={t('title')} description={readOnlyDescription ?? description}>
        <Stack spacing={2}>
          <InformationContainer
            label={t('asyncExchangeField.readOnlyLabel')}
            content={t(`asyncExchangeField.readOnlyOptions.${Boolean(details.asyncExchange)}`)}
          />
          <InformationContainer
            label={t('technologyField.readOnlyLabel')}
            content={details.technology}
          />
          <InformationContainer
            label={t('modeField.label')}
            content={t(`modeField.options.${details.mode}`)}
          />
          {details.personalData !== undefined ? (
            <InformationContainer
              label={t(`personalDataField.${details.mode}.readOnlyLabel`)}
              content={t(
                `personalDataField.${details.mode}.readOnlyOptions.${details.personalData}`
              )}
            />
          ) : (
            missingPersonalDataTenantName && (
              <Alert severity="error" variant="outlined">
                {t('personalDataField.alertMissingPersonalData', {
                  tenantName: missingPersonalDataTenantName,
                })}
              </Alert>
            )
          )}
        </Stack>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer title={t('title')} description={description}>
      <EServiceDetailsEditableFields
        eserviceMode={eserviceMode}
        showFirstVersionOnlyEditableInfo={showFirstVersionOnlyEditableInfo}
        showOperatorApiWarning={showOperatorApiWarning}
        isEditable={isEditable}
        onEserviceModeChange={onEserviceModeChange}
      />
    </SectionContainer>
  )
}

type EServiceDetailsEditableFieldsProps = {
  isEditable: boolean
  eserviceMode: EServiceMode
  showFirstVersionOnlyEditableInfo: boolean
  showOperatorApiWarning: boolean
  onEserviceModeChange?: (value: EServiceMode) => void
}

const EServiceDetailsEditableFields: React.FC<EServiceDetailsEditableFieldsProps> = ({
  isEditable,
  eserviceMode,
  showFirstVersionOnlyEditableInfo,
  showOperatorApiWarning,
  onEserviceModeChange,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step1.detailsSection' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'validation.mixed' })
  const { watch, setValue } = useFormContext()

  const [asyncExchange, technology, mode] = watch(['asyncExchange', 'technology', 'mode'])

  useEffect(() => {
    if (asyncExchange && mode !== 'DELIVER') {
      setValue('mode', 'DELIVER', { shouldDirty: true, shouldValidate: true })
      onEserviceModeChange?.('DELIVER')
    }
  }, [asyncExchange, mode, setValue, onEserviceModeChange])

  return (
    <>
      {showFirstVersionOnlyEditableInfo && (
        <Alert severity="warning" sx={{ mb: 0, mt: 3 }}>
          {t('firstVersionOnlyEditableInfo')}
        </Alert>
      )}
      <RHFRadioGroup
        name="asyncExchange"
        row
        required
        label={t('asyncExchangeField.label')}
        options={[
          { label: t('asyncExchangeField.options.false'), value: false },
          { label: t('asyncExchangeField.options.true'), value: true },
        ]}
        disabled={!isEditable}
        rules={{
          validate: (value) => value === true || value === false || tCommon('required'),
        }}
        sx={{ mb: 0, mt: 3 }}
        isOptionValueAsBoolean
      />
      {asyncExchange && showOperatorApiWarning && (
        <Alert severity="warning" sx={{ mb: 0, mt: 3 }}>
          {t('asyncExchangeField.operatorApiWarning')}
        </Alert>
      )}
      <RHFRadioGroup
        name="technology"
        row
        required
        label={t('technologyField.label')}
        options={[
          { label: 'REST', value: 'REST' },
          { label: 'SOAP', value: 'SOAP' },
        ]}
        disabled={!isEditable}
        rules={{ required: true }}
        sx={{ mb: 0, mt: 3 }}
      />
      {asyncExchange && technology === 'SOAP' && (
        <Alert severity="warning" sx={{ mb: 0, mt: 3 }}>
          {t('asyncExchangeField.soapWarning')}
        </Alert>
      )}
      <RHFRadioGroup
        name="mode"
        row
        required
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
        disabled={!isEditable || asyncExchange}
        rules={{ required: true }}
        sx={{ mb: 0, mt: 3 }}
        onValueChange={(mode) => {
          if (isEServiceMode(mode)) onEserviceModeChange?.(mode)
        }}
      />
      <RHFRadioGroup
        name="personalData"
        row
        required
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
        disabled={!isEditable}
        rules={{
          validate: (value) => value === true || value === false || tCommon('required'),
        }}
        sx={{ mb: 3, mt: 3 }}
        isOptionValueAsBoolean
      />
    </>
  )
}
