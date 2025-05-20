import type { CompactUser } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { ClientMutations } from '@/api/client'
import { TenantQueries } from '@/api/tenant'
import { Drawer } from '@/components/shared/Drawer'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type SetClientAdminFormValues = {
  selectedAdminId: string
}

type SetClientAdminDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  clientId: string
  admin?: CompactUser
}

export const SetClientAdminDrawer: React.FC<SetClientAdminDrawerProps> = ({
  isOpen,
  onClose,
  clientId,
  admin,
}) => {
  const { t } = useTranslation('client', { keyPrefix: 'edit.setClientAdminDrawer' })
  const { t: tCommon } = useTranslation('common')
  const { jwt } = AuthHooks.useJwt()

  const { mutate: setClientAdmin } = ClientMutations.useSetClientAdmin()

  const formMethods = useForm<SetClientAdminFormValues>({
    defaultValues: {
      selectedAdminId: admin?.userId,
    },
  })

  const { data: users = [], isLoading } = useQuery({
    ...TenantQueries.getPartyUsersList({
      tenantId: jwt?.organizationId as string,
      roles: ['admin'],
    }),
    select: (results) => results ?? [],
  })

  const handleCloseDrawer = () => {
    onClose()
  }

  const autocompleteOptions = users.map((user) => ({
    label: `${user.name} ${user.familyName}`,
    value: user.userId,
  }))

  const onSubmit = (values: SetClientAdminFormValues) => {
    setClientAdmin(
      { clientId: clientId, payload: { adminId: values.selectedAdminId } },
      { onSuccess: handleCloseDrawer }
    )
  }

  const handleTransitionExited = () => {
    formMethods.reset()
  }

  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        onClose={handleCloseDrawer}
        onTransitionExited={handleTransitionExited}
        title={admin ? t('title.substitute') : t('title.select')}
        subtitle={t('subtitle')}
        buttonAction={{
          label: admin ? tCommon('actions.substituteAdmin') : tCommon('actions.selectAdmin'),
          action: formMethods.handleSubmit(onSubmit),
        }}
      >
        <Box sx={{ mt: 3 }} component="form" noValidate>
          <RHFAutocompleteSingle
            focusOnMount
            label={t('adminField.label')}
            infoLabel={t('adminField.infoLabel')}
            sx={{ my: 0 }}
            size="small"
            name="selectedAdminId"
            rules={{ required: true }}
            options={autocompleteOptions}
            loading={isLoading}
          />
        </Box>
      </Drawer>
    </FormProvider>
  )
}
