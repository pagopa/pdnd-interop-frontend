import { Typography } from '@mui/material'
import { theme } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'

export const RequiredTextLabel: React.FC = () => {
  const { t } = useTranslation('shared-components')
  return (
    <Typography
      sx={{
        fontSize: 16,
        fontWeight: 700,
        color: theme.palette.error.dark,
      }}
    >
      {t('requiredLabel')}
    </Typography>
  )
}
