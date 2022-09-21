import React, { useEffect, useState } from 'react'
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
import { mergeActions } from '../lib/eservice-utils'
import { useMode } from '../hooks/useMode'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { getAgreementState } from '../lib/status-utils'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledLink } from '../components/Shared/StyledLink'
import { Alert, Box, Chip, Grid, Stack, Typography } from '@mui/material'
import { useRoute } from '../hooks/useRoute'
import { InfoMessage } from '../components/Shared/InfoMessage'
import { PageBottomActions } from '../components/Shared/PageBottomActions'
import { NotFound } from './NotFound'
import { LoadingWithMessage } from '../components/Shared/LoadingWithMessage'
import { useTranslation } from 'react-i18next'
import { CHIP_COLORS_AGREEMENT } from '../lib/constants'
import { fetchWithLogs } from '../lib/api-utils'
import { isFetchError } from '../lib/error-utils'
import { AxiosResponse } from 'axios'
import { StyledPaper } from '../components/StyledPaper'
import { StyledAccordion } from '../components/Shared/StyledAccordion'
import { formatDateString } from '../lib/format-utils'

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
  const [purposes, setPurposes] = useState<Array<Purpose>>([])
  const [eservice, setEService] = useState<EServiceReadType>()
  const agreementId = getLastBit(useLocation())
  const { routes } = useRoute()
  const { data, error, isLoading } = useAsyncFetch<AgreementSummary>(
    { path: { endpoint: 'AGREEMENT_GET_SINGLE', endpointParams: { agreementId } } },
    { useEffectDeps: [forceRerenderCounter, mode] }
  )

  useEffect(() => {
    async function asyncFetchEService() {
      const response = await fetchWithLogs({
        path: {
          endpoint: 'ESERVICE_GET_SINGLE',
          endpointParams: { eserviceId: data?.eservice.id },
        },
      })

      if (!isFetchError(response)) {
        setEService((response as AxiosResponse).data)
      }
    }

    if (data) {
      asyncFetchEService()
    }
  }, [data])

  useEffect(() => {
    async function asyncFetchPurposes() {
      const response = await fetchWithLogs({
        path: { endpoint: 'PURPOSE_GET_LIST' },
        config: { params: { eserviceId: data?.eservice.id } },
      })

      if (!isFetchError(response)) {
        setPurposes((response as AxiosResponse).data.purposes)
      }
    }

    if (data) {
      asyncFetchPurposes()
    }
  }, [data])

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
    if (!data) {
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

    const status = data ? getAgreementState(data, mode) : 'SUSPENDED'

    return mergeActions<AgreementActions>([currentActions, sharedActions], status)
  }

  const canUpgrade = () => {
    if (!data) return false

    return (
      data.eservice.activeDescriptor &&
      data.eservice.activeDescriptor.state === 'PUBLISHED' &&
      data.eservice.activeDescriptor.version > data.eservice.version &&
      data.state !== 'ARCHIVED'
    )
  }

  const getSuspendedChips = () => {
    if (!data) return

    const isProviderSuspended = getAgreementState(data, 'provider') === 'SUSPENDED'
    const isSubscriberSuspended = getAgreementState(data, 'subscriber') === 'SUSPENDED'

    const chips = []
    if (isProviderSuspended) {
      chips.push(
        <Chip
          label={t(`edit.requestStatusField.suspendedByProvider`)}
          color={CHIP_COLORS_AGREEMENT[data.state]}
        />
      )
    }
    if (isSubscriberSuspended) {
      chips.push(
        <Chip
          label={t(`edit.requestStatusField.suspendedBySubscriber`)}
          color={CHIP_COLORS_AGREEMENT[data.state]}
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
      <StyledIntro isLoading={isLoading}>{{ title: t('edit.title') }}</StyledIntro>

      {data ? (
        <React.Fragment>
          <StyledPaper>
            <DescriptionBlock label={t('edit.eserviceField.label')} sx={{ mt: 0 }}>
              <StyledLink
                to={buildDynamicPath(
                  mode === 'subscriber'
                    ? routes.SUBSCRIBE_CATALOG_VIEW.PATH
                    : routes.PROVIDE_ESERVICE_MANAGE.PATH,
                  { eserviceId: data?.eservice.id, descriptorId: data?.descriptorId }
                )}
              >
                {data?.eservice.name}, {t('edit.eserviceField.versionLabel')}{' '}
                {data?.eservice.version}
              </StyledLink>
              {mode === 'subscriber' && canUpgrade() ? (
                <React.Fragment>
                  <br />
                  <StyledLink
                    to={buildDynamicPath(routes.SUBSCRIBE_CATALOG_VIEW.PATH, {
                      eserviceId: data?.eservice.id,
                      descriptorId: data?.eservice.activeDescriptor?.id,
                    })}
                  >
                    {t('edit.upgradeField.link.label')}
                  </StyledLink>
                  . {t('edit.upgradeField.message')}
                </React.Fragment>
              ) : null}
            </DescriptionBlock>

            {mode === 'provider' && (
              <DescriptionBlock label={t('edit.subscriberField.label')}>
                <Typography component="span">{data?.consumer.name}</Typography>
              </DescriptionBlock>
            )}

            {mode === 'subscriber' && (
              <DescriptionBlock label={t('edit.providerField.label')}>
                <Typography component="span">{data?.producer.name}</Typography>
              </DescriptionBlock>
            )}

            <DescriptionBlock
              label={t('edit.requestStatusField.label')}
              tooltipLabel={
                data?.state !== 'PENDING'
                  ? t('edit.requestStatusField.agreementSuspendedMessage')
                  : undefined
              }
            >
              {data?.state !== 'SUSPENDED' ? (
                <Chip
                  label={t(`status.agreement.${data.state}`, { ns: 'common' })}
                  color={CHIP_COLORS_AGREEMENT[data.state]}
                />
              ) : (
                getSuspendedChips()
              )}
            </DescriptionBlock>

            <DescriptionBlock label={t('edit.certifiedAttributesField.label')}>
              {eservice && (
                <CertifiedAttributesList eserviceAttributes={eservice.attributes.certified} />
              )}
            </DescriptionBlock>

            <DescriptionBlock label={t('edit.verifiedAttributesField.label')}>
              {eservice && (
                <VerifiedAttributesList eserviceAttributes={eservice.attributes.verified} />
              )}
            </DescriptionBlock>

            {/* <DescriptionBlock label={t('edit.declaredAttributesField.label')}>
              <DeclaredAttributesList attributes={data.declaredAttributes} />
            </DescriptionBlock> */}

            {mode === 'subscriber' && purposes.length === 0 && (
              <Alert severity="info">
                {t('edit.noPurposeLabel')}.{' '}
                <StyledLink to={routes.SUBSCRIBE_PURPOSE_CREATE.PATH}>
                  {t('edit.noPurposeLink.label')}
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
                <DescriptionBlock label={t('edit.attribute.descriptionField.label')} sx={{ mb: 0 }}>
                  {a.description}
                </DescriptionBlock>
              ),
            }
          })

          return (
            <Box key={i} sx={{ mt: 1, mb: 2, borderBottom: 1, borderColor: 'divider' }}>
              {Boolean(entries.length > 1) && (
                <InfoMessage sx={{ mb: 2 }} label={t('edit.attribute.groupMessage')} />
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
    <Typography>{t('edit.certifiedAttributesField.noDataLabel')}</Typography>
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
                  label={t(`edit.attribute.status.${attributeStatus}`)}
                  color={CHIP_COLOR_ATTRIBUTE[attributeStatus]}
                />
              ),
              details: (
                <React.Fragment>
                  {a.verificationDate && (
                    <DescriptionBlock
                      label={t('edit.attribute.verificationDateField.label')}
                      sx={{ mt: 0 }}
                    >
                      {formatDateString(a.verificationDate)}
                    </DescriptionBlock>
                  )}
                  <DescriptionBlock
                    label={t('edit.attribute.descriptionField.label')}
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
                <InfoMessage sx={{ mb: 2 }} label={t('edit.attribute.groupMessage')} />
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
                <InfoMessage sx={{ mb: 2 }} label={t('edit.attribute.groupMessage')} />
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
                        label={t(`edit.attribute.status.${attributeStatus}`)}
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
    <Typography>{t('edit.verifiedAttributesField.noDataLabel')}</Typography>
  )
}

/*
interface DeclaredAttributesListProps {
  attributes: Array<DeclaredAttribute>
}

const DeclaredAttributesList: React.FC<DeclaredAttributesListProps> = ({ attributes }) => {
  const { t } = useTranslation(['agreement', 'common'])

  if (attributes.length === 0) {
    return <Typography>{t('edit.declaredAttributesField.noDataLabel')}</Typography>
  }

  return (
    <Box sx={{ mt: 1, mb: 2, borderBottom: 1, borderColor: 'divider' }}>
      {Boolean(attributes.length > 1) && (
        <InfoMessage sx={{ mb: 2 }} label={t('edit.attribute.groupMessage')} />
      )}
      {attributes.map((a) => (
        <Stack justifyContent="space-between" key={a.id}>
          <Box>
            {a.name}
            <br />
            {a.description}
          </Box>
        </Stack>
      ))}
    </Box>
  )
}
*/
