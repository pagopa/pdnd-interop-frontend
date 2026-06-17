import type { AsyncExchangeProperties } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { RHFCheckbox, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { asyncExchangeGuideLink } from '@/config/constants'
import { Alert, Box, Grid, Link, Stack, Typography } from '@mui/material'
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
  translationNamespace?: 'eservice' | 'eserviceTemplate'
  translationKeyPrefix?:
    | 'create.step4.asyncExchangeSection'
    | 'create.step3.technicalSpecs.asyncExchangeSection'
}

const asyncExchangeNumericFields = [
  {
    name: 'asyncExchangeProperties.responseTime',
    translationKey: 'responseTimeField',
    min: 1,
    max: 999999,
    sx: { flex: 1, my: 0 },
  },
  {
    name: 'asyncExchangeProperties.maxResultSet',
    translationKey: 'maxResultSetField',
    min: 1,
    max: 99999,
    sx: { flex: 1, my: 0 },
  },
  {
    name: 'asyncExchangeProperties.resourceAvailableTime',
    translationKey: 'resourceAvailableTimeField',
    min: 1,
    max: 999999,
    sx: { my: 0 },
  },
] satisfies Array<{
  name: `asyncExchangeProperties.${keyof Pick<
    AsyncExchangeProperties,
    'responseTime' | 'maxResultSet' | 'resourceAvailableTime'
  >}`
  translationKey: 'responseTimeField' | 'maxResultSetField' | 'resourceAvailableTimeField'
  min: number
  max: number
  sx: { flex?: number; my: number }
}>

const AdvancedOptionLabel: React.FC<{ label: string; infoLabel: string }> = ({
  label,
  infoLabel,
}) => (
  <Stack>
    <Typography variant="body1">{label}</Typography>
    <Typography variant="body2" color="text.secondary">
      {infoLabel}
    </Typography>
  </Stack>
)

export const EServiceAsyncExchangeSectionBase: React.FC<EServiceAsyncExchangeSectionBaseProps> = ({
  areGeneralInfoEditable,
  areAdvancedOptionsEditable,
  asyncExchangeProperties,
  editableCallbackInterfaceContent,
  readOnlyCallbackInterfaceContent,
  isSoap = false,
  forceBulkFalse = false,
  translationNamespace = 'eservice',
  translationKeyPrefix = 'create.step4.asyncExchangeSection',
}) => {
  const shouldUseDefaultTranslationPrefix =
    translationNamespace === 'eservice' &&
    translationKeyPrefix === 'create.step4.asyncExchangeSection'
  const { t } = useTranslation(
    translationNamespace,
    shouldUseDefaultTranslationPrefix ? { keyPrefix: translationKeyPrefix } : undefined
  )
  const { setValue } = useFormContext()
  const tAsyncExchange = (key: string) =>
    shouldUseDefaultTranslationPrefix ? t(key) : t(`${translationKeyPrefix}.${key}`)

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
      {tAsyncExchange('description')}
    </Trans>
  )

  if (!areGeneralInfoEditable) {
    return (
      <SectionContainer title={tAsyncExchange('title')} description={description} sx={{ mt: 3 }}>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <InformationContainer
            label={tAsyncExchange('callbackInterface.readOnlyLabel')}
            content={readOnlyCallbackInterfaceContent}
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            {tAsyncExchange('configSubsection.title')}
          </Typography>
          <InformationContainer
            label={tAsyncExchange('responseTimeField.label')}
            content={asyncExchangeProperties?.responseTime?.toString() ?? '-'}
          />
          <InformationContainer
            label={tAsyncExchange('maxResultSetField.label')}
            content={asyncExchangeProperties?.maxResultSet?.toString() ?? '-'}
          />
          <InformationContainer
            label={tAsyncExchange('resourceAvailableTimeField.label')}
            content={asyncExchangeProperties?.resourceAvailableTime?.toString() ?? '-'}
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            {tAsyncExchange('advancedSubsection.title')}
          </Typography>
          <InformationContainer
            label={tAsyncExchange('confirmationField.label')}
            content={
              asyncExchangeProperties
                ? tAsyncExchange(`readOnlyOptions.${Boolean(asyncExchangeProperties.confirmation)}`)
                : '-'
            }
          />
          <InformationContainer
            label={tAsyncExchange('bulkField.label')}
            content={
              asyncExchangeProperties
                ? tAsyncExchange(`readOnlyOptions.${Boolean(asyncExchangeProperties.bulk)}`)
                : '-'
            }
          />
        </Stack>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer title={tAsyncExchange('title')} description={description} sx={{ mt: 3 }}>
      <Alert severity="warning" sx={{ mt: 2 }}>
        {tAsyncExchange('editableInfoAlert')}
      </Alert>

      <Box sx={{ mt: 2 }}>{editableCallbackInterfaceContent}</Box>

      <Typography variant="subtitle1" sx={{ mt: 3 }}>
        {tAsyncExchange('configSubsection.title')}
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {asyncExchangeNumericFields.map(({ name, translationKey, min, max, sx }) => (
          <Grid item xs={12} sm={6} key={name}>
            <RHFTextField
              size="small"
              name={name}
              label={tAsyncExchange(`${translationKey}.label`)}
              infoLabel={tAsyncExchange(`${translationKey}.infoLabel`)}
              type="number"
              inputProps={{ min, max }}
              required
              rules={{
                required: true,
                min,
                max,
                validate: (value) =>
                  Number.isInteger(Number(value)) || tAsyncExchange('validation.integer'),
              }}
              sx={sx}
            />
          </Grid>
        ))}
      </Grid>
      <Typography variant="subtitle1" sx={{ mt: 3 }}>
        {tAsyncExchange('advancedSubsection.title')}
      </Typography>
      {areAdvancedOptionsEditable ? (
        <Stack spacing={0} sx={{ mt: 1 }}>
          <RHFCheckbox
            name="asyncExchangeProperties.confirmation"
            label={
              <AdvancedOptionLabel
                label={tAsyncExchange('confirmationField.label')}
                infoLabel={tAsyncExchange('confirmationField.infoLabel')}
              />
            }
            sx={{ my: 0 }}
          />
          <RHFCheckbox
            name="asyncExchangeProperties.bulk"
            label={
              <AdvancedOptionLabel
                label={tAsyncExchange('bulkField.label')}
                infoLabel={tAsyncExchange('bulkField.infoLabel')}
              />
            }
            disabled={isSoap}
            sx={{ mb: 0 }}
          />
        </Stack>
      ) : (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <InformationContainer
            label={tAsyncExchange('confirmationField.label')}
            content={
              asyncExchangeProperties
                ? tAsyncExchange(`readOnlyOptions.${Boolean(asyncExchangeProperties.confirmation)}`)
                : '-'
            }
          />
          <InformationContainer
            label={tAsyncExchange('bulkField.label')}
            content={
              asyncExchangeProperties
                ? tAsyncExchange(`readOnlyOptions.${Boolean(asyncExchangeProperties.bulk)}`)
                : '-'
            }
          />
        </Stack>
      )}
    </SectionContainer>
  )
}
