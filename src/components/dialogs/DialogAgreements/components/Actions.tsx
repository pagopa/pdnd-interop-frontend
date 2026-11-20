import { useDialog } from '@/stores'
import { Stack, useTheme } from '@mui/material'
import { MIButton as Button } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'

export const Actions: React.FC<{
  confirm: {
    disabled: boolean
    icon: React.ReactNode
    label: string
    error?: boolean
    onClick: VoidFunction
  }
}> = ({ confirm: { disabled, icon, label, error, onClick } }) => {
  const theme = useTheme()
  const { t: tCommon } = useTranslation('common')

  const { closeDialog } = useDialog()

  return (
    <Stack
      sx={{
        padding: theme.spacing(2, 3),
        gap: theme.spacing(2.5),
        flexDirection: 'column-reverse',
        [theme.breakpoints.up('md')]: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          flex: 1,
          justifyContent: 'flex-end',
        },
      }}
    >
      <Button variant="text" onClick={closeDialog}>
        {tCommon('actions.cancel')}
      </Button>
      <Button
        variant="contained"
        disabled={disabled}
        startIcon={icon}
        color={error ? 'error' : 'primary'}
        onClick={onClick}
      >
        {label}
      </Button>
    </Stack>
  )
}
