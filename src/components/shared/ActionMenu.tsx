import React, { useId } from 'react'
import { ClickAwayListener, MenuItem, Menu, IconButton, Skeleton, Box } from '@mui/material'
import type { ActionItem, ExtendedMUIColor } from '@/types/common.types'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useTranslation } from 'react-i18next'

type ActionMenuProps = {
  actions: Array<ActionItem>
  iconColor?: ExtendedMUIColor
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ actions, iconColor = 'primary' }) => {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const compositionButtonId = useId() + '-composition-button'
  const compositionMenuId = useId() + '-composition-menu'
  const { t } = useTranslation('shared-components', { keyPrefix: 'actionMenu' })

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open)
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <>
      <IconButton
        ref={anchorRef}
        id={compositionButtonId}
        sx={{ visibility: actions.length > 0 ? 'visible' : 'hidden' }}
        aria-controls={open ? compositionMenuId : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        aria-label={t('iconButtonAriaLabel')}
      >
        <MoreVertIcon color={iconColor} fontSize="small" />
      </IconButton>
      <ClickAwayListener onClickAway={handleClose}>
        <Menu
          open={open}
          id={compositionMenuId}
          anchorEl={anchorRef.current}
          aria-labelledby={compositionButtonId}
          onClose={handleClose}
          onKeyDown={handleListKeyDown}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {actions.map(({ label, action }) => (
            <MenuItem
              key={label}
              onClick={(e) => {
                action()
                handleClose(e)
              }}
            >
              {label}
            </MenuItem>
          ))}
        </Menu>
      </ClickAwayListener>
    </>
  )
}

export const ActionMenuSkeleton: React.FC = () => {
  return (
    <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
      <Skeleton variant="rectangular" sx={{ my: 1, mx: 2 }} width={4} />
    </Box>
  )
}
