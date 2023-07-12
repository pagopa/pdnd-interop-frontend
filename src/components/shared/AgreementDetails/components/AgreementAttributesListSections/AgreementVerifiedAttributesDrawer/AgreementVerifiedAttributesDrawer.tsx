import { Drawer } from '@/components/shared/Drawer'
import { Link } from '@/router'
import type { ActionItem } from '@/types/common.types'
import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { useAgreementDetailsContext } from '../../../AgreementDetailsContext'
import { AttributeMutations } from '@/api/attribute'
import { AgreementVerifiedAttributesDrawerDatePicker } from './AgreementVerifiedAttributesDrawerDatePicker'
import { AgreementVerifiedAttributesDrawerRadioGroup } from './AgreementVerifiedAttributesDrawerRadioGroup'

type AgreementVerifiedAttributesDrawerProps = {
  type: 'revoke' | 'verify' | 'update'
  isOpen: boolean
  attributeId: string
  onClose: VoidFunction
}

export type AgreementVerifiedAttributesDrawerVerifingFormValues = {
  hasExpirationDate: 'YES' | 'NO'
  expirationDate: Date | undefined
}

const AgreementVerifiedAttributesVerifyDrawer: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attributes.verified.drawer.verify' })
  const { watch } = useFormContext<AgreementVerifiedAttributesDrawerVerifingFormValues>()

  const hasExpiration = watch('hasExpirationDate')

  return (
    <Stack spacing={3} mt={0}>
      <AgreementVerifiedAttributesDrawerRadioGroup
        name="hasExpirationDate"
        label={t('form.radioGroup.label')}
        options={[
          { label: t('form.radioGroup.options.NO'), value: 'NO' },
          { label: t('form.radioGroup.options.YES'), value: 'YES' },
        ]}
        sx={{ my: 0 }}
      />

      {hasExpiration === 'YES' && (
        <Box>
          <AgreementVerifiedAttributesDrawerDatePicker
            sx={{ my: 0 }}
            name="expirationDate"
            label={t('form.datePicker.label')}
          />
          <Box mt={3}>
            <Typography variant="body2" fontWeight={600}>
              {t('info.title')}
            </Typography>
            <Typography variant="body2" fontWeight={400}>
              <Trans
                components={{
                  1: <Link to="DEFAULT" />,
                }}
              >
                {t('info.description')}
              </Trans>
            </Typography>
          </Box>
        </Box>
      )}
    </Stack>
  )
}

const AgreementVerifiedAttributesDrawer: React.FC<AgreementVerifiedAttributesDrawerProps> = ({
  type,
  isOpen,
  attributeId,
  onClose,
}) => {
  const { t } = useTranslation('agreement', {
    keyPrefix: 'read.attributes.verified',
  })

  const { partyAttributes, agreement } = useAgreementDetailsContext()

  const { mutate: verifyAttribute } = AttributeMutations.useVerifyPartyAttribute()
  const { mutate: revokeAttibute } = AttributeMutations.useRevokeVerifiedPartyAttribute()
  const { mutate: updateAttributeExpirationDate } =
    AttributeMutations.useUpdateVerifiedPartyAttribute()

  let defaultValues: AgreementVerifiedAttributesDrawerVerifingFormValues = {
    hasExpirationDate: 'NO',
    expirationDate: undefined,
  }

  const ownedVerifiedAttributes = partyAttributes?.verified ?? []
  const attribute = ownedVerifiedAttributes.find((a) => a.id === attributeId)

  const verifier = attribute?.verifiedBy.find((b) => b.id === agreement?.producer.id)
  if (verifier && verifier.expirationDate) {
    defaultValues = {
      hasExpirationDate: 'YES',
      expirationDate: new Date(verifier.expirationDate),
    }
  }

  const formMethods = useForm<AgreementVerifiedAttributesDrawerVerifingFormValues>({
    defaultValues,
  })

  const handleCloseDrawer = () => {
    onClose()
  }

  const handleRevoke = () => {
    if (!agreement) return

    revokeAttibute({
      partyId: agreement.consumer.id,
      attributeId,
    })
  }

  const onSubmit = ({
    hasExpirationDate,
    expirationDate,
  }: AgreementVerifiedAttributesDrawerVerifingFormValues) => {
    if (!agreement) return

    if (type === 'update') {
      updateAttributeExpirationDate({
        partyId: agreement.consumer.id,
        attributeId: attributeId,
        expirationDate: hasExpirationDate === 'YES' ? expirationDate?.toISOString() : undefined,
      })
    }
    if (type === 'verify') {
      verifyAttribute({
        partyId: agreement.consumer.id,
        id: attributeId,
        expirationDate: hasExpirationDate === 'YES' ? expirationDate?.toISOString() : undefined,
      })
    }
  }

  let title = ''
  let subtitle = undefined
  let buttonAction:
    | (ActionItem & {
        variant?: 'contained' | 'outlined'
        color?: 'primary' | 'error'
      })
    | undefined = undefined

  if (type === 'revoke') {
    title = t('drawer.revoke.title')
    subtitle = t('drawer.revoke.subtitle')
    buttonAction = {
      label: t('actions.revoke'),
      action: handleRevoke,
      variant: 'outlined',
      color: 'error',
    }
  }

  if (type === 'verify' || type === 'update') {
    title = t('drawer.verify.title')
    subtitle = t('drawer.verify.subtitle')
    buttonAction = {
      label: t('actions.verify'),
      action: formMethods.handleSubmit(onSubmit),
      variant: 'contained',
      color: 'primary',
    }
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleCloseDrawer}
      title={title}
      subtitle={subtitle}
      buttonAction={buttonAction}
    >
      {type === 'revoke' ? (
        <Stack>
          <Typography variant="body2" fontWeight={600}>
            {t('drawer.revoke.info.title')}
          </Typography>
          <Typography variant="body2" fontWeight={400}>
            <Trans
              components={{
                1: <Link to="DEFAULT" />,
              }}
            >
              {t('drawer.revoke.info.description')}
            </Trans>
          </Typography>
        </Stack>
      ) : (
        <FormProvider {...formMethods}>
          <Box component="form" noValidate>
            <AgreementVerifiedAttributesVerifyDrawer />
          </Box>
        </FormProvider>
      )}
    </Drawer>
  )
}

export default AgreementVerifiedAttributesDrawer
