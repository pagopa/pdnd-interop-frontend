import React, { FunctionComponent, useContext, useRef, useState } from 'react'
import { MoreVert as MoreVertIcon } from '@mui/icons-material'
import { Menu, MenuItem, Box } from '@mui/material'
import { ActionProps, ExtendedMUIColor } from '../../../types'
import { TableActionMenuContext } from '../../lib/context'
import { ButtonNaked } from '@pagopa/mui-italia'
import { v4 as uuidv4 } from 'uuid'

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

const ActionMenuComponent: FunctionComponent<ActionMenuProps> = ({
  actions,
  onOpen,
  onClose,
  openMenuId,
  snapshotTestInternalId,
  iconColor = 'primary',
}) => {
  // Needs to be state to avoid it changing on rerender
  const [id] = useState(snapshotTestInternalId || uuidv4())
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
    return <Box component="span" sx={{ width: 23, display: 'inline-block' }} />
  }

  return (
    <React.Fragment>
      <ButtonNaked
        id={anchorId}
        aria-controls={menuId}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ display: 'inline-flex' }}
      >
        <span ref={anchorRef} style={{ display: 'flex' }}>
          <MoreVertIcon color={iconColor} fontSize="small" />
        </span>
      </ButtonNaked>

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
