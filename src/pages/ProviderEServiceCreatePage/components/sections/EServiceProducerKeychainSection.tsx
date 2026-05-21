import type { CompactProducerKeychain } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { KeychainQueries } from '@/api/keychain'
import { SectionContainer } from '@/components/layout/containers'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import AddIcon from '@mui/icons-material/Add'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { Alert, Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'

export type ProducerKeychainFieldArrayItem = {
  value: CompactProducerKeychain | null
}

type FormValues = {
  keychains: ProducerKeychainFieldArrayItem[]
}

export const EServiceProducerKeychainSection: React.FC = () => {
  const { areEServiceGeneralInfoEditable } = useEServiceCreateContext()

  return areEServiceGeneralInfoEditable ? (
    <EditableProducerKeychainSection />
  ) : (
    <ReadOnlyProducerKeychainSection />
  )
}

const ReadOnlyProducerKeychainSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'create.step4.producerKeychainSection',
  })
  const { control } = useFormContext<FormValues>()
  const watchedKeychains = useWatch({ control, name: 'keychains' })

  const associatedKeychains = (watchedKeychains ?? [])
    .map((row) => row?.value)
    .filter((k): k is CompactProducerKeychain => Boolean(k?.id))

  return (
    <SectionContainer title={t('title')} description={t('subtitle')} sx={{ mt: 3 }}>
      <InformationContainer
        label={t('readOnlyLabel')}
        content={
          associatedKeychains.length > 0 ? (
            <Stack spacing={0.5}>
              {associatedKeychains.map((keychain) => (
                <Typography key={keychain.id} variant="body2">
                  {keychain.name}
                </Typography>
              ))}
            </Stack>
          ) : (
            '-'
          )
        }
      />
    </SectionContainer>
  )
}

const EditableProducerKeychainSection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'create.step4.producerKeychainSection',
  })
  const { isOperatorAPI } = AuthHooks.useJwt()

  const { control } = useFormContext<FormValues>()
  const { fields, append, remove } = useFieldArray<FormValues>({
    control,
    name: 'keychains',
  })
  const watchedKeychains = useWatch({ control, name: 'keychains' })

  const { data: allKeychains = [], isPending } = useQuery({
    ...KeychainQueries.getKeychainsList({ limit: 100, offset: 0 }),
    select: (d) => d.results,
    enabled: !isOperatorAPI,
  })

  const isEmptyList = !isPending && allKeychains.length === 0

  const selectedIds = (watchedKeychains ?? [])
    .map((row) => row?.value?.id)
    .filter((id): id is string => Boolean(id))
  const hasAvailableKeychains = allKeychains.some((k) => !selectedIds.includes(k.id))

  return (
    <SectionContainer title={t('title')} description={t('subtitle')} sx={{ mt: 3 }}>
      {isOperatorAPI && <Alert severity="warning">{t('apiRoleAlert')}</Alert>}

      {!isOperatorAPI && isEmptyList && <Alert severity="warning">{t('noKeychainAlert')}</Alert>}

      {!isOperatorAPI && !isEmptyList && (
        <Stack spacing={2}>
          {fields.map((field, index) => {
            const selectedElsewhere = (watchedKeychains ?? [])
              .map((row, i) => (i !== index ? row?.value?.id : undefined))
              .filter((id): id is string => Boolean(id))

            const options = allKeychains
              .filter((k) => !selectedElsewhere.includes(k.id))
              .map((k) => ({ label: k.name, value: k }))

            return (
              <Stack key={field.id} direction="row" alignItems="flex-start" spacing={1}>
                {index > 0 && (
                  <Tooltip title={t('removeRowTooltip')}>
                    <span>
                      <IconButton
                        aria-label={t('removeRowTooltip')}
                        onClick={() => remove(index)}
                        sx={{ p: 1 }}
                      >
                        <RemoveCircleOutlineIcon color="error" />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
                <Box sx={{ flex: 1 }}>
                  <RHFAutocompleteSingle<CompactProducerKeychain | null>
                    size="small"
                    name={`keychains.${index}.value`}
                    label={t('keychainField.label')}
                    options={options}
                    loading={isPending}
                  />
                </Box>
              </Stack>
            )
          })}

          <Box>
            <Button
              size="small"
              variant="naked"
              startIcon={<AddIcon fontSize="small" />}
              onClick={() => append({ value: null })}
              disabled={!hasAvailableKeychains}
            >
              {t('addKeychainBtn')}
            </Button>
          </Box>
        </Stack>
      )}
    </SectionContainer>
  )
}
