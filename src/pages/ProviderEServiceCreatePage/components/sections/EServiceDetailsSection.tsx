import type { EServiceMode, ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { SectionContainer } from '@/components/layout/containers'
import { RHFRadioGroup } from '@/components/shared/react-hook-form-inputs'
import { Alert, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { EServiceCreateStepGeneralFormValues } from '../EServiceCreateStepGeneral/EServiceCreateStepGeneral'

type EServiceDetailsSectionProps = {
  areEServiceGeneralInfoEditable: boolean
  eserviceMode: EServiceMode
  descriptor?: ProducerEServiceDescriptor
  onEserviceModeChange?: (value: EServiceMode) => void
}

export const EServiceDetailsSection: React.FC<EServiceDetailsSectionProps> = ({
  areEServiceGeneralInfoEditable,
  eserviceMode,
  descriptor,
  onEserviceModeChange,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step1.detailsSection' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'validation.mixed' })
  const { isOperatorAPI } = AuthHooks.useJwt()
  const { watch, setValue } = useFormContext<EServiceCreateStepGeneralFormValues>()

  const [asyncExchange, technology, mode] = watch(['asyncExchange', 'technology', 'mode'])

  useEffect(() => {
    if (asyncExchange && mode !== 'DELIVER') {
      setValue('mode', 'DELIVER', { shouldDirty: true, shouldValidate: true })
      onEserviceModeChange?.('DELIVER')
    }
  }, [asyncExchange, mode, setValue, onEserviceModeChange])

  if (!areEServiceGeneralInfoEditable && descriptor)
    return (
      <SectionContainer title={t('title')} description={t('readOnlyDescription')}>
        <Stack spacing={2}>
          <InformationContainer
            label={t('asyncExchangeField.readOnlyLabel')}
            content={t(
              `asyncExchangeField.readOnlyOptions.${Boolean(descriptor.eservice.asyncExchange)}`
            )}
          />
          <InformationContainer
            label={t('technologyField.readOnlyLabel')}
            content={descriptor.eservice.technology}
          />
          <InformationContainer
            label={t('modeField.label')}
            content={t(`modeField.options.${eserviceMode}`)}
          />
          {descriptor.eservice.personalData !== undefined && (
            <InformationContainer
              label={t(`personalDataField.${eserviceMode}.readOnlyLabel`)}
              content={t(
                `personalDataField.${eserviceMode}.readOnlyOptions.${descriptor.eservice.personalData}`
              )}
            />
          )}
        </Stack>
      </SectionContainer>
    )

  return (
    <SectionContainer title={t('title')}>
      <Alert severity="warning" sx={{ mb: 0, mt: 3 }}>
        {t('firstVersionOnlyEditableInfo')}
      </Alert>
      <RHFRadioGroup
        name="asyncExchange"
        row
        required
        label={t('asyncExchangeField.label')}
        options={[
          { label: t('asyncExchangeField.options.false'), value: false },
          { label: t('asyncExchangeField.options.true'), value: true },
        ]}
        disabled={!areEServiceGeneralInfoEditable}
        rules={{
          validate: (value) => value === true || value === false || tCommon('required'),
        }}
        sx={{ mb: 0, mt: 3 }}
        isOptionValueAsBoolean
      />
      {asyncExchange && isOperatorAPI && (
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
        disabled={!areEServiceGeneralInfoEditable}
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
        disabled={!areEServiceGeneralInfoEditable || asyncExchange}
        rules={{ required: true }}
        sx={{ mb: 0, mt: 3 }}
        onValueChange={(mode) => onEserviceModeChange?.(mode as EServiceMode)}
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
        disabled={!areEServiceGeneralInfoEditable}
        rules={{
          validate: (value) => value === true || value === false || tCommon('required'),
        }}
        sx={{ mb: 3, mt: 3 }}
        isOptionValueAsBoolean
      />
    </SectionContainer>
  )
}
