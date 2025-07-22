import React from 'react'
import { AgreementMutations, AgreementQueries } from '@/api/agreement'
import { PageContainer } from '@/components/layout/containers'
import { useNavigate, useParams } from '@/router'
import { useTranslation, Trans } from 'react-i18next'
import { Button, Stack, Tooltip, Alert, Link, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import MailIcon from '@mui/icons-material/Mail'
import SaveIcon from '@mui/icons-material/Save'
import { useDescriptorAttributesPartyOwnership } from '@/hooks/useDescriptorAttributesPartyOwnership'
import {
  ConsumerAgreementCreateContent,
  ConsumerAgreementCreateContentSkeleton,
} from './components/ConsumerAgreementCreateContent'
import { useGetConsumerAgreementCreateAlertProps } from './hooks/useGetConsumerAgreementCreateAlertProps'
import { isNewEServiceVersionAvailable } from '@/utils/agreement.utils'
import { useQuery } from '@tanstack/react-query'
import { AuthHooks } from '@/api/auth'

const ConsumerAgreementCreatePage: React.FC = () => {
  const { t } = useTranslation('agreement')
  const { t: tCommon } = useTranslation('common')
  const navigate = useNavigate()
  const { jwt } = AuthHooks.useJwt()

  const { agreementId } = useParams<'SUBSCRIBE_AGREEMENT_EDIT'>()
  const { data: agreement } = useQuery(AgreementQueries.getSingle(agreementId))

  const isDelegated = Boolean(agreement && agreement.delegation)

  const [consumerNotes, setConsumerNotes] = React.useState(agreement?.consumerNotes ?? '')

  const { mutate: submitAgreementDraft } = AgreementMutations.useSubmitDraft(isDelegated)
  const { mutate: updateAgreementDraft } = AgreementMutations.useUpdateDraft()
  const { mutate: deleteAgreementDraft } = AgreementMutations.useDeleteDraft()

  const { hasAllCertifiedAttributes, hasAllDeclaredAttributes } =
    useDescriptorAttributesPartyOwnership(
      agreement?.eservice.id,
      agreement?.descriptorId,
      isDelegated ? agreement?.consumer.id : jwt?.organizationId
    )

  const hasSetContactEmail = Boolean(agreement?.consumer.contactMail?.address)
  const isEServiceSuspended = agreement?.eservice.activeDescriptor?.state === 'SUSPENDED'

  const hasNewEserviceVersion = isNewEServiceVersionAvailable(agreement)

  const handleSubmitAgreementDraft = () => {
    submitAgreementDraft(
      { agreementId, consumerNotes, delegatorName: agreement?.consumer.name },
      {
        onSuccess() {
          navigate('SUBSCRIBE_AGREEMENT_READ', {
            params: {
              agreementId: agreementId,
            },
          })
        },
      }
    )
  }

  const handleUpdateAgreementDraft = () => {
    updateAgreementDraft(
      { agreementId, consumerNotes },
      {
        onSuccess() {
          navigate('SUBSCRIBE_AGREEMENT_LIST')
        },
      }
    )
  }

  const handleDeleteAgreementDraft = () => {
    deleteAgreementDraft(
      { agreementId },
      {
        onSuccess() {
          navigate('SUBSCRIBE_AGREEMENT_LIST')
        },
      }
    )
  }

  const canUserSubmitAgreementDraft =
    hasAllCertifiedAttributes &&
    hasAllDeclaredAttributes &&
    hasSetContactEmail &&
    !isEServiceSuspended &&
    !hasNewEserviceVersion

  const getTooltipButtonTitle = () => {
    if (isEServiceSuspended) {
      return t('edit.suspendedEServiceTooltip')
    }
    if (!hasAllCertifiedAttributes) {
      return t('edit.noCertifiedAttributesForSubmitTooltip')
    }
    if (!hasAllDeclaredAttributes) {
      return t('edit.noDeclaredAttributesForSubmitTooltip')
    }
    if (!hasSetContactEmail) {
      return t('edit.noContactEmailTooltip')
    }
  }

  const alertProps = useGetConsumerAgreementCreateAlertProps(agreement)

  return (
    <PageContainer
      title={t('edit.title')}
      statusChip={
        agreement
          ? {
              for: 'agreement',
              agreement: agreement,
            }
          : undefined
      }
      backToAction={{
        label: t('backToRequestsBtn'),
        to: 'SUBSCRIBE_AGREEMENT_LIST',
      }}
    >
      {alertProps && (
        <Alert sx={{ mb: 3 }} severity={alertProps.severity}>
          <Trans
            components={{
              1: (
                <Link
                  onClick={alertProps.action}
                  underline="hover"
                  sx={{
                    cursor: 'pointer',
                  }}
                />
              ),
              strong: <Typography component="span" variant="inherit" fontWeight={600} />,
            }}
          >
            {alertProps.content}
          </Trans>
        </Alert>
      )}

      <React.Suspense fallback={<ConsumerAgreementCreateContentSkeleton />}>
        <ConsumerAgreementCreateContent
          agreementId={agreementId}
          consumerNotes={consumerNotes}
          onConsumerNotesChange={setConsumerNotes}
        />
      </React.Suspense>

      <Stack direction="row" spacing={1.5} sx={{ mt: 4, justifyContent: 'right' }}>
        <Button
          onClick={handleDeleteAgreementDraft}
          variant="text"
          color="error"
          startIcon={<DeleteOutlineIcon />}
        >
          {tCommon('actions.deleteDraft')}
        </Button>
        {!hasNewEserviceVersion && (
          <>
            <Button
              onClick={handleUpdateAgreementDraft}
              variant="text"
              color="primary"
              startIcon={<SaveIcon />}
            >
              {tCommon('actions.saveDraft')}
            </Button>
            <Tooltip arrow title={getTooltipButtonTitle()}>
              <span tabIndex={!canUserSubmitAgreementDraft ? 0 : undefined}>
                <Button
                  disabled={!canUserSubmitAgreementDraft}
                  onClick={handleSubmitAgreementDraft}
                  variant="contained"
                  startIcon={<MailIcon />}
                >
                  {t('edit.submitBtn')}
                </Button>
              </span>
            </Tooltip>
          </>
        )}
      </Stack>
    </PageContainer>
  )
}

export default ConsumerAgreementCreatePage
