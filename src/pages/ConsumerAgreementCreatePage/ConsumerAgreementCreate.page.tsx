import React from 'react'
import { AgreementMutations, AgreementQueries } from '@/api/agreement'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import useGetAgreementsActions from '@/hooks/useGetAgreementsActions'
import { Link, useNavigate, useParams } from '@/router'
import { useTranslation } from 'react-i18next'
import { AgreementDetails, AgreementDetailsSkeleton } from '@/components/shared/AgreementDetails'
import {
  AgreementDocsInputSection,
  AgreementDocsInputSectionSkeleton,
} from './components/AgreementDocsInputSection'
import { Button, Grid } from '@mui/material'
import { PageBottomActionsCardContainer } from '@/components/layout/containers/PageBottomCardContainer'
import {
  ConsumerNotesInputSection,
  ConsumerNotesInputSectionSkeleton,
} from './components/ConsumerNotesInputSection'
import { useDescriptorAttributesPartyOwnership } from '@/hooks/useDescriptorAttributesPartyOwnership'

const ConsumerAgreementCreatePage: React.FC = () => {
  const { t } = useTranslation('agreement')
  const navigate = useNavigate()

  const { agreementId } = useParams<'SUBSCRIBE_AGREEMENT_EDIT'>()
  const { data: agreement } = AgreementQueries.useGetSingle(agreementId, {
    suspense: false,
  })
  const [consumerNotes, setConsumerNotes] = React.useState(agreement?.consumerNotes ?? '')
  const { mutate: submitAgreementDraft } = AgreementMutations.useSubmitDraft()
  const { mutate: updateAgreementDraft } = AgreementMutations.useUpdateDraft()
  const { mutate: deleteAgreementDraft } = AgreementMutations.useDeleteDraft()

  const { actions } = useGetAgreementsActions(agreement)

  const { hasAllCertifiedAttributes, hasAllDeclaredAttributes } =
    useDescriptorAttributesPartyOwnership(agreement?.eservice.id, agreement?.descriptorId)

  const handleSubmitAgreementDraft = () => {
    submitAgreementDraft(
      { agreementId, consumerNotes },
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

  const canUserSubmitAgreementDraft = hasAllCertifiedAttributes && hasAllDeclaredAttributes

  return (
    <PageContainer title={t('read.title')} newTopSideActions={actions}>
      <React.Suspense fallback={<AgreementDetailsSkeleton />}>
        <AgreementDetails agreementId={agreementId} />
      </React.Suspense>

      <React.Suspense fallback={<AgreementDocsInputSectionSkeleton />}>
        <AgreementDocsInputSection agreementId={agreementId} />
      </React.Suspense>
      <React.Suspense fallback={<ConsumerNotesInputSectionSkeleton />}>
        <ConsumerNotesInputSection
          agreementId={agreementId}
          consumerNotes={consumerNotes}
          setConsumerNotes={setConsumerNotes}
        />
      </React.Suspense>

      <PageBottomActionsContainer>
        <Link as="button" to="SUBSCRIBE_AGREEMENT_LIST" variant="outlined">
          {t('backToRequestsBtn')}
        </Link>
        <Button onClick={handleUpdateAgreementDraft} variant="contained">
          {t('edit.bottomPageActionCard.updateBtn')}
        </Button>
      </PageBottomActionsContainer>

      <Grid container>
        <Grid item xs={8}>
          <PageBottomActionsCardContainer
            title={t('edit.bottomPageActionCard.title')}
            description={t('edit.bottomPageActionCard.description')}
          >
            <Button onClick={handleDeleteAgreementDraft} variant="outlined">
              {t('edit.bottomPageActionCard.cancelBtn')}
            </Button>
            <Button
              disabled={!canUserSubmitAgreementDraft}
              onClick={handleSubmitAgreementDraft}
              variant="contained"
            >
              {t('edit.bottomPageActionCard.submitBtn')}
            </Button>
          </PageBottomActionsCardContainer>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default ConsumerAgreementCreatePage
