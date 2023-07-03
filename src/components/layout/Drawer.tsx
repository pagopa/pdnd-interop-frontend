import React from 'react'
import { useDrawer, useDrawerStore } from '@/stores/drawer.store'
import { Box, Button, Drawer as MUIDrawer, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTranslation } from 'react-i18next'

export type DrawerProps = {
  title: string
  subtitle?: string
  buttonLabel?: string
  buttonAction?: VoidFunction
  children: JSX.Element
}

type HeaderDrawerProps = {
  handleDrawerClose: VoidFunction
}

const HeaderDrawer: React.FC<HeaderDrawerProps> = ({ handleDrawerClose }) => {
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
      <IconButton onClick={handleDrawerClose} aria-label={t('closeIconAriaLabel')}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}

const _Drawer: React.FC = () => {
  const { closeDrawer } = useDrawer()
  const isOpen = useDrawerStore((state) => state.isOpen)
  const drawer = useDrawerStore((state) => state.drawer)

  if (!drawer) return null

  return (
    <MUIDrawer
      variant="temporary"
      anchor="right"
      open={isOpen}
      onClose={closeDrawer}
      sx={{ zIndex: 99900 }}
    >
      <HeaderDrawer handleDrawerClose={closeDrawer} />
      <Stack spacing={2} width={375} px={3} pt={2} flexGrow={1}>
        <Stack spacing={1} pb={5}>
          <Typography variant="h6" fontWeight={600}>
            {drawer.title}
          </Typography>
          {drawer.subtitle && <Typography variant="body2">{drawer.subtitle}</Typography>}
        </Stack>

        {drawer.children}

        {drawer.buttonLabel && drawer.buttonAction && (
          <Box sx={{ pb: 4 }} width={327} display="flex" flexGrow={1} alignItems="flex-end">
            <Button variant="contained" fullWidth onClick={drawer.buttonAction}>
              {drawer.buttonLabel}
            </Button>
          </Box>
        )}
      </Stack>
    </MUIDrawer>
  )
}

export const Drawer = React.memo(_Drawer)
