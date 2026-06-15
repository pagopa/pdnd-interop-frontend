import React from 'react'
import type { ButtonProps } from '@mui/material'
import {
  Box,
  Button,
  Drawer as MUIDrawer,
  IconButton,
  Stack,
  Typography,
  Tooltip,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTranslation } from 'react-i18next'
import type { ActionItem } from '@/types/common.types'

export type DrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  title: string
  subtitle?: React.ReactNode
  buttonAction?: ActionItem & {
    disabled?: boolean
    variant?: ButtonProps['variant']
    color?: ButtonProps['color']
    disabledTooltip?: string
    type?: ButtonProps['type']
    form?: ButtonProps['form']
  }
  children: React.ReactNode
  onTransitionExited?: VoidFunction
}

type HeaderDrawerProps = {
  onDrawerClose: VoidFunction
}

const HeaderDrawer: React.FC<HeaderDrawerProps> = ({ onDrawerClose }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'drawer' })

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="flex-end"
      height={64}
      width="100%"
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
  onTransitionExited,
}) => {
  return (
    <MUIDrawer
      variant="temporary"
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{ zIndex: 100 }}
      ModalProps={{ onTransitionExited: onTransitionExited }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 375 },
          maxWidth: '100%',
        },
      }}
    >
      <HeaderDrawer onDrawerClose={onClose} />
      <Stack
        px={3}
        pt={2}
        flexGrow={1}
        sx={{
          overflowY: 'auto',
        }}
      >
        <Stack spacing={1} pb={5}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          {typeof subtitle === 'string' ? (
            <Typography variant="body2">{subtitle}</Typography>
          ) : (
            subtitle
          )}
        </Stack>

        <Box sx={{ flexGrow: 1, mt: 2, maxWidth: '100%' }}>{children}</Box>

        {buttonAction && (
          <Box
            sx={{ pb: 4, mt: 0.5, maxWidth: '100%' }}
            width="100%"
            display="flex"
            alignItems="flex-end"
          >
            <Tooltip arrow title={buttonAction.disabled ? buttonAction.disabledTooltip : undefined}>
              <span tabIndex={buttonAction.disabled ? 0 : undefined} style={{ width: '100%' }}>
                <Button
                  disabled={buttonAction.disabled}
                  variant={buttonAction.variant ?? 'contained'}
                  color={buttonAction.color ?? 'primary'}
                  fullWidth
                  onClick={buttonAction.action}
                  type={buttonAction.type ?? 'button'}
                  form={buttonAction.form ?? undefined}
                >
                  {buttonAction.label}
                </Button>
              </span>
            </Tooltip>
          </Box>
        )}
      </Stack>
    </MUIDrawer>
  )
}
