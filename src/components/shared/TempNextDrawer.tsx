import { Close } from '@mui/icons-material'
import {
  Drawer as MUIDrawer,
  Stack,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export type DrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  title: React.ReactNode
  subtitle?: React.ReactNode
  footerActions?: React.ReactNode
  children: React.ReactNode
  onTransitionExited?: VoidFunction
}

export const TempNextDrawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  footerActions,
  children,
  onTransitionExited,
}) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'drawer' })

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <>
      <MUIDrawer
        variant="temporary"
        anchor={isMobile ? 'bottom' : 'right'}
        open={isOpen}
        onClose={onClose}
        sx={{ zIndex: 100 }}
        ModalProps={{ onTransitionExited: onTransitionExited }}
        PaperProps={{
          sx: {
            width: { xs: '100%', md: 375 },
            maxWidth: '100%',
          },
        }}
      >
        <Stack flexGrow={1} overflow={'hidden'}>
          <Stack px={3} pt={3} flexGrow={1} overflow={'auto'}>
            <Stack mb={4}>
              <Stack direction="row" alignItems={'center'} justifyContent={'space-between'} mb={2}>
                <Typography variant="h5" color={theme.colors.neutral.black}>
                  {title}
                </Typography>
                <IconButton onClick={onClose} aria-label={t('closeIconAriaLabel')}>
                  <Close
                    fontSize="small"
                    sx={{
                      color: theme.colors.neutral.black,
                    }}
                  />
                </IconButton>
              </Stack>
              <Typography variant="body2" color={theme.colors.neutral.grey[700]}>
                {subtitle}
              </Typography>
            </Stack>
            {children}
          </Stack>
          {footerActions && (
            <Stack
              direction={{ xs: 'column-reverse', md: 'row' }}
              p={3}
              justifyContent={{ xs: 'center', md: 'flex-end' }}
              gap={{ xs: 3, md: 4 }}
            >
              {footerActions}
            </Stack>
          )}
        </Stack>
      </MUIDrawer>
    </>
  )
}
