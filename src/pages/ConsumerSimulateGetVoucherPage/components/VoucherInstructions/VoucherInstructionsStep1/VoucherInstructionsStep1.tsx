import React, { useState } from 'react'
import { SectionContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Paper,
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { useVoucherInstructionsContext } from '../VoucherInstructionsContext'
import { ClientQueries } from '@/api/client'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ApiIcon from '@mui/icons-material/Api'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { verifyVoucherGuideLink } from '@/config/constants'
import { VoucherInstructionsStep1CurrentIdsDrawer } from './VoucherInstructionsStep1CurrentIdsDrawer'
import { useDrawerState } from '@/hooks/useDrawerState'
import { StepActions } from '@/components/shared/StepActions'
import { useClientKind } from '@/hooks/useClientKind'
import { useQuery } from '@tanstack/react-query'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'

export const VoucherInstructionsStep1: React.FC = () => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()
  const {
    selectedPurposeId,
    handleSelectedPurposeIdChange,
    handleSelectedKeyIdChange,
    selectedKeyId,
    clientId,
    handleSelectedClientIdChange,
    goToNextStep,
  } = useVoucherInstructionsContext()

  const [clientSearch, setClientSearch] = useAutocompleteTextInput('')
  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const { data: clients, isFetching: isFetchingClients } = useQuery({
    ...ClientQueries.getList({
      kind: clientKind,
      q: clientSearch,
      offset: 0,
      limit: 50,
    }),
  })

  const { data: clientKeys, isFetching: isFetchingKeys } = useQuery({
    ...ClientQueries.getAllKeysList({ clientId }),
    enabled: Boolean(clientId),
  })

  const { data: client, isFetching: isFetchingClient } = useQuery({
    ...ClientQueries.getSingle(clientId),
    enabled: Boolean(clientId),
  })

  const purposeSelectLabelId = React.useId()
  const purposeSelectId = React.useId()
  const keySelectLabelId = React.useId()
  const keySelectId = React.useId()

  const purposes = client?.purposes

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    goToNextStep()
  }

  const canGoToNextStep =
    clientKind === 'CONSUMER' ? Boolean(selectedKeyId && selectedPurposeId) : Boolean(selectedKeyId)

  const options = React.useMemo(() => {
    const results = clients?.results ?? []
    return results.map((att) => ({
      label: att.name,
      value: att.id,
    }))
  }, [clients])

  return (
    <>
      <form onSubmit={handleSubmit}>
        <SectionContainer
          title={t(`step1.title.${clientKind}`)}
          description={t('step1.description')}
          bottomActions={[
            {
              startIcon: <OpenInNewIcon fontSize="small" />,
              label: t('step1.goToTechnicalDocsLabel'),
              href: verifyVoucherGuideLink,
              target: '_blank',
            },
            {
              startIcon: <ApiIcon fontSize="small" />,
              label: t('step1.showCurrentSelectionIds'),
              component: 'button',
              type: 'button',
              onClick: openDrawer,
            },
          ]}
        >
          <FormControl fullWidth>
            <Autocomplete
              options={options}
              PaperComponent={({ children }) => <Paper elevation={4}>{children}</Paper>}
              onInputChange={(_, value) => {
                setClientSearch(value)
              }}
              value={options.find((o) => o.value === clientId) ?? null}
              onChange={(_, value) => {
                handleSelectedClientIdChange(value?.value ?? '')
                handleSelectedPurposeIdChange('')
                handleSelectedKeyIdChange('')
              }}
              renderInput={(params) => (
                <TextField {...params} label={t('step1.clientSelectInput.label')} />
              )}
            />
          </FormControl>
          {clientKind === 'CONSUMER' ? (
            !clientId || purposes?.length || isFetchingClient ? (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id={purposeSelectLabelId}>
                  {t('step1.purposeSelectInput.label')}
                </InputLabel>
                <Select
                  labelId={purposeSelectLabelId}
                  id={purposeSelectId}
                  value={selectedPurposeId ?? ''}
                  label={t('step1.purposeSelectInput.label')}
                  disabled={!purposes || isFetchingClients || isFetchingClient}
                  onChange={(e) => handleSelectedPurposeIdChange(e.target.value)}
                >
                  {(purposes ?? []).map((purpose) => (
                    <MenuItem key={purpose.purposeId} value={purpose.purposeId}>
                      {purpose.title} per {purpose.eservice.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Alert sx={{ mt: 2 }} severity="info">
                {t('noPurposesLabel')}
              </Alert>
            )
          ) : null}
          {!clientId || clientKeys?.length || isFetchingClient || isFetchingKeys ? (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id={keySelectLabelId}>{t('step1.keySelectInput.label')}</InputLabel>
              <Select
                labelId={keySelectLabelId}
                id={keySelectId}
                value={selectedKeyId ?? ''}
                label={t('step1.keySelectInput.label')}
                disabled={!clientKeys || isFetchingClients || isFetchingKeys || isFetchingClient}
                onChange={(e) => handleSelectedKeyIdChange(e.target.value)}
              >
                {(clientKeys ?? []).map((key) => (
                  <MenuItem key={key.keyId} value={key.keyId}>
                    {key.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Alert sx={{ mt: 2 }} severity="info">
              {t('noKeysLabel')}
            </Alert>
          )}
        </SectionContainer>
        <StepActions
          forward={{
            label: t('proceedBtn'),
            type: 'submit',
            disabled: !canGoToNextStep,
            endIcon: <ArrowForwardIcon />,
          }}
        />
      </form>
      <VoucherInstructionsStep1CurrentIdsDrawer isOpen={isOpen} onClose={closeDrawer} />
    </>
  )
}
