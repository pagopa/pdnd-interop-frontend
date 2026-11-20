import type { EServiceConsumer } from '@/pages/ConsumerEServiceDetailsPage/hooks/useActions'
import { Autocomplete } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'
import AccountBalance from '@mui/icons-material/AccountBalance'
import { useTheme } from '@mui/material'

type ConsumerSelectorProps = {
  consumers: EServiceConsumer[]
  onChange: (consumerId: string) => void
  error?: boolean
}

export const ConsumerSelector: React.FC<ConsumerSelectorProps> = ({
  consumers,
  onChange,
  error,
}) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'consumer.detail.dialogs.agreements.common.fields.consumer',
  })

  return (
    <Autocomplete
      options={consumers.map((consumer) => ({
        label: consumer.name,
        value: consumer.id,
      }))}
      onChange={(option) => {
        onChange(option?.value ?? '')
      }}
      label={t('label')}
      placeholder={t('placeholder')}
      required
      error={error}
      helperText={error ? t('error') : undefined}
      slots={{
        startIcon: StartIcon,
      }}
    />
  )
}

const StartIcon: React.FC = () => {
  const theme = useTheme()

  return (
    <AccountBalance
      sx={{
        color: theme.colors.neutral.grey[300],
        w: theme.spacing(3),
        h: theme.spacing(3),
      }}
    />
  )
}
