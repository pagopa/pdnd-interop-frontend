import type { CompactUser } from '@/api/api.generatedTypes'
import { ClientMutations, ClientQueries } from '@/api/client'
import { Drawer } from '@/components/shared/Drawer'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { Box } from '@mui/material'
import { useAutocompleteTextInput } from '@pagopa/interop-fe-commons'
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

  const { mutate: setClientAdmin } = ClientMutations.useSetClientAdmin()

  const selectedAdminRef = React.useRef<CompactUser | undefined>(admin)

  const formMethods = useForm<SetClientAdminFormValues>({
    defaultValues: {
      selectedAdminId: admin?.userId,
    },
  })

  const [adminAutocompleteTextInput, setAdminAutocompleteTextInput] = useAutocompleteTextInput(
    admin ? `${admin?.name} ${admin?.familyName}` : ''
  )

  /**
   * TEMP: This is a workaround to avoid the "q" param in the query to be equal to the selected attribute name.
   */
  function getQ() {
    let result = adminAutocompleteTextInput

    if (
      selectedAdminRef.current &&
      adminAutocompleteTextInput ===
        `${selectedAdminRef.current.name} ${selectedAdminRef.current.familyName}`
    ) {
      result = ''
    }

    return result
  }

  const { data: users = [], isLoading } = useQuery({
    ...ClientQueries.getOperatorsList({
      clientId: clientId,
      name: getQ(),
    }),
    enabled: Boolean(clientId),
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
            onInputChange={(_, value) => setAdminAutocompleteTextInput(value)}
            onValueChange={(value) =>
              (selectedAdminRef.current = users.find((user) => user.userId === value?.value))
            }
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
