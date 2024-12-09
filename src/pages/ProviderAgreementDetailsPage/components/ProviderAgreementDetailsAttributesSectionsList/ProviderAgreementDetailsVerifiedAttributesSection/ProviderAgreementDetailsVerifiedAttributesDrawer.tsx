import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useProviderAgreementDetailsContext } from '../../ProviderAgreementDetailsContext'
import { Drawer } from '@/components/shared/Drawer'
import { Link, Stack, Typography } from '@mui/material'
import { attributesHelpLink } from '@/config/constants'
import { AttributeMutations } from '@/api/attribute'
import { ProviderAgreementDetailsVerifiedAttributesDrawerForm } from './ProviderAgreementDetailsVerifiedAttributesDrawerForm'

export type ProviderAgreementDetailsVerifiedAttributesDrawerVerifingFormValues = {
  hasExpirationDate: 'YES' | 'NO' | undefined
  expirationDate: Date | undefined
}

type ProviderAgreementDetailsVerifiedAttributesDrawerProps = {
  providerAgreementVerifiedAttributesDrawerState: {
    isOpen: boolean
    attributeId: string
    type: 'revoke' | 'verify' | 'update'
  }
  onClose: VoidFunction
}

export const ProviderAgreementDetailsVerifiedAttributesDrawer: React.FC<
  ProviderAgreementDetailsVerifiedAttributesDrawerProps
> = ({ providerAgreementVerifiedAttributesDrawerState, onClose }) => {
  const { t } = useTranslation('agreement', {
    keyPrefix:
      'providerRead.sections.attributesSectionsList.verifiedSection.attributes.attributesDrawer.revoke',
  })

  const { agreement } = useProviderAgreementDetailsContext()

  const { isOpen, attributeId, type } = providerAgreementVerifiedAttributesDrawerState

  const partyAttributes = agreement.consumer.attributes
  const ownedVerifiedAttributes = partyAttributes.verified
  const attribute = ownedVerifiedAttributes.find((a) => a.id === attributeId)

  const verifier = attribute?.verifiedBy.find((b) => b.id === agreement?.producer.id)

  const [formState, setFormState] =
    React.useState<ProviderAgreementDetailsVerifiedAttributesDrawerVerifingFormValues>({
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

  const { title, subtitle, buttonAction } = useGetDrawerComponents(
    selectedExpirationDate,
    attributeId,
    type,
    onClose
  )

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
          <Typography variant="label">{t('info.title')}</Typography>
          <Typography variant="body2">
            <Trans
              components={{
                1: <Link href={attributesHelpLink} target="_blank" />,
              }}
            >
              {t('info.description')}
            </Trans>
          </Typography>
        </Stack>
      ) : (
        <ProviderAgreementDetailsVerifiedAttributesDrawerForm
          formState={formState}
          setFormState={setFormState}
          verifier={verifier}
        />
      )}
    </Drawer>
  )
}

function useGetDrawerComponents(
  selectedExpirationDate: string | undefined,
  attributeId: string,
  type: 'revoke' | 'verify' | 'update',
  closeProviderAgreementVerifiedAttributesDrawer: VoidFunction
) {
  const { t } = useTranslation('agreement', {
    keyPrefix: 'providerRead.sections.attributesSectionsList.verifiedSection.attributes',
  })

  const { mutate: verifyAttribute } = AttributeMutations.useVerifyPartyAttribute()
  const { mutate: revokeAttibute } = AttributeMutations.useRevokeVerifiedPartyAttribute()
  const { mutate: updateAttributeExpirationDate } =
    AttributeMutations.useUpdateVerifiedPartyAttribute()

  const { agreement } = useProviderAgreementDetailsContext()

  const handleRevoke = () => {
    if (!agreement) return

    revokeAttibute(
      {
        partyId: agreement.consumer.id,
        attributeId,
      },
      { onSuccess: closeProviderAgreementVerifiedAttributesDrawer }
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
      { onSuccess: closeProviderAgreementVerifiedAttributesDrawer }
    )
  }

  const handleVerify = () => {
    if (!agreement) return
    verifyAttribute(
      {
        partyId: agreement.consumer.id,
        id: attributeId,
        expirationDate: selectedExpirationDate,
        agreementId: agreement.id,
      },
      { onSuccess: closeProviderAgreementVerifiedAttributesDrawer }
    )
  }

  if (type === 'revoke') {
    return {
      title: t('attributesDrawer.revoke.title'),
      subtitle: t('attributesDrawer.revoke.subtitle'),
      buttonAction: {
        label: t('actions.revoke'),
        action: handleRevoke,
        variant: 'outlined',
        color: 'error',
      },
    } as const
  }

  return {
    title: t('attributesDrawer.verify.title'),
    subtitle: t('attributesDrawer.verify.subtitle'),
    buttonAction: {
      label: t('actions.verify'),
      action: type === 'update' ? handleUpdate : handleVerify,
      variant: 'contained',
      color: 'primary',
    },
  } as const
}
