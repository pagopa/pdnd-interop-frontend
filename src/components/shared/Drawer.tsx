import React from 'react'
import { Box, Button, Drawer as MUIDrawer, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTranslation } from 'react-i18next'
import type { ActionItem } from '@/types/common.types'

export type DrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  title: string
  subtitle?: string
  buttonAction?: ActionItem & { disabled?: boolean }
  children: React.ReactNode
}

type HeaderDrawerProps = {
  onDrawerClose: VoidFunction
}

const HeaderDrawer: React.FC<HeaderDrawerProps> = ({ onDrawerClose }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'drawer' })

  return (
    <Box
      display="flex"
      justifyContent="end"
      alignItems="end"
      height={64}
      width={375}
      pr={1}
      pb={1}
      flexShrink={0}
    >
      <IconButton onClick={onDrawerClose} aria-label={t('closeIconAriaLabel')}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  buttonAction,
  children,
}) => {
  return (
    <MUIDrawer
      variant="temporary"
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{ zIndex: 100 }}
    >
      <HeaderDrawer onDrawerClose={onClose} />
      <Stack width={375} px={3} pt={2} flexGrow={1}>
        <Stack spacing={1} pb={5}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          {subtitle && <Typography variant="body2">{subtitle}</Typography>}
        </Stack>

        <Box sx={{ flexGrow: 1, mt: 2 }}>{children}</Box>

        {buttonAction && (
          <Box sx={{ pb: 4, mt: 0.5 }} width={327} display="flex" alignItems="flex-end">
            <Button
              variant="contained"
              disabled={buttonAction.disabled}
              fullWidth
              onClick={buttonAction.action}
            >
              {buttonAction.label}
            </Button>
          </Box>
        )}
      </Stack>
    </MUIDrawer>
  )
}
