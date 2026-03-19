import { Typography } from '@mui/material'
import { theme } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'

export const RequiredTextLabel: React.FC = () => {
  const { t } = useTranslation('eservice')
  return (
    <Typography
      sx={{
        fontSize: 16,
        fontWeight: 700,
        color: theme.palette.error.dark,
      }}
    >
      {t('create.requiredLabel')}
    </Typography>
  )
}
