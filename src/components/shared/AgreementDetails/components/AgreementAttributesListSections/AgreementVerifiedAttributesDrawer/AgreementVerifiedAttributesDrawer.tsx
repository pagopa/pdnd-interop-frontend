import { Drawer } from '@/components/shared/Drawer'
import type { ActionItem } from '@/types/common.types'
import { Link, Stack, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useAgreementDetailsContext } from '../../../AgreementDetailsContext'
import { AttributeMutations } from '@/api/attribute'
import AgreementVerifiedAttributesDrawerForm from './AgreementVerifiedAttributesDrawerForm'
import { attributesHelpLink } from '@/config/constants'

type AgreementVerifiedAttributesDrawerProps = {
  type: 'revoke' | 'verify' | 'update'
  isOpen: boolean
  attributeId: string
  onClose: VoidFunction
}

export type AgreementVerifiedAttributesDrawerVerifingFormValues = {
  hasExpirationDate: 'YES' | 'NO' | undefined
  expirationDate: Date | undefined
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

  const ownedVerifiedAttributes = partyAttributes?.verified ?? []
  const attribute = ownedVerifiedAttributes.find((a) => a.id === attributeId)

  const verifier = attribute?.verifiedBy.find((b) => b.id === agreement?.producer.id)

  const [formState, setFormState] =
    React.useState<AgreementVerifiedAttributesDrawerVerifingFormValues>({
      hasExpirationDate: undefined,
      expirationDate: undefined,
    })

  const handleCloseDrawer = () => {
    onClose()
    setFormState({
      hasExpirationDate: undefined,
      expirationDate: undefined,
    })
  }

  const handleRevoke = () => {
    if (!agreement) return

    revokeAttibute({
      partyId: agreement.consumer.id,
      attributeId,
    })
  }

  const selectExpirationDateToSubmit = useCallback(() => {
    switch (formState.hasExpirationDate) {
      case 'YES':
        if (formState.expirationDate) {
          return formState.expirationDate.toISOString()
        }
        if (verifier?.expirationDate) return verifier.expirationDate
        return new Date().toISOString()
      case 'NO':
        return undefined
      default:
        if (formState.expirationDate) {
          return formState.expirationDate.toISOString()
        }
        return verifier?.expirationDate
    }
  }, [formState.expirationDate, formState.hasExpirationDate, verifier?.expirationDate])

  const onSubmit = useCallback(() => {
    if (!agreement) return

    const expirationDate = selectExpirationDateToSubmit()

    if (type === 'update') {
      updateAttributeExpirationDate({
        partyId: agreement.consumer.id,
        attributeId: attributeId,
        expirationDate: expirationDate,
      })
    }
    if (type === 'verify') {
      verifyAttribute({
        partyId: agreement.consumer.id,
        id: attributeId,
        expirationDate: expirationDate,
      })
    }
  }, [
    agreement,
    attributeId,
    selectExpirationDateToSubmit,
    type,
    updateAttributeExpirationDate,
    verifyAttribute,
  ])

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
      action: onSubmit,
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
                1: <Link href={attributesHelpLink} target="_blank" />,
              }}
            >
              {t('drawer.revoke.info.description')}
            </Trans>
          </Typography>
        </Stack>
      ) : (
        <AgreementVerifiedAttributesDrawerForm
          formState={formState}
          setFormState={setFormState}
          verifier={verifier}
        />
      )}
    </Drawer>
  )
}

export default AgreementVerifiedAttributesDrawer
