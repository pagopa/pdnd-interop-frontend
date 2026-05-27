import type { AsyncExchangeProperties } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { RHFCheckbox, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { asyncExchangeGuideLink } from '@/config/constants'
import { Alert, Grid, Link, Stack, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'

type EServiceAsyncExchangeSectionBaseProps = {
  areGeneralInfoEditable: boolean
  areAdvancedOptionsEditable: boolean
  asyncExchangeProperties?: AsyncExchangeProperties
  editableCallbackInterfaceContent: React.ReactNode
  readOnlyCallbackInterfaceContent: string | React.ReactElement
  isSoap?: boolean
  forceBulkFalse?: boolean
}

const asyncExchangeNumericFields = [
  {
    name: 'asyncExchangeProperties.responseTime',
    translationKey: 'responseTimeField',
    sx: { flex: 1, my: 0 },
  },
  {
    name: 'asyncExchangeProperties.maxResultSet',
    translationKey: 'maxResultSetField',
    sx: { flex: 1, my: 0 },
  },
  {
    name: 'asyncExchangeProperties.resourceAvailableTime',
    translationKey: 'resourceAvailableTimeField',
    sx: { my: 0 },
  },
] satisfies Array<{
  name: `asyncExchangeProperties.${keyof Pick<
    AsyncExchangeProperties,
    'responseTime' | 'maxResultSet' | 'resourceAvailableTime'
  >}`
  translationKey: 'responseTimeField' | 'maxResultSetField' | 'resourceAvailableTimeField'
  sx: { flex?: number; my: number }
}>

export const EServiceAsyncExchangeSectionBase: React.FC<EServiceAsyncExchangeSectionBaseProps> = ({
  areGeneralInfoEditable,
  areAdvancedOptionsEditable,
  asyncExchangeProperties,
  editableCallbackInterfaceContent,
  readOnlyCallbackInterfaceContent,
  isSoap = false,
  forceBulkFalse = false,
}) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'create.step4.asyncExchangeSection',
  })
  const { setValue } = useFormContext()

  React.useEffect(() => {
    if (isSoap && forceBulkFalse) {
      setValue('asyncExchangeProperties.bulk', false)
    }
  }, [forceBulkFalse, isSoap, setValue])

  const description = (
    <Trans
      components={{
        1: (
          <Link
            underline="hover"
            href={asyncExchangeGuideLink}
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
      }}
    >
      {t('description')}
    </Trans>
  )

  if (!areGeneralInfoEditable) {
    return (
      <SectionContainer title={t('title')} description={description} sx={{ mt: 3 }}>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <InformationContainer
            label={t('callbackInterface.readOnlyLabel')}
            content={readOnlyCallbackInterfaceContent}
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            {t('configSubsection.title')}
          </Typography>
          <InformationContainer
            label={t('responseTimeField.label')}
            content={asyncExchangeProperties?.responseTime?.toString() ?? '-'}
          />
          <InformationContainer
            label={t('maxResultSetField.label')}
            content={asyncExchangeProperties?.maxResultSet?.toString() ?? '-'}
          />
          <InformationContainer
            label={t('resourceAvailableTimeField.label')}
            content={asyncExchangeProperties?.resourceAvailableTime?.toString() ?? '-'}
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            {t('advancedSubsection.title')}
          </Typography>
          <InformationContainer
            label={t('confirmationField.label')}
            content={
              asyncExchangeProperties
                ? t(`readOnlyOptions.${Boolean(asyncExchangeProperties.confirmation)}`)
                : '-'
            }
          />
          <InformationContainer
            label={t('bulkField.label')}
            content={
              asyncExchangeProperties
                ? t(`readOnlyOptions.${Boolean(asyncExchangeProperties.bulk)}`)
                : '-'
            }
          />
        </Stack>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer title={t('title')} description={description} sx={{ mt: 3 }}>
      <Alert severity="warning" sx={{ mt: 2 }}>
        {t('editableInfoAlert')}
      </Alert>

      {editableCallbackInterfaceContent}

      <Typography variant="subtitle1" sx={{ mt: 3 }}>
        {t('configSubsection.title')}
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {asyncExchangeNumericFields.map(({ name, translationKey, sx }) => (
          <Grid item xs={12} sm={6} key={name}>
            <RHFTextField
              size="small"
              name={name}
              label={t(`${translationKey}.label`)}
              infoLabel={t(`${translationKey}.infoLabel`)}
              type="number"
              inputProps={{ min: 1 }}
              required
              rules={{
                required: true,
                min: 1,
                validate: (value) => Number.isInteger(Number(value)) || t('validation.integer'),
              }}
              sx={sx}
            />
          </Grid>
        ))}
      </Grid>
      <Typography variant="subtitle1" sx={{ mt: 3 }}>
        {t('advancedSubsection.title')}
      </Typography>
      {areAdvancedOptionsEditable ? (
        <Stack spacing={0} sx={{ mt: 1 }}>
          <RHFCheckbox
            name="asyncExchangeProperties.confirmation"
            label={t('confirmationField.label')}
            infoLabel={t('confirmationField.infoLabel')}
            sx={{ my: 0 }}
          />
          <RHFCheckbox
            name="asyncExchangeProperties.bulk"
            label={t('bulkField.label')}
            infoLabel={t('bulkField.infoLabel')}
            disabled={isSoap}
            sx={{ mb: 0 }}
          />
        </Stack>
      ) : (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <InformationContainer
            label={t('confirmationField.label')}
            content={
              asyncExchangeProperties
                ? t(`readOnlyOptions.${Boolean(asyncExchangeProperties.confirmation)}`)
                : '-'
            }
          />
          <InformationContainer
            label={t('bulkField.label')}
            content={
              asyncExchangeProperties
                ? t(`readOnlyOptions.${Boolean(asyncExchangeProperties.bulk)}`)
                : '-'
            }
          />
        </Stack>
      )}
    </SectionContainer>
  )
}
