import React, { FunctionComponent, useContext, useRef, useState } from 'react'
import { MoreVert as MoreVertIcon } from '@mui/icons-material'
import { StyledButton } from './StyledButton'
import { Menu, MenuItem } from '@mui/material'
import { ActionProps } from '../../../types'
import { TableActionMenuContext } from '../../lib/context'
import uniqueString from 'unique-string'
import { Box } from '@mui/system'

type ActionMenuProps = {
  actions: Array<ActionProps>
}

export const ActionMenu: FunctionComponent<ActionMenuProps> = ({ actions }) => {
  // Needs to be state to avoid it changing on rerender
  const [id] = useState(uniqueString())
  const anchorRef = useRef() as React.MutableRefObject<HTMLSpanElement>
  const anchorId = `basic-button-${id}`
  const menuId = `basic-menu-${id}`
  const { tableActionMenu, setTableActionMenu } = useContext(TableActionMenuContext)
  const open = Boolean(tableActionMenu !== null && tableActionMenu === anchorId)

  const handleClick = (event: React.SyntheticEvent) => {
    event.stopPropagation()
    event.preventDefault()
    setTableActionMenu(event.currentTarget.id)
  }
  const handleClose = () => {
    setTableActionMenu(null)
  }

  if (!Boolean(actions.length > 0)) {
    // Used to keep the buttons visually aligned in case there is no ActionMenu
    return <Box component="span" sx={{ width: 75, display: 'inline-block' }} />
  }

  return (
    <React.Fragment>
      <StyledButton
        id={anchorId}
        aria-controls={menuId}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <span ref={anchorRef}>
          <MoreVertIcon color="primary" />
        </span>
      </StyledButton>

      <Menu
        id={menuId}
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {actions.map(({ onClick, label, isMock }, i) => {
          return (
            <MenuItem key={i} onClick={onClick} className={`${isMock ? 'mockFeature' : ''}`}>
              {label}
            </MenuItem>
          )
        })}
      </Menu>
    </React.Fragment>
  )
}
