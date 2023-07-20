import { Drawer } from '@/components/shared/Drawer'
import { Link, Stack, Typography } from '@mui/material'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useAgreementDetailsContext } from '../../../AgreementDetailsContext'
import { AttributeMutations } from '@/api/attribute'
import AgreementVerifiedAttributesDrawerForm from './AgreementVerifiedAttributesDrawerForm'
import { attributesHelpLink } from '@/config/constants'

export type AgreementVerifiedAttributesDrawerVerifingFormValues = {
  hasExpirationDate: 'YES' | 'NO' | undefined
  expirationDate: Date | undefined
}

const AgreementVerifiedAttributesDrawer: React.FC = () => {
  const { t } = useTranslation('agreement', {
    keyPrefix: 'read.attributes.verified',
  })

  const {
    partyAttributes,
    agreement,
    closeAgreementVerifiedAttributeDrawer,
    agreementVerifiedAttributeDrawerState,
  } = useAgreementDetailsContext()

  const { isOpen, attributeId, type } = agreementVerifiedAttributeDrawerState

  const ownedVerifiedAttributes = partyAttributes?.verified ?? []
  const attribute = ownedVerifiedAttributes.find((a) => a.id === attributeId)

  const verifier = attribute?.verifiedBy.find((b) => b.id === agreement?.producer.id)

  const [formState, setFormState] =
    React.useState<AgreementVerifiedAttributesDrawerVerifingFormValues>({
      hasExpirationDate: undefined,
      expirationDate: undefined,
    })

  const handleCloseDrawer = () => {
    closeAgreementVerifiedAttributeDrawer()
    setFormState({
      hasExpirationDate: undefined,
      expirationDate: undefined,
    })
  }

  const selectedExpirationDate = React.useMemo(() => {
    function isValidDate(date: Date | undefined): date is Date {
      return date instanceof Date && !isNaN(date.getTime())
    }

    switch (formState.hasExpirationDate) {
      // the YES option in the radio group is selected (manually)
      case 'YES':
        // the expiration date is setted (manually) in the date picker
        if (isValidDate(formState.expirationDate)) {
          return formState.expirationDate.toISOString()
        }

        // the expiration date is not setted (manually) but the attribute has already an expiration date
        if (verifier?.expirationDate) return verifier.expirationDate

        // the expiration date is not setted (manually) and the attribute has not an expiration date yet
        return new Date().toISOString()

      // the NO option in the radio group is selected (manually)
      case 'NO':
        // no expiration date
        return undefined

      // no option in the radio group is selected (manually)
      default:
        // the radio is automatically setted to YES and the expiration date is setted (manually) in the date picker
        if (isValidDate(formState.expirationDate)) {
          return formState.expirationDate.toISOString()
        }

        // if the attribute has already an expiration date we return that else no expiration date is returned
        return verifier?.expirationDate
    }
  }, [formState, verifier])

  const { title, subtitle, buttonAction } = useGetDrawerComponents(selectedExpirationDate)

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
          <Typography variant="label">{t('drawer.revoke.info.title')}</Typography>
          <Typography variant="body2">
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

function useGetDrawerComponents(selectedExpirationDate: string | undefined) {
  const { t } = useTranslation('agreement', {
    keyPrefix: 'read.attributes.verified',
  })

  const { mutate: verifyAttribute } = AttributeMutations.useVerifyPartyAttribute()
  const { mutate: revokeAttibute } = AttributeMutations.useRevokeVerifiedPartyAttribute()
  const { mutate: updateAttributeExpirationDate } =
    AttributeMutations.useUpdateVerifiedPartyAttribute()

  const {
    agreement,
    agreementVerifiedAttributeDrawerState,
    closeAgreementVerifiedAttributeDrawer,
  } = useAgreementDetailsContext()
  const { attributeId, type } = agreementVerifiedAttributeDrawerState

  const handleRevoke = () => {
    if (!agreement) return

    revokeAttibute(
      {
        partyId: agreement.consumer.id,
        attributeId,
      },
      { onSuccess: closeAgreementVerifiedAttributeDrawer }
    )
  }

  const handleUpdate = () => {
    if (!agreement) return
    updateAttributeExpirationDate(
      {
        partyId: agreement.consumer.id,
        attributeId: attributeId,
        expirationDate: selectedExpirationDate,
      },
      { onSuccess: closeAgreementVerifiedAttributeDrawer }
    )
  }

  const handleVerify = () => {
    if (!agreement) return
    verifyAttribute(
      {
        partyId: agreement.consumer.id,
        id: attributeId,
        expirationDate: selectedExpirationDate,
      },
      { onSuccess: closeAgreementVerifiedAttributeDrawer }
    )
  }

  if (type === 'revoke') {
    return {
      title: t('drawer.revoke.title'),
      subtitle: t('drawer.revoke.subtitle'),
      buttonAction: {
        label: t('actions.revoke'),
        action: handleRevoke,
        variant: 'outlined',
        color: 'error',
      },
    } as const
  }

  return {
    title: t('drawer.verify.title'),
    subtitle: t('drawer.verify.subtitle'),
    buttonAction: {
      label: t('actions.verify'),
      action: type === 'update' ? handleUpdate : handleVerify,
      variant: 'contained',
      color: 'primary',
    },
  } as const
}

export default AgreementVerifiedAttributesDrawer
