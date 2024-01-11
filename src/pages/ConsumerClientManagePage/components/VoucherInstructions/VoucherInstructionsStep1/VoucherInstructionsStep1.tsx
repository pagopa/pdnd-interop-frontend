import React from 'react'
import { SectionContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { Alert, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useVoucherInstructionsContext } from '../VoucherInstructionsContext'
import { ClientQueries } from '@/api/client'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ApiIcon from '@mui/icons-material/Api'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { verifyVoucherGuideLink } from '@/config/constants'
import { VoucherInstructionsStep1CurrentIdsDrawer } from './VoucherInstructionsStep1CurrentIdsDrawer'
import { useDrawerState } from '@/hooks/useDrawerState'
import { StepActions } from '@/components/shared/StepActions'
import { useClientKind } from '@/hooks/useClientKind'

export const VoucherInstructionsStep1: React.FC = () => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()
  const {
    clientId,
    selectedPurposeId,
    handleSelectedPurposeIdChange,
    handleSelectedKeyIdChange,
    selectedKeyId,
    goToNextStep,
  } = useVoucherInstructionsContext()

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const { data: clientKeys = { keys: [] } } = ClientQueries.useGetKeyList({ clientId })
  const { data: client } = ClientQueries.useGetSingle(clientId)

  const purposeSelectLabelId = React.useId()
  const purposeSelectId = React.useId()
  const keySelectLabelId = React.useId()
  const keySelectId = React.useId()

  const purposes = client?.purposes || []

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    goToNextStep()
  }

  const canGoToNextStep =
    clientKind === 'CONSUMER' ? !!(selectedKeyId && selectedPurposeId) : !!selectedKeyId

  if (clientKind === 'CONSUMER' && (!purposes || purposes.length === 0)) {
    return <Alert severity="info">{t('noPurposesLabel')}.</Alert>
  }

  if (!clientKeys || (clientKeys && Boolean(clientKeys.keys.length === 0))) {
    return <Alert severity="info">{t('noKeysLabel')}</Alert>
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <SectionContainer
          newDesign
          title={t(`step1.title.${clientKind}`)}
          description={t('step1.description')}
          bottomActions={[
            {
              startIcon: <OpenInNewIcon fontSize="small" />,
              label: t('step1.goToTechnicalDocsLabel'),
              href: verifyVoucherGuideLink,
              target: '_blank',
            },
            {
              startIcon: <ApiIcon fontSize="small" />,
              label: t('step1.showCurrentSelectionIds'),
              component: 'button',
              type: 'button',
              onClick: openDrawer,
            },
          ]}
        >
          {clientKind === 'CONSUMER' && (
            <FormControl fullWidth>
              <InputLabel id={purposeSelectLabelId}>
                {t('step1.purposeSelectInput.label')}
              </InputLabel>
              <Select
                labelId={purposeSelectLabelId}
                id={purposeSelectId}
                value={selectedPurposeId}
                label={t('step1.purposeSelectInput.label')}
                onChange={(e) => handleSelectedPurposeIdChange(e.target.value)}
              >
                {purposes.map((purpose) => (
                  <MenuItem key={purpose.purposeId} value={purpose.purposeId}>
                    {purpose.title} per {purpose.eservice.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id={keySelectLabelId}>{t('step1.keySelectInput.label')}</InputLabel>
            <Select
              labelId={keySelectLabelId}
              id={keySelectId}
              value={selectedKeyId}
              label={t('step1.keySelectInput.label')}
              onChange={(e) => handleSelectedKeyIdChange(e.target.value)}
            >
              {clientKeys.keys.map((key) => (
                <MenuItem key={key.keyId} value={key.keyId}>
                  {key.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </SectionContainer>
        <StepActions
          forward={{
            label: t('proceedBtn'),
            type: 'submit',
            disabled: !canGoToNextStep,
            endIcon: <ArrowForwardIcon />,
          }}
        />
      </form>
      <VoucherInstructionsStep1CurrentIdsDrawer isOpen={isOpen} onClose={closeDrawer} />
    </>
  )
}
