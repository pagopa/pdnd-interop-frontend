import React from 'react'
import { AgreementMutations, AgreementQueries } from '@/api/agreement'
import {
  PageBottomActionsContainer,
  PageContainer,
  SectionContainer,
} from '@/components/layout/containers'
import useGetAgreementsActions from '@/hooks/useGetAgreementsActions'
import { RouterLink, useNavigateRouter, useRouteParams } from '@/router'
import { formatTopSideActions } from '@/utils/common.utils'
import { useTranslation } from 'react-i18next'
import { AgreementDetails, AgreementDetailsSkeleton } from '@/components/shared/AgreementDetails'
import { ConsumerAgreementCreateDocsInputSection } from './components/ConsumerAgreementCreateDocsInputSection'
import { Button, Grid, TextField } from '@mui/material'
import { InputWrapper } from '@/components/shared/InputWrapper'
import useCanUserSubmitAgreementDraft from './hooks/useCanUserSubmitAgreementDraft'
import { PageBottomActionsCardContainer } from '@/components/layout/containers/PageBottomCardContainer'

const ConsumerAgreementCreatePage: React.FC = () => {
  const { t } = useTranslation('agreement')
  const { navigate } = useNavigateRouter()

  const [consumerNotes, setConsumerNotes] = React.useState('')
  const { agreementId } = useRouteParams<'SUBSCRIBE_AGREEMENT_EDIT'>()
  const { data: agreement } = AgreementQueries.useGetSingle(agreementId, { suspense: false })
  const { mutate: submitAgreementDraft } = AgreementMutations.useSubmitDraft()
  const { mutate: updateAgreementDraft } = AgreementMutations.useUpdateDraft()
  const { mutate: deleteAgreementDraft } = AgreementMutations.useDeleteDraft()

  const { actions } = useGetAgreementsActions(agreement)
  const topSideActions = formatTopSideActions(actions)

  const canUserSubmitAgreementDraft = useCanUserSubmitAgreementDraft(agreementId)

  const handleSubmitAgreementDraft = () => {
    submitAgreementDraft(
      { agreementId, consumerNotes },
      {
        onSuccess() {
          navigate('SUBSCRIBE_AGREEMENT_LIST')
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

  const isAgreementEServiceMine = agreement && agreement?.producer.id === agreement?.consumer.id

  return (
    <PageContainer title={t('read.title')} topSideActions={topSideActions}>
      <React.Suspense fallback={<AgreementDetailsSkeleton />}>
        <AgreementDetails agreementId={agreementId} />

        {!isAgreementEServiceMine && (
          <>
            <ConsumerAgreementCreateDocsInputSection agreementId={agreementId} />
            <SectionContainer
              title={t('edit.consumerNotes.title')}
              description={t('edit.consumerNotes.description')}
            >
              <InputWrapper
                name="consumerNotes"
                infoLabel={t('edit.consumerNotes.field.infoLabel')}
                sx={{ mb: 0, mt: 3 }}
              >
                <TextField
                  label={t('edit.consumerNotes.field.label')}
                  name="consumerNotes"
                  value={consumerNotes}
                  onChange={(e) => setConsumerNotes(e.target.value)}
                  multiline
                  rows={6}
                  inputProps={{ maxLength: 1000 }}
                  InputLabelProps={{ shrink: true }}
                />
              </InputWrapper>
            </SectionContainer>
          </>
        )}
      </React.Suspense>

      <PageBottomActionsContainer>
        <RouterLink as="button" to="SUBSCRIBE_AGREEMENT_LIST" variant="outlined">
          {t('backToRequestsBtn')}
        </RouterLink>
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
