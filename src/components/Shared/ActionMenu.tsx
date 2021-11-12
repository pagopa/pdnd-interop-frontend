import React, { FunctionComponent, useContext, useRef } from 'react'
import { MoreVert as MoreVertIcon } from '@mui/icons-material'
import { StyledButton } from './StyledButton'
import { Menu, MenuItem } from '@mui/material'
import { ActionProps } from '../../../types'
import { TableActionMenuContext } from '../../lib/context'

type ActionMenuProps = {
  actions: ActionProps[]
  index: number
}

export const ActionMenu: FunctionComponent<ActionMenuProps> = ({ actions, index }) => {
  const anchorRef = useRef()
  const anchorId = `basic-button-${index}`
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
    return null
  }

  return (
    <React.Fragment>
      <StyledButton
        ref={anchorRef}
        id={anchorId}
        aria-controls={`basic-menu-${index}`}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon color="primary" />
      </StyledButton>

      <Menu
        id={`basic-menu-${index}`}
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
