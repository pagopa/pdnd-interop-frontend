import React, { useContext } from 'react'
import { Alert, Box, Stack, Typography } from '@mui/material'
import { ButtonNaked } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'
import {
  CertifiedTenantAttribute,
  ConsumerAttribute,
  DeclaredTenantAttribute,
  VerifiedTenantAttribute,
} from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import StyledSection from '../components/Shared/StyledSection'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useFeedback } from '../hooks/useFeedback'
import { useJwt } from '../hooks/useJwt'
import { remapTenantBackendAttributeToFrontend } from '../lib/attributes'
import { DialogContext } from '../lib/context'
import { NotFound } from './NotFound'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import { MAX_WIDTH } from '../lib/constants'
import { LoadingWithMessage } from '../components/Shared/LoadingWithMessage'

export function PartyRegistry() {
  const { runAction, forceRerenderCounter } = useFeedback()
  const { t } = useTranslation(['party', 'attribute'])
  const { jwt } = useJwt()

  const {
    data: ownedCertifiedAttributes,
    isLoading: isLoadingOwnedCertifiedAttributes,
    error: ownedCertifiedAttributesError,
  } = useAsyncFetch<{ attributes: Array<CertifiedTenantAttribute> }, Array<ConsumerAttribute>>(
    {
      path: {
        endpoint: 'ATTRIBUTE_GET_CERTIFIED_LIST',
        endpointParams: { institutionId: jwt?.organizationId },
      },
    },
    {
      disabled: !jwt?.organizationId,
      mapFn: (data) =>
        remapTenantBackendAttributeToFrontend(data.attributes, 'certified', jwt!.organizationId),
    }
  )

  const {
    data: ownedVerifiedAttributes,
    isLoading: isLoadingOwnedVerifiedAttributes,
    error: ownedVerifiedAttributesError,
  } = useAsyncFetch<{ attributes: Array<VerifiedTenantAttribute> }, Array<ConsumerAttribute>>(
    {
      path: {
        endpoint: 'ATTRIBUTE_GET_VERIFIED_LIST',
        endpointParams: { institutionId: jwt?.organizationId },
      },
    },
    {
      disabled: !jwt?.organizationId,
      mapFn: (data) =>
        remapTenantBackendAttributeToFrontend(data.attributes, 'verified', jwt!.organizationId),
    }
  )

  const {
    data: ownedDeclaredAttributes,
    isLoading: isLoadingOwnedDeclaredAttributes,
    error: ownedDeclaredAttributesError,
  } = useAsyncFetch<{ attributes: Array<DeclaredTenantAttribute> }, Array<ConsumerAttribute>>(
    {
      path: {
        endpoint: 'ATTRIBUTE_GET_DECLARED_LIST',
        endpointParams: { institutionId: jwt?.organizationId },
      },
    },
    {
      disabled: !jwt?.organizationId,
      mapFn: (data) =>
        remapTenantBackendAttributeToFrontend(data.attributes, 'declared', jwt!.organizationId),
      useEffectDeps: [forceRerenderCounter],
    }
  )

  async function handleConfirmDeclaredAttribute(attributeId: string) {
    await runAction(
      {
        path: { endpoint: 'ATTRIBUTE_CONFIRM_DECLARED' },
        config: { data: { id: attributeId } },
      },
      { showConfirmDialog: true }
    )
  }

  async function handleRevokeDeclaredAttribute(attributeId: string) {
    await runAction(
      {
        path: {
          endpoint: 'ATTRIBUTE_REVOKE_DECLARED',
          endpointParams: { attributeId },
        },
      },
      { showConfirmDialog: true }
    )
  }

  const { activeDeclaredAttributes, revokedDeclaredAttributes } = React.useMemo(() => {
    console.log(ownedDeclaredAttributes)
    return {
      activeDeclaredAttributes:
        ownedDeclaredAttributes?.filter(
          (declaredAttribute) => declaredAttribute.state === 'ACTIVE'
        ) ?? [],
      revokedDeclaredAttributes:
        ownedDeclaredAttributes?.filter(
          (declaredAttribute) => declaredAttribute.state === 'REVOKED'
        ) ?? [],
    }
  }, [ownedDeclaredAttributes])

  if (
    ownedCertifiedAttributesError ||
    ownedVerifiedAttributesError ||
    ownedDeclaredAttributesError
  ) {
    return <NotFound errorType="serverError" />
  }

  const isLoading =
    isLoadingOwnedCertifiedAttributes ||
    isLoadingOwnedDeclaredAttributes ||
    isLoadingOwnedVerifiedAttributes

  return (
    <Box sx={{ maxWidth: MAX_WIDTH }}>
      <StyledIntro isLoading={isLoading}>{{ title: jwt?.organization.name }}</StyledIntro>
      {!isLoading ? (
        <>
          <PartyAttributes
            title={t('certified.label', { ns: 'attribute' })}
            description={t('attributes.certified.description')}
            noAttributesLabel={t('attributes.certified.noAttributesLabel')}
            attributes={ownedCertifiedAttributes ?? []}
          />
          <PartyAttributes
            title={t('verified.label', { ns: 'attribute' })}
            description={t('attributes.verified.description')}
            noAttributesLabel={t('attributes.verified.noAttributesLabel')}
            attributes={ownedVerifiedAttributes ?? []}
          />
          <PartyAttributes
            title={t('declared.label', { ns: 'attribute' })}
            description={t('attributes.activeDeclared.description')}
            noAttributesLabel={t('attributes.activeDeclared.noAttributesLabel')}
            attributes={activeDeclaredAttributes}
            onRevokeDeclaredAttribute={handleRevokeDeclaredAttribute}
          />
          <PartyAttributes
            title={t('attributes.revokedDeclared.title')}
            description={t('attributes.revokedDeclared.description')}
            noAttributesLabel={t('attributes.revokedDeclared.noAttributesLabel')}
            attributes={revokedDeclaredAttributes}
            onConfirmDeclaredAttribute={handleConfirmDeclaredAttribute}
          />
        </>
      ) : (
        <Box sx={{ my: 8 }}>
          <LoadingWithMessage label={t('loadingPartyDataLabel')} transparentBackground />
        </Box>
      )}
    </Box>
  )
}

type PartyAttributesProps = {
  title: string
  description: string
  noAttributesLabel: string
  attributes: Array<{ id: string; name: string }>
  onConfirmDeclaredAttribute?: (attributeId: string) => void
  onRevokeDeclaredAttribute?: (attributeId: string) => void
}

function PartyAttributes({
  title,
  description,
  noAttributesLabel,
  attributes,
  onConfirmDeclaredAttribute,
  onRevokeDeclaredAttribute,
}: PartyAttributesProps) {
  const { setDialog } = useContext(DialogContext)

  const openAttributeDetailsDialog = (attribute: { id: string; name: string }) => {
    setDialog({
      type: 'showAttributeDetails',
      attributeId: attribute.id,
      name: attribute.name,
    })
  }

  function AttributeItem({
    attribute,
  }: {
    attribute: { id: string; name: string }
    shouldShowOrLabel: boolean
  }) {
    const { t } = useTranslation('party', { keyPrefix: 'attributes' })
    return (
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography sx={{ flex: 1 }} variant="body2">
          {attribute.name}
        </Typography>
        <Stack sx={{ flexShrink: 0, pr: 8 }} direction="row" spacing={2}>
          {onConfirmDeclaredAttribute && (
            <ButtonNaked
              onClick={onConfirmDeclaredAttribute.bind(null, attribute.id)}
              color="primary"
            >
              {t('revokedDeclared.declareActionLabel')}
            </ButtonNaked>
          )}

          {onRevokeDeclaredAttribute && (
            <ButtonNaked
              onClick={onRevokeDeclaredAttribute.bind(null, attribute.id)}
              color="primary"
            >
              {t('activeDeclared.revokeActionLabel')}
            </ButtonNaked>
          )}

          <ButtonNaked
            onClick={openAttributeDetailsDialog.bind(null, attribute)}
            aria-label={t('showInfoSrLabel')}
          >
            <InfoRoundedIcon fontSize="small" color="primary" />
          </ButtonNaked>
        </Stack>
      </Stack>
    )
  }

  return (
    <StyledSection sx={onConfirmDeclaredAttribute && { border: 1, borderColor: 'error.main' }}>
      <StyledSection.Title>{title}</StyledSection.Title>
      <StyledSection.Subtitle>{description}</StyledSection.Subtitle>
      <StyledSection.Content>
        <Box sx={{ listStyle: 'none', pl: 0, my: 0 }} component="ul">
          {attributes.map((attribute, i) => {
            const shouldShowOrLabel = attributes.length === 1 || i === attributes.length - 1
            return (
              <Stack component="li" spacing={2} key={attribute.id}>
                <AttributeItem attribute={attribute} shouldShowOrLabel={shouldShowOrLabel} />
              </Stack>
            )
          })}

          {attributes.length <= 0 && <Alert severity="info">{noAttributesLabel}</Alert>}
        </Box>
      </StyledSection.Content>
    </StyledSection>
  )
}
