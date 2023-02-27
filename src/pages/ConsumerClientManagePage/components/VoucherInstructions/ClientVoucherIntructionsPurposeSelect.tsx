import { PurposeQueries } from '@/api/purpose'
import { SectionContainer } from '@/components/layout/containers'
import type { ClientPurpose } from '@/types/client.types'
import { getPurposeFailureReasons } from '@/utils/purpose.utils'
import { Alert, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

type ClientVoucherIntructionsPurposeSelectProps = {
  purposes: Array<ClientPurpose>
  selectedPurposeId: string
  onChange: (purposeId: string) => void
}

export const ClientVoucherIntructionsPurposeSelect: React.FC<
  ClientVoucherIntructionsPurposeSelectProps
> = ({ purposes, selectedPurposeId, onChange }) => {
  const { t } = useTranslation('voucher')
  const { data: selectedPurpose } = PurposeQueries.useGetSingle(selectedPurposeId, {
    suspense: false,
  })

  const failureReasons = selectedPurpose ? getPurposeFailureReasons(selectedPurpose) : []

  const selectOptions = purposes.map((p) => (
    <MenuItem key={p.purposeId} value={p.purposeId}>
      {`${p.title} per ${p.agreement.eservice.name}`}
    </MenuItem>
  ))

  return (
    <SectionContainer>
      <FormControl fullWidth>
        <InputLabel id="choose-purpose-label">{t('choosePurposeLabel')}</InputLabel>
        <Select
          sx={{ my: 0 }}
          labelId="choose-purpose-label"
          name="purpose"
          label={t('choosePurposeLabel')}
          value={selectedPurposeId}
          onChange={(e) => onChange(e.target.value)}
        >
          {selectOptions}
        </Select>

        {failureReasons.length > 0 && (
          <Alert sx={{ mt: 1 }} severity="info">
            {t('purposeFailureMessage')}{' '}
            {failureReasons.map((r) => t(`purposeFailureReason.${r}`)).join(', ')}
          </Alert>
        )}
      </FormControl>
    </SectionContainer>
  )
}
