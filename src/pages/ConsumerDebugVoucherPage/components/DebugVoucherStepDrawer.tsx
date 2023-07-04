import { Chip, List, ListItem, Stack, Typography } from '@mui/material'
import React from 'react'
import { useDebugVoucherContext } from '../DebugVoucherContext'
import { useTranslation } from 'react-i18next'
import { useGetDebugVoucherResultChipProps } from '../hooks/useGetDebugVoucherResultChipProps'

const DebugVoucherStepDrawer: React.FC = () => {
  const { t } = useTranslation('voucher', { keyPrefix: 'consumerDebugVoucher.result' })
  const { debugVoucherStepDrawer } = useDebugVoucherContext()

  const selectedStep = debugVoucherStepDrawer.selectedStep

  const chipProps = useGetDebugVoucherResultChipProps(selectedStep?.[1])

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">{t('stepDrawer.stepResultLabel')}</Typography>
        {chipProps && <Chip size="small" label={chipProps.label} color={chipProps.color} />}
      </Stack>

      <List sx={{ listStyleType: 'disc', pl: 4 }}>
        {selectedStep?.[1].failures.map((failure, index) => (
          <ListItem key={index} sx={{ display: 'list-item', px: 0 }}>
            <Typography variant="body2">
              {t(`errors.${failure.code}` as unknown as TemplateStringsArray, failure.reason)}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Stack>
  )
}

export default DebugVoucherStepDrawer
