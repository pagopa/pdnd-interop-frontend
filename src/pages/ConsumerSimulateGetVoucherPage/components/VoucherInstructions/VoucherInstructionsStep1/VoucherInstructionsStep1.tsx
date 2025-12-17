import React, { useEffect } from 'react'
import { SectionContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { Alert, Box, FormControl } from '@mui/material'
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
import { useForm, FormProvider, type SubmitHandler } from 'react-hook-form'
import { RHFAutocompleteSingle, RHFSelect } from '@/components/shared/react-hook-form-inputs'
import { useVoucherInstructionsContext } from '../VoucherInstructionsContext'
import { useSearchParams } from 'react-router-dom'

interface VoucherInstructionsStep1Form {
  clientId: string | null
  purposeId: string | null
  keyId: string | null
}

export const VoucherInstructionsStep1: React.FC = () => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()
  const { goToNextStep } = useVoucherInstructionsContext()
  const [searchParams, setSearchParams] = useSearchParams()

  const formMethods = useForm<VoucherInstructionsStep1Form>({
    defaultValues: {
      clientId: searchParams.get('clientId'),
      purposeId: searchParams.get('purposeId'),
      keyId: searchParams.get('keyId'),
    },
  })

  const { watch, handleSubmit, setValue } = formMethods

  const clientId = watch('clientId') || ''
  const purposeId = watch('purposeId') || ''
  const keyId = watch('keyId')

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

  const purposes = client?.purposes

  const canGoToNextStep = clientKind === 'CONSUMER' ? Boolean(keyId && purposeId) : Boolean(keyId)

  const options = React.useMemo(() => {
    const results = clients?.results ?? []
    return results.map((att) => ({
      label: att.name,
      value: att.id,
    }))
  }, [clients])

  const onSubmit: SubmitHandler<VoucherInstructionsStep1Form> = (values) => {
    if (clientKind === 'CONSUMER' && !Boolean(values.keyId && values.purposeId)) return

    if (clientKind === 'API' && !Boolean(values.keyId)) return

    setSearchParams((prev) => {
      if (values.clientId) prev.set('clientId', values.clientId)
      if (values.purposeId) prev.set('purposeId', values.purposeId)
      if (values.keyId) prev.set('keyId', values.keyId)
      return prev
    })
    goToNextStep()
  }

  /**
   * Subscribes to the form values changes
   * and updates the actual visible questions on values change.
   */
  useEffect(() => {
    const subscription = watch((_, { name }) => {
      if (name === 'clientId') {
        setValue('purposeId', null)
        setValue('keyId', null)
        setSearchParams({})
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, setValue, setSearchParams])

  return (
    <FormProvider {...formMethods}>
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
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
            <RHFAutocompleteSingle
              name="clientId"
              rules={{ required: true }}
              label={t('step1.clientSelectInput.label')}
              onInputChange={(_, value) => setClientSearch(value)}
              options={options}
              loading={isFetchingClients}
            />
          </FormControl>
          {clientKind === 'CONSUMER' ? (
            !clientId || purposes?.length || isFetchingClient ? (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <RHFSelect
                  name="purposeId"
                  label={t('step1.purposeSelectInput.label')}
                  options={(purposes ?? []).map((purpose) => ({
                    label: `${purpose.title} per ${purpose.eservice.name}`,
                    value: purpose.purposeId,
                  }))}
                  rules={{ required: true }}
                  disabled={!clientId || isFetchingClient}
                />
              </FormControl>
            ) : (
              <Alert sx={{ mt: 2 }} severity="info">
                {t('noPurposesLabel')}
              </Alert>
            )
          ) : null}
          {!Boolean(clientId) || clientKeys?.length || isFetchingClient || isFetchingKeys ? (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <RHFSelect
                name="keyId"
                label={t('step1.keySelectInput.label')}
                options={(clientKeys ?? []).map((key) => ({ label: key.name, value: key.keyId }))}
                rules={{ required: true }}
                disabled={!clientKeys || isFetchingClients || isFetchingKeys || isFetchingClient}
              />
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
      </Box>
      <VoucherInstructionsStep1CurrentIdsDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        clientId={clientId}
        purposeId={purposeId}
      />
    </FormProvider>
  )
}
