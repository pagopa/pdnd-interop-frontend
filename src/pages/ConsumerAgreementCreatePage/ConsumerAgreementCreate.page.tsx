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
import { Button, TextField } from '@mui/material'
import { InputWrapper } from '@/components/shared/InputWrapper'
import useCanUserSubmitAgreementDraft from './hooks/useCanUserSubmitAgreementDraft'

const ConsumerAgreementCreatePage: React.FC = () => {
  const { t } = useTranslation('agreement')
  const { navigate } = useNavigateRouter()

  const [consumerNotes, setConsumerNotes] = React.useState('')
  const { agreementId } = useRouteParams<'SUBSCRIBE_AGREEMENT_EDIT'>()
  const { data: agreement } = AgreementQueries.useGetSingle(agreementId, { suspense: false })
  const { mutate: submitAgreementDraft } = AgreementMutations.useSubmitDraft()

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

  return (
    <PageContainer title={t('read.title')} topSideActions={topSideActions}>
      <React.Suspense fallback={<AgreementDetailsSkeleton />}>
        <AgreementDetails agreementId={agreementId} />
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
      </React.Suspense>

      <PageBottomActionsContainer>
        <RouterLink as="button" to="SUBSCRIBE_AGREEMENT_LIST" variant="outlined">
          {t('backToRequestsBtn')}
        </RouterLink>
        <Button
          disabled={!canUserSubmitAgreementDraft}
          onClick={handleSubmitAgreementDraft}
          variant="contained"
        >
          {t('edit.bottomPageActionCard.submitBtn')}
        </Button>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

export default ConsumerAgreementCreatePage
