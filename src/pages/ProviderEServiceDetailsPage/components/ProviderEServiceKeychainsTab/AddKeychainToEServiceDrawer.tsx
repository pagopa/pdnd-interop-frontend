import type { CompactProducerKeychain } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { KeychainQueries } from '@/api/keychain'
import { Drawer } from '@/components/shared/Drawer'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { keychainSetupGuideLink } from '@/config/constants'
import { Link } from '@/router'
import { Alert, Link as MuiLink, Stack } from '@mui/material'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'

type AddKeychainFormValues = {
  selectedKeychain: CompactProducerKeychain | undefined
}

type AddKeychainToEServiceDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  onSubmit: (selectedKeychain: CompactProducerKeychain) => void
  excludeKeychainsIdsList: Array<string>
}

export const AddKeychainToEServiceDrawer: React.FC<AddKeychainToEServiceDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  excludeKeychainsIdsList,
}) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.drawers.addKeychainToEServiceDrawer',
  })
  const { t: tCommon } = useTranslation('common')
  const { jwt } = AuthHooks.useJwt()
  const [keychainSearchParam, setKeychainSearchParam] = useAutocompleteTextInput()

  const handleCloseDrawer = () => {
    onClose()
  }

  const defaultValues: AddKeychainFormValues = {
    selectedKeychain: undefined,
  }

  const formMethods = useForm<AddKeychainFormValues>({
    defaultValues,
  })

  const selectedKeychain = formMethods.watch('selectedKeychain')

  /**
   * TEMP: This is a workaround to avoid the "q" param in the query to be equal to the selected attribute name.
   */
  function getKeychainQ() {
    let result = keychainSearchParam

    if (selectedKeychain && keychainSearchParam === selectedKeychain.name) {
      result = ''
    }

    return result
  }

  const { data: allKeychains = [], isPending } = useQuery({
    ...KeychainQueries.getKeychainsList({
      q: getKeychainQ(),
      limit: 50,
      offset: 0,
      producerId: jwt?.organizationId as string,
    }),
    select: (d) => d.results,
  })

  const availableKeychains = allKeychains.filter(
    (keychain) => !excludeKeychainsIdsList.includes(keychain.id)
  )

  const options = availableKeychains.map((k) => ({
    label: k.name,
    value: k,
  }))

  const _onSubmit = ({ selectedKeychain }: AddKeychainFormValues) => {
    onClose()
    if (!selectedKeychain) return
    onSubmit(selectedKeychain)
  }

  const handleTransitionExited = () => {
    formMethods.reset(defaultValues)

    setKeychainSearchParam('')
  }

  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        onClose={handleCloseDrawer}
        title={t('title')}
        subtitle={
          <Trans
            components={{
              1: <MuiLink underline="hover" href={keychainSetupGuideLink} target="_blank" />,
            }}
          >
            {t('subtitle')}
          </Trans>
        }
        buttonAction={{
          label: tCommon('addBtn'),
          action: formMethods.handleSubmit(_onSubmit),
          disabled: !selectedKeychain,
        }}
        onTransitionExited={handleTransitionExited}
      >
        <Stack spacing={3}>
          <RHFAutocompleteSingle
            focusOnMount
            label={t('keychainField.label')}
            labelType="external"
            size="small"
            name="selectedKeychain"
            onInputChange={(_, value) => setKeychainSearchParam(value)}
            options={options}
            rules={{ required: true }}
            loading={isPending}
            noOptionsText={t('keychainField.noOptionsText')}
          />

          {allKeychains.length === 0 && (
            <Alert severity="info">
              <Trans
                components={{
                  1: <Link underline="hover" to="PROVIDE_KEYCHAIN_CREATE" />,
                }}
              >
                {t('noKeychainAlert')}
              </Trans>
            </Alert>
          )}
        </Stack>
      </Drawer>
    </FormProvider>
  )
}
