import React, { FunctionComponent, useContext, useRef, useState } from 'react'
import { MoreVert as MoreVertIcon } from '@mui/icons-material'
import { StyledButton } from './StyledButton'
import { Menu, MenuItem } from '@mui/material'
import { ActionProps, ExtendedMUIColor } from '../../../types'
import { TableActionMenuContext } from '../../lib/context'
import { Box } from '@mui/system'

type ActionMenuProps = {
  // The list of actions to display in the menu
  actions: Array<ActionProps>
  onOpen: (id: string) => void
  onClose: VoidFunction
  // The id of the menu currently clicked. In a table there may be many of them,
  // but only one is open at a time (or none, if the value is null)
  openMenuId: string | null
  // Only used for snapshot tests, to have a stable id
  snapshotTestInternalId?: string
  iconColor?: ExtendedMUIColor
}

export const ActionMenu: FunctionComponent<
  Omit<ActionMenuProps, 'onOpen' | 'onClose' | 'openMenuId'>
> = (props) => {
  const { tableActionMenu, setTableActionMenu } = useContext(TableActionMenuContext)

  const onOpen = (id: string) => {
    setTableActionMenu(id)
  }

  const onClose = () => {
    setTableActionMenu(null)
  }

  return (
    <ActionMenuComponent
      {...props}
      onOpen={onOpen}
      onClose={onClose}
      openMenuId={tableActionMenu}
    />
  )
}

// From https://stackoverflow.com/a/1349426
function uniqueString(length: number) {
  let result = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const ActionMenuComponent: FunctionComponent<ActionMenuProps> = ({
  actions,
  onOpen,
  onClose,
  openMenuId,
  snapshotTestInternalId,
  iconColor = 'primary',
}) => {
  // Needs to be state to avoid it changing on rerender
  const [id] = useState(snapshotTestInternalId || uniqueString(8))
  const anchorRef = useRef() as React.MutableRefObject<HTMLSpanElement>
  const anchorId = `basic-button-${id}`
  const menuId = `basic-menu-${id}`
  const open = Boolean(openMenuId !== null && openMenuId === anchorId)

  const handleClick = (event: React.SyntheticEvent) => {
    event.stopPropagation()
    event.preventDefault()
    onOpen(event.currentTarget.id)
  }

  if (!Boolean(actions.length > 0)) {
    // Used to keep the buttons visually aligned in case there is no ActionMenu
    return <Box component="span" sx={{ width: 70, display: 'inline-block' }} />
  }

  return (
    <React.Fragment>
      <StyledButton
        id={anchorId}
        aria-controls={menuId}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color={iconColor}
      >
        <span ref={anchorRef}>
          <MoreVertIcon color="inherit" fontSize="small" />
        </span>
      </StyledButton>

      <Menu
        id={menuId}
        anchorEl={anchorRef.current}
        open={open}
        onClose={onClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {actions.map(({ onClick, label }, i) => {
          return (
            <MenuItem key={i} onClick={onClick}>
              {label}
            </MenuItem>
          )
        })}
      </Menu>
    </React.Fragment>
  )
}
