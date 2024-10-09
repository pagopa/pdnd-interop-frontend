import type { CompactProducerKeychain } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { KeychainQueries } from '@/api/keychain'
import { Drawer } from '@/components/shared/Drawer'
import { RHFAutocompleteMultiple } from '@/components/shared/react-hook-form-inputs'
import { Link } from '@/router'
import { Alert, Link as MuiLink, Stack } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'

type AddKeychainsFormValues = {
  selectedKeychains: CompactProducerKeychain[]
}

type AddKeychainToEServiceDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  onSubmit: (keychains: CompactProducerKeychain[]) => void
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

  const handleCloseDrawer = () => {
    onClose()
  }

  const formMethods = useForm<AddKeychainsFormValues>({
    defaultValues: { selectedKeychains: [] },
  })

  const selectedKeychains = formMethods.watch('selectedKeychains')

  const { data: allKeychains = [], isPending } = useQuery({
    ...KeychainQueries.getKeychainsList({
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

  const _onSubmit = ({ selectedKeychains }: AddKeychainsFormValues) => {
    onClose()
    onSubmit(selectedKeychains)
  }

  const handleTransitionExited = () => {
    formMethods.reset()
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
              1: <MuiLink underline="hover" href={'TODO right link'} target="_blank" />,
            }}
          >
            {t('subtitle')}
          </Trans>
        }
        buttonAction={{
          label: tCommon('addBtn'),
          action: formMethods.handleSubmit(_onSubmit),
          disabled: selectedKeychains.length === 0,
        }}
        onTransitionExited={handleTransitionExited}
      >
        <Stack spacing={3}>
          <RHFAutocompleteMultiple
            focusOnMount
            label={t('keychainField.label')}
            labelType="external"
            size="small"
            name="selectedKeychains"
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
