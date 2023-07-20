import React from 'react'
import { AgreementMutations, AgreementQueries } from '@/api/agreement'
import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import useGetAgreementsActions from '@/hooks/useGetAgreementsActions'
import { useNavigate, useParams } from '@/router'
import { useTranslation } from 'react-i18next'
import { Box, Button, Tooltip } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import MailIcon from '@mui/icons-material/Mail'
import SaveIcon from '@mui/icons-material/Save'
import { useDescriptorAttributesPartyOwnership } from '@/hooks/useDescriptorAttributesPartyOwnership'
import ConsumerAgreementCreateDetails from './components/ConsumerAgreementCreateDetails'

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
    <PageContainer
      title={t('read.title')}
      newTopSideActions={actions}
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
      <ConsumerAgreementCreateDetails
        agreementId={agreementId}
        consumerNotes={{
          value: consumerNotes,
          setter: setConsumerNotes,
        }}
      />

      <PageBottomActionsContainer>
        <Box display="flex" flexDirection="row" justifyContent="right" flexGrow={1}>
          <Button
            onClick={handleDeleteAgreementDraft}
            variant="text"
            color="error"
            startIcon={<DeleteOutlineIcon />}
          >
            {t('edit.bottomPageActionCard.cancelBtn')}
          </Button>
          <Button
            onClick={handleUpdateAgreementDraft}
            variant="text"
            color="primary"
            startIcon={<SaveIcon />}
          >
            {t('edit.bottomPageActionCard.updateBtn')}
          </Button>
          <Tooltip
            arrow
            title={t('edit.bottomPageActionCard.noCertifiedAttributesForSubmitTooltip')}
          >
            <span tabIndex={!canUserSubmitAgreementDraft ? 0 : undefined}>
              <Button
                disabled={!canUserSubmitAgreementDraft}
                onClick={handleSubmitAgreementDraft}
                variant="contained"
                startIcon={<MailIcon />}
              >
                {t('edit.bottomPageActionCard.submitBtn')}
              </Button>
            </span>
          </Tooltip>
        </Box>
      </PageBottomActionsContainer>
    </PageContainer>
  )
}

export default ConsumerAgreementCreatePage
