import React from 'react'
import { useLocation } from 'react-router-dom'
import {
  AgreementState,
  AgreementSummary,
  ActionProps,
  ProviderOrSubscriber,
  Purpose,
  EServiceReadType,
  BackendAttributeContent,
  BackendAttribute,
  MUIColor,
} from '../../types'
import { buildDynamicPath, getLastBit } from '../lib/router-utils'
import { getLatestActiveVersion, mergeActions } from '../lib/eservice-utils'
import { useMode } from '../hooks/useMode'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { getAgreementState } from '../lib/status-utils'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledLink } from '../components/Shared/StyledLink'
import { Alert, Box, Chip, Divider, Grid, Stack, Typography } from '@mui/material'
import { Launch as LaunchIcon, Link as LinkIcon } from '@mui/icons-material'
import { useRoute } from '../hooks/useRoute'
import { InfoMessage } from '../components/Shared/InfoMessage'
import { PageBottomActions } from '../components/Shared/PageBottomActions'
import { NotFound } from './NotFound'
import { LoadingWithMessage } from '../components/Shared/LoadingWithMessage'
import { Trans, useTranslation } from 'react-i18next'
import { CHIP_COLORS_AGREEMENT } from '../lib/constants'
import { StyledPaper } from '../components/StyledPaper'
import { AccordionEntry, StyledAccordion } from '../components/Shared/StyledAccordion'
import { formatDateString } from '../lib/format-utils'
import StyledSection from '../components/Shared/StyledSection'
import { InformationRow } from '../components/InformationRow'

const CHIP_COLOR_ATTRIBUTE: Record<string, MUIColor> = {
  newlyVerified: 'primary',
  verifiedByAnotherParty: 'primary',
  refused: 'error',
  pending: 'warning',
}

export function AgreementRead() {
  const { t } = useTranslation(['agreement', 'common'])
  const { runAction, forceRerenderCounter } = useFeedback()
  const mode = useMode()
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

  const {
    data: purposes = [],
    error: purposesError,
    isLoading: isLoadingPurposes,
  } = useAsyncFetch<Array<Purpose>>(
    {
      path: { endpoint: 'PURPOSE_GET_LIST' },
      config: { params: { eserviceId: agreement?.eservice.id } },
    },
    { useEffectDeps: [agreement], disabled: !agreement }
  )

  const error = agreementError || eserviceError || purposesError
  const isLoading = isLoadingAgreement || isLoadingEService || isLoadingPurposes

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

  // const wrapVerify = (attributeId: string) => async () => {
  //   const sureData = data as AgreementSummary
  //   await runAction({
  //     path: {
  //       endpoint: 'AGREEMENT_VERIFY_ATTRIBUTE',
  //       endpointParams: { agreementId: sureData.id, attributeId },
  //     },
  //   })
  // }
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
    if (!agreement) return false

    return (
      agreement.eservice.activeDescriptor &&
      agreement.eservice.activeDescriptor.state === 'PUBLISHED' &&
      agreement.eservice.activeDescriptor.version > agreement.eservice.version &&
      agreement.state !== 'ARCHIVED'
    )
  }

  const getSuspendedChips = () => {
    if (!agreement) return

    const isProviderSuspended = getAgreementState(agreement, 'provider') === 'SUSPENDED'
    const isSubscriberSuspended = getAgreementState(agreement, 'subscriber') === 'SUSPENDED'

    const chips = []
    if (isProviderSuspended) {
      chips.push(
        <Chip
          label={t(`read.requestStatusField.suspendedByProvider`)}
          color={CHIP_COLORS_AGREEMENT[agreement.state]}
        />
      )
    }
    if (isSubscriberSuspended) {
      chips.push(
        <Chip
          label={t(`read.requestStatusField.suspendedBySubscriber`)}
          color={CHIP_COLORS_AGREEMENT[agreement.state]}
        />
      )
    }

    return (
      <Stack direction="row" spacing={1}>
        {chips}
      </Stack>
    )
  }

  if (error) {
    return <NotFound errorType="serverError" />
  }

  return (
    <React.Fragment>
      <StyledIntro isLoading={isLoading}>{{ title: t('read.title') }}</StyledIntro>

      {agreement && !isLoading ? (
        <React.Fragment>
          <StyledPaper>
            <DescriptionBlock label={t('read.eserviceField.label')} sx={{ mt: 0 }}>
              <StyledLink
                to={buildDynamicPath(
                  mode === 'subscriber'
                    ? routes.SUBSCRIBE_CATALOG_VIEW.PATH
                    : routes.PROVIDE_ESERVICE_MANAGE.PATH,
                  { eserviceId: agreement?.eservice.id, descriptorId: agreement?.descriptorId }
                )}
              >
                {agreement.eservice.name}, {t('read.eserviceField.versionLabel')}{' '}
                {agreement.eservice.version}
              </StyledLink>
              {mode === 'subscriber' && canUpgrade() ? (
                <React.Fragment>
                  <br />
                  <StyledLink
                    to={buildDynamicPath(routes.SUBSCRIBE_CATALOG_VIEW.PATH, {
                      eserviceId: agreement?.eservice.id,
                      descriptorId: agreement?.eservice.activeDescriptor?.id,
                    })}
                  >
                    {t('read.upgradeField.link.label')}
                  </StyledLink>
                  . {t('read.upgradeField.message')}
                </React.Fragment>
              ) : null}
            </DescriptionBlock>

            {mode === 'provider' && (
              <DescriptionBlock label={t('read.subscriberField.label')}>
                <Typography component="span">{agreement.consumer.name}</Typography>
              </DescriptionBlock>
            )}

            {mode === 'subscriber' && (
              <DescriptionBlock label={t('read.providerField.label')}>
                <Typography component="span">{agreement.producer.name}</Typography>
              </DescriptionBlock>
            )}

            <DescriptionBlock
              label={t('read.requestStatusField.label')}
              tooltipLabel={
                agreement?.state !== 'PENDING'
                  ? t('read.requestStatusField.agreementSuspendedMessage')
                  : undefined
              }
            >
              {agreement?.state !== 'SUSPENDED' ? (
                <Chip
                  label={t(`status.agreement.${agreement.state}`, { ns: 'common' })}
                  color={CHIP_COLORS_AGREEMENT[agreement.state]}
                />
              ) : (
                getSuspendedChips()
              )}
            </DescriptionBlock>

            <DescriptionBlock label={t('read.certifiedAttributesField.label')}>
              {eservice && (
                <CertifiedAttributesList eserviceAttributes={eservice.attributes.certified} />
              )}
            </DescriptionBlock>

            <DescriptionBlock label={t('read.verifiedAttributesField.label')}>
              {eservice && (
                <VerifiedAttributesList eserviceAttributes={eservice.attributes.verified} />
              )}
            </DescriptionBlock>

            {/* <DescriptionBlock label={t('read.declaredAttributesField.label')}>
              <DeclaredAttributesList attributes={data.declaredAttributes} />
            </DescriptionBlock> */}

            {mode === 'subscriber' && purposes.length === 0 && (
              <Alert severity="info">
                {t('read.noPurposeLabel')}.{' '}
                <StyledLink to={routes.SUBSCRIBE_PURPOSE_CREATE.PATH}>
                  {t('read.noPurposeLink.label')}
                </StyledLink>
              </Alert>
            )}
          </StyledPaper>

          <PageBottomActions>
            {getAvailableActions().map(({ onClick, label }, i) => (
              <StyledButton variant={i === 0 ? 'contained' : 'outlined'} key={i} onClick={onClick}>
                {label}
              </StyledButton>
            ))}
          </PageBottomActions>
        </React.Fragment>
      ) : (
        <LoadingWithMessage label={t('loadingSingleLabel')} transparentBackground />
      )}
    </React.Fragment>
  )
}

interface CertifiedAttributesListProps {
  eserviceAttributes: Array<BackendAttribute>
}

const CertifiedAttributesList: React.FC<CertifiedAttributesListProps> = ({
  eserviceAttributes,
}) => {
  const { t } = useTranslation(['agreement', 'common'])

  const Attributes = () => {
    return (
      <Box>
        {eserviceAttributes.map((backendAttribute, i) => {
          const attributes: Array<BackendAttributeContent> =
            'single' in backendAttribute ? [backendAttribute.single] : backendAttribute.group
          const entries = attributes.map((a) => {
            return {
              summary: a.name,
              details: (
                <DescriptionBlock label={t('read.attribute.descriptionField.label')} sx={{ mb: 0 }}>
                  {a.description}
                </DescriptionBlock>
              ),
            }
          })

          return (
            <Box key={i} sx={{ mt: 1, mb: 2, borderBottom: 1, borderColor: 'divider' }}>
              {Boolean(entries.length > 1) && (
                <InfoMessage sx={{ mb: 2 }} label={t('read.attribute.groupMessage')} />
              )}
              <StyledAccordion entries={entries} />
            </Box>
          )
        })}
      </Box>
    )
  }

  return eserviceAttributes.length > 0 ? (
    <Attributes />
  ) : (
    <Typography>{t('read.certifiedAttributesField.noDataLabel')}</Typography>
  )
}

interface VerifiedAttributesListProps {
  eserviceAttributes: Array<BackendAttribute>
}

const VerifiedAttributesList: React.FC<VerifiedAttributesListProps> = ({ eserviceAttributes }) => {
  const { t } = useTranslation(['agreement', 'common'])
  const mode = useMode()

  const checkVerifiedStatus = (
    verified: boolean | undefined,
    explicitAttributeVerification: boolean
  ) => {
    if (!explicitAttributeVerification) {
      return 'verifiedByAnotherParty'
    }

    if (typeof verified === 'undefined') {
      return 'pending'
    }

    return verified ? 'newlyVerified' : 'refused'
  }

  const SubscriberAttributes = () => {
    return (
      <Box>
        {eserviceAttributes.map((backendAttribute, i) => {
          const attributes: Array<BackendAttributeContent> =
            'single' in backendAttribute ? [backendAttribute.single] : backendAttribute.group
          const entries = attributes.map((a) => {
            const attributeStatus = checkVerifiedStatus(a.verified, a.explicitAttributeVerification)

            return {
              summary: a.name,
              summarySecondary: (
                <Chip
                  label={t(`read.attribute.status.${attributeStatus}`)}
                  color={CHIP_COLOR_ATTRIBUTE[attributeStatus]}
                />
              ),
              details: (
                <React.Fragment>
                  {a.verificationDate && (
                    <DescriptionBlock
                      label={t('read.attribute.verificationDateField.label')}
                      sx={{ mt: 0 }}
                    >
                      {formatDateString(a.verificationDate)}
                    </DescriptionBlock>
                  )}
                  <DescriptionBlock
                    label={t('read.attribute.descriptionField.label')}
                    sx={{ mb: 0 }}
                  >
                    {a.description}
                  </DescriptionBlock>
                </React.Fragment>
              ),
            }
          })

          return (
            <Box key={i} sx={{ mt: 1, mb: 2, borderBottom: 1, borderColor: 'divider' }}>
              {Boolean(entries.length > 1) && (
                <InfoMessage sx={{ mb: 2 }} label={t('read.attribute.groupMessage')} />
              )}
              <StyledAccordion entries={entries} />
            </Box>
          )
        })}
      </Box>
    )
  }

  const ProviderAttributes = () => {
    const wrapVerify = (_: string) => async () => {
      //
    }

    return (
      <Box>
        {eserviceAttributes.map((backendAttribute, i) => {
          const attributes: Array<BackendAttributeContent> =
            'single' in backendAttribute ? [backendAttribute.single] : backendAttribute.group

          return (
            <Box key={i} sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
              {Boolean(attributes.length > 1) && (
                <InfoMessage sx={{ mb: 2 }} label={t('read.attribute.groupMessage')} />
              )}
              {attributes.map((a, i) => {
                const attributeStatus = checkVerifiedStatus(
                  a.verified,
                  a.explicitAttributeVerification
                )
                return (
                  <Grid container key={i} sx={{ mb: 1 }} alignItems="center">
                    <Grid item xs={4}>
                      <Typography>{a.name}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Chip
                        label={t(`read.attribute.status.${attributeStatus}`)}
                        color={CHIP_COLOR_ATTRIBUTE[attributeStatus]}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Stack direction="row" justifyContent="flex-end">
                        <StyledButton variant="outlined" size="small" onClick={wrapVerify(a.id)}>
                          Verifica
                          {typeof a.verified !== 'undefined' ? ' nuovamente' : ''}
                        </StyledButton>
                      </Stack>
                    </Grid>
                  </Grid>
                )
              })}
            </Box>
          )
        })}
      </Box>
    )
  }

  return eserviceAttributes.length > 0 ? (
    mode === 'provider' ? (
      <ProviderAttributes />
    ) : (
      <SubscriberAttributes />
    )
  ) : (
    <Typography>{t('read.verifiedAttributesField.noDataLabel')}</Typography>
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
