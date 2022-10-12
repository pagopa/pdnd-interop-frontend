import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import {
  AgreementState,
  AgreementSummary,
  ActionProps,
  ProviderOrSubscriber,
  EServiceReadType,
  CertifiedAttribute,
  VerifiedAttribute,
  DeclaredAttribute,
  AttributeKey,
  BackendAttribute,
  DeclaredTenantAttribute,
  CertifiedTenantAttribute,
  VerifiedTenantAttribute,
} from '../../types'
import { buildDynamicPath, getLastBit } from '../lib/router-utils'
import { getLatestActiveVersion, mergeActions } from '../lib/eservice-utils'
import { useMode } from '../hooks/useMode'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { getAgreementState } from '../lib/status-utils'
import { RunActionOutput, useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledLink } from '../components/Shared/StyledLink'
import { Alert, Box, Chip, Divider, Grid, Stack, Tooltip, Typography } from '@mui/material'
import {
  Launch as LaunchIcon,
  Link as LinkIcon,
  AttachFile as AttachFileIcon,
  InfoRounded as InfoRoundedIcon,
  Check as CheckIcon,
} from '@mui/icons-material'
import { useRoute } from '../hooks/useRoute'
import { NotFound } from './NotFound'
import { LoadingWithMessage } from '../components/Shared/LoadingWithMessage'
import { Trans, useTranslation } from 'react-i18next'
import { attributesHelpLink, CHIP_COLORS_AGREEMENT, MAX_WIDTH } from '../lib/constants'
import { AccordionEntry, StyledAccordion } from '../components/Shared/StyledAccordion'
import StyledSection from '../components/Shared/StyledSection'
import { InformationRow } from '../components/InformationRow'
import DownloadableDocumentListSection from '../components/Shared/DownloadableDocumentListSection'
import { DialogContext } from '../lib/context'
import { ButtonNaked } from '@pagopa/mui-italia'
import { PageBottomActions } from '../components/Shared/PageBottomActions'
import { downloadFile } from '../lib/file-utils'
import { AxiosResponse } from 'axios'
import { AttributeSection } from '../components/AttributeSection'
import {
  remapBackendAttributesToFrontend,
  remapTenantBackendAttributesToFrontend,
} from '../lib/attributes'
import { useJwt } from '../hooks/useJwt'
import { ActionMenu } from '../components/Shared/ActionMenu'

export function AgreementRead() {
  const { t } = useTranslation(['agreement', 'common'])
  const { runAction, forceRerenderCounter } = useFeedback()
  const mode = useMode()
  const { jwt } = useJwt()
  const agreementId = getLastBit(useLocation())
  const { routes } = useRoute()

  const {
    data: agreement,
    error: agreementError,
    isLoading: isLoadingAgreement,
  } = useAsyncFetch<AgreementSummary>(
    { path: { endpoint: 'AGREEMENT_GET_SINGLE', endpointParams: { agreementId } } },
    { useEffectDeps: [forceRerenderCounter, mode] }
  )

  const {
    data: eservice,
    error: eserviceError,
    isLoading: isLoadingEService,
  } = useAsyncFetch<EServiceReadType>(
    {
      path: {
        endpoint: 'ESERVICE_GET_SINGLE',
        endpointParams: { eserviceId: agreement?.eservice.id },
      },
    },
    { useEffectDeps: [agreement], disabled: !agreement }
  )

  const error = agreementError || eserviceError
  const isLoading = isLoadingAgreement || isLoadingEService

  /*
   * List of possible actions for the user to perform
   */
  const activate = async () => {
    await runAction(
      { path: { endpoint: 'AGREEMENT_ACTIVATE', endpointParams: { agreementId } } },
      { showConfirmDialog: true }
    )
  }

  const suspend = async () => {
    await runAction(
      { path: { endpoint: 'AGREEMENT_SUSPEND', endpointParams: { agreementId } } },
      { showConfirmDialog: true }
    )
  }

  const upgrade = async () => {
    await runAction(
      { path: { endpoint: 'AGREEMENT_UPGRADE', endpointParams: { agreementId } } },
      { onSuccessDestination: routes.SUBSCRIBE_AGREEMENT_LIST, showConfirmDialog: true }
    )
  }

  /*
   * End list of actions
   */

  type AgreementActions = Record<AgreementState, Array<ActionProps>>
  // Build list of available actions for each agreement in its current state
  const getAvailableActions = () => {
    if (!agreement) {
      return []
    }

    const sharedActions: AgreementActions = {
      ACTIVE: [{ onClick: suspend, label: t('actions.suspend', { ns: 'common' }) }],
      SUSPENDED: [{ onClick: activate, label: t('actions.activate', { ns: 'common' }) }],
      PENDING: [],
      ARCHIVED: [],
      DRAFT: [],
    }

    // ADD Refuse action when on pending
    const providerOnlyActions: AgreementActions = {
      ACTIVE: [],
      SUSPENDED: [], // [{ onClick: archive, label: 'Archivia' }],
      PENDING: [{ onClick: activate, label: t('actions.activate', { ns: 'common' }) }],
      ARCHIVED: [],
      DRAFT: [],
    }

    const subscriberOnlyActionsActive: Array<ActionProps> = []
    if (canUpgrade()) {
      subscriberOnlyActionsActive.push({
        onClick: upgrade,
        label: t('actions.upgrade', { ns: 'common' }),
      })
    }

    const subscriberOnlyActions: AgreementActions = {
      ACTIVE: subscriberOnlyActionsActive,
      SUSPENDED: [],
      PENDING: [],
      ARCHIVED: [],
      DRAFT: [],
    }

    const currentMode = mode as ProviderOrSubscriber
    const currentActions = { provider: providerOnlyActions, subscriber: subscriberOnlyActions }[
      currentMode
    ]

    const status = agreement ? getAgreementState(agreement, mode) : 'SUSPENDED'

    return mergeActions<AgreementActions>([currentActions, sharedActions], status)
  }

  const canUpgrade = () => {
    if (!agreement || mode !== 'subscriber') return false

    return (
      agreement.eservice.activeDescriptor &&
      agreement.eservice.activeDescriptor.state === 'PUBLISHED' &&
      agreement.eservice.activeDescriptor.version > agreement.eservice.version &&
      agreement.state !== 'ARCHIVED'
    )
  }

  if (error) {
    return <NotFound errorType="serverError" />
  }

  const eserviceAttributes = eservice && remapBackendAttributesToFrontend(eservice.attributes)
  const consumerAttributes =
    agreement && remapTenantBackendAttributesToFrontend(agreement.consumer.attributes)

  function handleVerifyAttribute(attributeId: string) {
    const dataToPost = {
      id: attributeId,
      renewal: 'AUTOMATIC_RENEWAL',
    }
    runAction({
      path: {
        endpoint: 'AGREEMENT_VERIFY_ATTRIBUTE',
        endpointParams: { institutionId: jwt?.organization.id },
      },
      config: {
        data: dataToPost,
      },
    })
  }

  function handleRevokeAttribute(attributeId: string) {
    runAction({
      path: {
        endpoint: 'AGREEMENT_REVOKE_VERIFIED_ATTRIBUTE',
        endpointParams: { institutionId: jwt?.organization.id, attributeId },
      },
    })
  }

  function handleRefuseAttribute(attributeId: string) {
    // runAction()
  }

  const availableActions = getAvailableActions()
  let primaryAction: ActionProps | undefined

  if (availableActions.length > 0) {
    primaryAction = availableActions.shift()
  }

  return (
    <Box sx={{ maxWidth: MAX_WIDTH }}>
      <Stack direction="row" spacing={2}>
        <StyledIntro sx={{ flex: 1 }} isLoading={isLoading}>
          {{ title: t('read.title') }}
        </StyledIntro>
        <Stack direction="row" alignItems="center" spacing={2}>
          {primaryAction && (
            <StyledButton variant="outlined" onClick={primaryAction.onClick}>
              {primaryAction.label}
            </StyledButton>
          )}
          {availableActions.length > 0 && <ActionMenu actions={availableActions} />}
        </Stack>
      </Stack>

      {agreement && eservice && !isLoading ? (
        <>
          {canUpgrade() && <UpgradeGuideSection eservice={eservice} agreementId={agreementId} />}
          <Grid spacing={2} container>
            <Grid item xs={7}>
              <GeneralInfoSection eservice={eservice} agreement={agreement} />
            </Grid>
            <Grid item xs={5}>
              <DownloadableDocumentListSection
                docs={[]}
                eserviceId={eservice.id}
                descriptorId={agreement.descriptorId}
              />
            </Grid>
          </Grid>
          {agreement.consumerNotes && <ConsumerMessageSection message={agreement.consumerNotes} />}

          {mode === 'subscriber' && agreement.state === 'PENDING' && (
            <>
              <AttributeSection
                attributeKey="certified"
                attributesSubtitle=""
                description={t('read.attributes.certified.subtitle')}
                attributes={eserviceAttributes?.certified || []}
                ownedAttributesIds={consumerAttributes?.certified.map((a) => a.id)}
                readOnly
              />
              <AttributeSection
                attributeKey="verified"
                attributesSubtitle=""
                description={t('read.attributes.verified.subtitle')}
                attributes={eserviceAttributes?.verified || []}
                ownedAttributesIds={consumerAttributes?.verified.map((a) => a.id)}
                readOnly
              />
              <AttributeSection
                attributeKey="declared"
                attributesSubtitle=""
                description={t('read.attributes.declared.subtitle')}
                attributes={eserviceAttributes?.declared || []}
                ownedAttributesIds={consumerAttributes?.declared.map((a) => a.id)}
                readOnly
              />
            </>
          )}

          {mode === 'subscriber' && agreement.state !== 'PENDING' && (
            <>
              <AgreementAttributeSection
                attributeKey="certified"
                attributes={agreement.certifiedAttributes}
              />
              <AgreementAttributeSection
                attributeKey="verified"
                attributes={agreement.verifiedAttributes}
              />
              <AgreementAttributeSection
                attributeKey="declared"
                attributes={agreement.declaredAttributes}
              />
            </>
          )}

          {mode === 'provider' && agreement.state === 'PENDING' && (
            <>
              <AttributeSection
                attributeKey="verified"
                attributesSubtitle=""
                description={t('read.attributes.verified.subtitle')}
                attributes={eserviceAttributes?.verified || []}
                ownedAttributesIds={consumerAttributes?.verified.map((a) => a.id)}
                readOnly
                handleVerifyAttribute={handleVerifyAttribute}
                handleRefuseAttribute={handleRefuseAttribute}
                handleRevokeAttribute={handleRevokeAttribute}
                shouldProviderVerify
              />
            </>
          )}
        </>
      ) : (
        <LoadingWithMessage label={t('loadingSingleLabel')} transparentBackground />
      )}
      <PageBottomActions>
        <StyledButton
          variant="outlined"
          to={
            mode === 'provider'
              ? routes.PROVIDE_AGREEMENT_LIST.PATH
              : routes.SUBSCRIBE_AGREEMENT_LIST.PATH
          }
        >
          {t('backToRequestsBtn')}
        </StyledButton>
      </PageBottomActions>
    </Box>
  )
}

type UpgradeGuideSectionProps = {
  eservice: EServiceReadType
  agreementId: string
}

function UpgradeGuideSection({ eservice, agreementId }: UpgradeGuideSectionProps) {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.updateGuide' })
  const { runAction } = useFeedback()
  const { routes } = useRoute()

  const accordionEntries: Array<AccordionEntry> = t('faq', { returnObjects: true })
  const latestVersion = getLatestActiveVersion(eservice)?.version

  const handleUpgrade = async () => {
    await runAction(
      { path: { endpoint: 'AGREEMENT_UPGRADE', endpointParams: { agreementId } } },
      { onSuccessDestination: routes.SUBSCRIBE_AGREEMENT_LIST, showConfirmDialog: true }
    )
  }

  return (
    <>
      <Alert severity="warning">
        <Trans
          t={t}
          tOptions={{ eserviceName: eservice.name }}
          i18nKey={'updateGuide'}
          components={{ 1: <Box component="span" fontWeight={700} /> }}
        />
      </Alert>
      <StyledSection>
        <StyledSection.Title>{t('title')}</StyledSection.Title>
        <StyledSection.Subtitle>
          <Trans
            t={t}
            tOptions={{ eserviceName: eservice.name }}
            i18nKey={'description'}
            components={{ 1: <Box component="span" fontWeight={700} /> }}
          />
        </StyledSection.Subtitle>
        <StyledSection.Content>
          <Stack spacing={2}>
            <InformationRow label="FAQ">
              <StyledAccordion entries={accordionEntries} />
            </InformationRow>
            <InformationRow label="Link utili">
              <Stack>
                <StyledLink
                  component="a"
                  href="teste"
                  target="_blank"
                  variant="body2"
                  underline="hover"
                  sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  <LaunchIcon sx={{ mr: 1 }} /> {t('upgradeGuideLinkLabel')}
                </StyledLink>
                <StyledLink
                  variant="body2"
                  underline="hover"
                  sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  <LinkIcon sx={{ mr: 1 }} />{' '}
                  <span>
                    <Trans
                      t={t}
                      tOptions={{
                        eserviceName: eservice.name,
                        version: latestVersion,
                      }}
                      i18nKey={'eserviceLinkLabel'}
                      components={{ 1: <Box component="span" fontWeight={700} /> }}
                    />
                  </span>
                </StyledLink>
              </Stack>
            </InformationRow>
            <Divider />
            <Stack direction="row" justifyContent="center">
              <StyledButton onClick={handleUpgrade} variant="outlined">
                {t('upgradeBtn')}
              </StyledButton>
            </Stack>
          </Stack>
        </StyledSection.Content>
      </StyledSection>
    </>
  )
}

type GeneralInfoSectionProps = {
  agreement: AgreementSummary
  eservice: EServiceReadType
}

function GeneralInfoSection({ agreement }: GeneralInfoSectionProps) {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.generalInformations' })
  const { t: tCommon } = useTranslation('common')
  const { routes } = useRoute()
  const mode = useMode()
  const { runAction } = useFeedback()

  function buildEServiceLink() {
    return buildDynamicPath(routes.SUBSCRIBE_CATALOG_VIEW.PATH, {
      eserviceId: agreement.eservice.id,
      descriptorId: agreement.descriptorId,
    })
  }

  function getStatusChips() {
    if (agreement.state !== 'SUSPENDED') {
      return (
        <Chip
          label={tCommon(`status.agreement.${agreement.state}`, { ns: 'common' })}
          color={CHIP_COLORS_AGREEMENT[agreement.state]}
        />
      )
    }

    const isProviderSuspended = getAgreementState(agreement, 'provider') === 'SUSPENDED'
    const isSubscriberSuspended = getAgreementState(agreement, 'subscriber') === 'SUSPENDED'

    const chips = []
    if (isProviderSuspended) {
      chips.push(
        <Chip label={t(`suspendedByProvider`)} color={CHIP_COLORS_AGREEMENT[agreement.state]} />
      )
    }
    if (isSubscriberSuspended) {
      chips.push(
        <Chip label={t(`suspendedBySubscriber`)} color={CHIP_COLORS_AGREEMENT[agreement.state]} />
      )
    }

    return (
      <Stack direction="row" spacing={1}>
        {chips}
      </Stack>
    )
  }

  async function handleDownloadAgreement() {
    const { response, outcome } = (await runAction(
      {
        path: {
          endpoint: 'AGREEMENT_DOCUMENT_DOWNLOAD',
          endpointParams: { agreementId: agreement.id },
        },
        config: { responseType: 'arraybuffer' },
      },
      { suppressToast: ['success'] }
    )) as RunActionOutput

    if (outcome === 'success') {
      downloadFile((response as AxiosResponse).data, 'Richiesta di fruizione.pdf')
    }
  }

  return (
    <StyledSection>
      <StyledSection.Title>{t('title')}</StyledSection.Title>
      <StyledSection.Content>
        <Stack spacing={2}>
          <InformationRow
            label={t('eserviceField.label')}
            rightContent={
              <StyledLink underline="hover" variant="button" to={buildEServiceLink()}>
                {t('eserviceField.goToEServiceBtn')}
              </StyledLink>
            }
          >
            {agreement.eservice.name}, {t('eserviceField.versionLabel')}{' '}
            {agreement.eservice.version}
          </InformationRow>
          <InformationRow label={t('providerField.label')}>
            {agreement.producer.name}
          </InformationRow>
          <InformationRow label={t('requestStatusField.label')}>{getStatusChips()}</InformationRow>
          {mode === 'subscriber' && (
            <InformationRow label={t('printableCopyField.label')}>
              <StyledLink
                onClick={handleDownloadAgreement}
                component="button"
                variant="body2"
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >
                <AttachFileIcon sx={{ mr: 1 }} /> {t('printableCopyField.docLabel')}
              </StyledLink>
            </InformationRow>
          )}
        </Stack>
      </StyledSection.Content>
    </StyledSection>
  )
}

type ConsumerMessageSectionProps = {
  message: string
}

function ConsumerMessageSection({ message }: ConsumerMessageSectionProps) {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.consumerMessage' })
  return (
    <StyledSection>
      <StyledSection.Title>{t('title')}</StyledSection.Title>
      <StyledSection.Content>
        <Typography fontWeight={600}>{message}</Typography>
      </StyledSection.Content>
    </StyledSection>
  )
}

type AgreementAttributeSectionProps = {
  attributeKey: AttributeKey
  attributes: Array<{ id: string; name: string }>
}

function AgreementAttributeSection({ attributeKey, attributes }: AgreementAttributeSectionProps) {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attributes' })
  const { setDialog } = useContext(DialogContext)

  const openAttributeDetailsDialog = (attribute: typeof attributes[0]) => {
    setDialog({
      type: 'showAttributeDetails',
      attributeId: attribute.id,
      name: attribute.name,
    })
  }

  function AttributeListItem({ attribute }: { attribute: typeof attributes[0] }) {
    const isVerified = false // TODO
    return (
      <Stack component="li" direction="row" spacing={2}>
        <Box sx={{ flex: 1 }}>{attribute.name}</Box>
        <Stack sx={{ flexShrink: 0 }} spacing={1}>
          <Tooltip
            aria-hidden={!isVerified}
            sx={{ visibility: isVerified ? 'visible' : 'hidden' }}
            title={t('verifiedTooltipLabel')}
          >
            <CheckIcon />
          </Tooltip>

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

  let attributesList = null

  if (attributes.length === 0) {
    attributesList = <Alert severity="info">{t(`${attributeKey}.emptyLabel`)}</Alert>
  }

  if (attributes.length > 0) {
    attributesList = (
      <Stack component="ul">
        {attributes.map((attribute) => (
          <AttributeListItem key={attribute.id} attribute={attribute} />
        ))}
      </Stack>
    )
  }

  return (
    <StyledSection>
      <StyledSection.Title>{t(`${attributeKey}.title`)}</StyledSection.Title>
      <StyledSection.Subtitle>
        {t(`${attributeKey}.subtitle`)}{' '}
        <StyledLink component="a" underline="hover" target="_blank" href={attributesHelpLink}>
          {t('howLink')}
        </StyledLink>
      </StyledSection.Subtitle>
      <StyledSection.Content>{attributesList}</StyledSection.Content>
    </StyledSection>
  )
}
