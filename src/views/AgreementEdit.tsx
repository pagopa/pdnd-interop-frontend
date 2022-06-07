import React from 'react'
import { useLocation } from 'react-router-dom'
import {
  AgreementState,
  AgreementSummary,
  ActionProps,
  ProviderOrSubscriber,
  BackendAttributeContent,
} from '../../types'
import { buildDynamicPath, getLastBit } from '../lib/router-utils'
// import { formatDate, getRandomDate } from '../lib/date-utils'
import { mergeActions } from '../lib/eservice-utils'
import { useMode } from '../hooks/useMode'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { getAgreementState } from '../lib/status-utils'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledLink } from '../components/Shared/StyledLink'
import { Box } from '@mui/system'
import { Grid, Typography } from '@mui/material'
import { useRoute } from '../hooks/useRoute'
import { StyledAccordion } from '../components/Shared/StyledAccordion'
import { formatDateString } from '../lib/format-utils'
import { InfoMessage } from '../components/Shared/InfoMessage'
import { PageBottomActions } from '../components/Shared/PageBottomActions'
import { NotFound } from './NotFound'
import { LoadingWithMessage } from '../components/Shared/LoadingWithMessage'
import { useTranslation } from 'react-i18next'
import { useJwt } from '../hooks/useJwt'

export function AgreementEdit() {
  const { t } = useTranslation(['agreement', 'common'])
  const { runAction, forceRerenderCounter } = useFeedback()
  const mode = useMode()
  const agreementId = getLastBit(useLocation())
  const { jwt } = useJwt()
  const { routes } = useRoute()
  const { data, error, isLoading } = useAsyncFetch<AgreementSummary>(
    { path: { endpoint: 'AGREEMENT_GET_SINGLE', endpointParams: { agreementId } } },
    { useEffectDeps: [forceRerenderCounter, mode] }
  )

  /*
   * List of possible actions for the user to perform
   */
  const activate = async () => {
    await runAction(
      {
        path: {
          endpoint: 'AGREEMENT_ACTIVATE',
          endpointParams: { agreementId, partyId: jwt?.organization.id },
        },
      },
      { showConfirmDialog: true }
    )
  }

  const suspend = async () => {
    await runAction(
      {
        path: {
          endpoint: 'AGREEMENT_SUSPEND',
          endpointParams: { agreementId, partyId: jwt?.organization.id },
        },
      },
      { showConfirmDialog: true }
    )
  }

  const upgrade = async () => {
    await runAction(
      { path: { endpoint: 'AGREEMENT_UPGRADE', endpointParams: { agreementId } } },
      { onSuccessDestination: routes.SUBSCRIBE_AGREEMENT_LIST }
    )
  }

  // TEMP PIN-217
  // const archive = () => {
  //   //
  // }

  const wrapVerify = (attributeId: string) => async () => {
    const sureData = data as AgreementSummary
    await runAction({
      path: {
        endpoint: 'AGREEMENT_VERIFY_ATTRIBUTE',
        endpointParams: { agreementId: sureData.id, attributeId },
      },
    })
  }
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
      INACTIVE: [],
    }

    const providerOnlyActions: AgreementActions = {
      ACTIVE: [],
      SUSPENDED: [], // [{ onClick: archive, label: 'Archivia' }],
      PENDING: [{ onClick: activate, label: t('actions.activate', { ns: 'common' }) }],
      INACTIVE: [],
    }

    const subscriberOnlyActionsActive: Array<ActionProps> = []
    if (
      data.eservice.activeDescriptor &&
      data.eservice.activeDescriptor.version > data.eservice.version
    ) {
      subscriberOnlyActionsActive.push({
        onClick: upgrade,
        label: t('actions.upgrade', { ns: 'common' }),
      })
    }

    const subscriberOnlyActions: AgreementActions = {
      ACTIVE: subscriberOnlyActionsActive,
      SUSPENDED: [],
      PENDING: [],
      INACTIVE: [],
    }

    const currentMode = mode as ProviderOrSubscriber
    const currentActions = { provider: providerOnlyActions, subscriber: subscriberOnlyActions }[
      currentMode
    ]

    const status = data ? getAgreementState(data, mode) : 'SUSPENDED'

    return mergeActions<AgreementActions>([currentActions, sharedActions], status)
  }

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
        {data?.attributes.map((backendAttribute, i) => {
          const attributes: Array<BackendAttributeContent> =
            'single' in backendAttribute ? [backendAttribute.single] : backendAttribute.group
          const entries = attributes.map((a) => {
            return {
              summary: a.name,
              summarySecondary: t(
                `edit.attribute.status.${checkVerifiedStatus(
                  a.verified,
                  a.explicitAttributeVerification
                )}`
              ),
              details: (
                <React.Fragment>
                  {a.verificationDate && (
                    <DescriptionBlock label={t('edit.attribute.verificationDateField.label')}>
                      {formatDateString(a.verificationDate)}
                    </DescriptionBlock>
                  )}
                  <DescriptionBlock label={t('edit.attribute.authoritativeSourceField.label')}>
                    {a.origin}
                  </DescriptionBlock>
                  <DescriptionBlock label={t('edit.attribute.descriptionField.label')}>
                    {a.description}
                  </DescriptionBlock>
                </React.Fragment>
              ),
            }
          })

          return (
            <Box key={i} sx={{ mt: 1, mb: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
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
    return (
      <Box>
        {data?.attributes.map((backendAttribute, i) => {
          const attributes: Array<BackendAttributeContent> =
            'single' in backendAttribute ? [backendAttribute.single] : backendAttribute.group

          return (
            <Box key={i} sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
              {Boolean(attributes.length > 1) && (
                <InfoMessage sx={{ mb: 2 }} label={t('edit.attribute.groupMessage')} />
              )}
              {attributes.map((a, i) => {
                return (
                  <Grid container key={i} sx={{ mb: 1 }} alignItems="center">
                    <Grid item xs={4}>
                      <Typography>{a.name}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography color="text.secondary">
                        {t(
                          `edit.attribute.status.${checkVerifiedStatus(
                            a.verified,
                            a.explicitAttributeVerification
                          )}`
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <StyledButton variant="outlined" size="small" onClick={wrapVerify(a.id)}>
                        Verifica
                        {typeof a.verified !== 'undefined' ? ' nuovamente' : ''}
                      </StyledButton>
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

  if (error) {
    return <NotFound errorType="serverError" />
  }

  return (
    <React.Fragment>
      <StyledIntro isLoading={isLoading}>{{ title: t('edit.title') }}</StyledIntro>

      {data ? (
        <React.Fragment>
          <DescriptionBlock label={t('edit.eserviceField.label')}>
            <StyledLink
              to={buildDynamicPath(
                mode === 'subscriber'
                  ? routes.SUBSCRIBE_CATALOG_VIEW.PATH
                  : routes.PROVIDE_ESERVICE_MANAGE.PATH,
                {
                  eserviceId: data?.eservice.id,
                  descriptorId: data?.eserviceDescriptorId,
                }
              )}
            >
              {data?.eservice.name}, {t('edit.eserviceField.versionLabel')} {data?.eservice.version}
            </StyledLink>
            {mode === 'subscriber' &&
            data?.eservice.activeDescriptor &&
            data?.state !== 'INACTIVE' ? (
              <React.Fragment>
                <br />
                <StyledLink
                  to={buildDynamicPath(routes.SUBSCRIBE_CATALOG_VIEW.PATH, {
                    eserviceId: data?.eservice.id,
                    descriptorId: data?.eservice.activeDescriptor.id,
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

          <DescriptionBlock
            label={t('edit.requestStatusField.label')}
            tooltipLabel={
              data?.state !== 'PENDING'
                ? t('edit.requestStatusField.agreementSuspendedMessage')
                : undefined
            }
          >
            {data?.state === 'SUSPENDED' ? (
              <React.Fragment>
                <Typography component="span">
                  {t('edit.requestStatusField.providerSideLabel')}:{' '}
                  {t(`status.agreement.${getAgreementState(data, 'provider')}`, { ns: 'common' })}
                </Typography>
                <br />
                <Typography component="span">
                  {t('edit.requestStatusField.subscriberSideLabel')}:{' '}
                  {t(`status.agreement.${getAgreementState(data, 'subscriber')}`, { ns: 'common' })}
                </Typography>
              </React.Fragment>
            ) : (
              <Typography component="span">
                {t(`status.agreement.${data.state}`, { ns: 'common' })}
              </Typography>
            )}
          </DescriptionBlock>

          <DescriptionBlock label={t('edit.verifiedAttributesField.label')}>
            {data.attributes.length > 0 ? (
              mode === 'provider' ? (
                <ProviderAttributes />
              ) : (
                <SubscriberAttributes />
              )
            ) : (
              <Typography>{t('edit.verifiedAttributesField.noDataLabel')}</Typography>
            )}
          </DescriptionBlock>

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
