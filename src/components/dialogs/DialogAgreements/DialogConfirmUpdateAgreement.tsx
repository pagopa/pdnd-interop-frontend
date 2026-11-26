import { AgreementMutations } from '@/api/agreement'
import { RHFCheckbox } from '@/components/shared/react-hook-form-inputs'
import { eserviceIntegrationGuideLink } from '@/config/constants'
import { useNavigate, Link as RouterLink } from '@/router'
import { useDialog } from '@/stores'
import type { DialogConfirmUpdateAgreementProps } from '@/types/dialog.types'
import { Stack, Typography, Link, useTheme } from '@mui/material'
import { MIDialog as Dialog } from '@pagopa/mui-italia'
import React from 'react'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'

type CheckboxesState = {
  attributesCheck: boolean
  apiIntegrationCheck: boolean
  testEnvCheck: boolean
}

export const DialogConfirmUpdateAgreement: React.FC<DialogConfirmUpdateAgreementProps> = ({
  agreement,
  descriptor,
}) => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('eservice', {
    keyPrefix: 'consumer.detail.dialogs.agreements.updateConfirm',
  })
  const ariaLabelId = React.useId()
  const { closeDialog } = useDialog()
  const form = useForm<CheckboxesState>({
    defaultValues: {
      attributesCheck: false,
      apiIntegrationCheck: false,
      testEnvCheck: false,
    },
  })
  const navigate = useNavigate()
  const theme = useTheme()

  const { mutate: upgradeAgreement } = AgreementMutations.useUpgrade()

  const onSubmit: SubmitHandler<CheckboxesState> = ({
    attributesCheck,
    apiIntegrationCheck,
    testEnvCheck,
  }) => {
    if (!attributesCheck || !apiIntegrationCheck || !testEnvCheck) return

    upgradeAgreement(
      { agreementId: agreement.id },
      {
        onSuccess(data) {
          /**
           * When the subscriber is missing one or more verified/declared attributes,
           * the new agreement is created as a DRAFT instead of being submitted to
           * the provider. When this happens, the subscriber should be presented with
           * the "draft edit" view of the agreement.
           */
          const agreementView =
            data.state === 'DRAFT' ? 'SUBSCRIBE_AGREEMENT_EDIT' : 'SUBSCRIBE_AGREEMENT_READ'

          navigate(agreementView, {
            params: {
              agreementId: data.id,
            },
          })
          closeDialog()
        },
      }
    )
  }

  return (
    <FormProvider {...form}>
      <Dialog
        id={ariaLabelId}
        onClose={closeDialog}
        onCloseButtonClick={closeDialog}
        closeButtonAriaLabel={tCommon('closeBtn')}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            p: 0,
          },
        }}
        title={t('title')}
        open
        primaryAction={{
          label: tCommon('actions.upgrade'),
          onClick: form.handleSubmit(onSubmit),
        }}
        secondaryAction={{
          label: tCommon('actions.cancel'),
          onClick: () => closeDialog(),
        }}
      >
        <Stack gap={3} sx={{ px: 3 }}>
          <Typography variant="body1">
            <Trans
              components={{
                1: (
                  <RouterLink
                    to="SUBSCRIBE_CATALOG_VIEW"
                    params={{
                      eserviceId: descriptor.eservice.id,
                      descriptorId: descriptor.eservice.activeDescriptor!.id,
                    }}
                    target="_blank"
                    sx={{
                      color: theme.colors.blue[500],
                    }}
                  />
                ),
              }}
            >
              {t('description', {
                eservice: descriptor.eservice.name,
                version: descriptor.eservice.activeDescriptor?.version,
                producer: descriptor.eservice.producer.name,
              })}
            </Trans>
          </Typography>
          <Stack>
            <Typography variant="body1">
              <strong>{t('paragraph.title')}</strong>
            </Typography>
            <Typography variant="body1">
              <Trans
                components={{
                  1: (
                    <Link
                      target="_blank"
                      href={eserviceIntegrationGuideLink}
                      sx={{
                        color: theme.colors.blue[500],
                      }}
                    />
                  ),
                }}
              >
                {t('paragraph.content')}
              </Trans>
            </Typography>
          </Stack>
          <Stack>
            <Typography>{t('checkboxes.title')}</Typography>
            <RHFCheckbox name="attributesCheck" label={t('checkboxes.items.check1')} />
            <RHFCheckbox name="apiIntegrationCheck" label={t('checkboxes.items.check2')} />
            <RHFCheckbox name="testEnvCheck" label={t('checkboxes.items.check3')} />
          </Stack>
        </Stack>
      </Dialog>
    </FormProvider>
  )
}
