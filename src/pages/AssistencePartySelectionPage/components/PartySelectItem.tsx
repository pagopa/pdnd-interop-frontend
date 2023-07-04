import React from 'react'
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  type ListItemProps,
  ListItemText,
} from '@mui/material'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

type PartySelectItemProps = {
  component?: React.ElementType
  onClick?: VoidFunction
} & ListItemProps

export const PartySelectItem: React.FC<PartySelectItemProps> = ({
  onClick,
  component,
  ...listItemProps
}) => {
  const Wrapper = onClick ? ListItemButton : React.Fragment

  return (
    <ListItem
      /**
       * For some reason the `component` prop is not recognized by TypeScript
       * even if it's a valid prop of ListItem component.
       * See https://github.com/mui/material-ui/blob/master/packages/mui-material/src/ListItem/ListItem.js#L180
       */
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      component={component}
      disablePadding
      {...listItemProps}
    >
      <Wrapper onClick={onClick} sx={{ borderRadius: 1 }}>
        <ListItemAvatar>
          <Avatar sx={{ width: 48, height: 48, bgcolor: 'white', border: 1 }}>
            <AccountBalanceIcon sx={{ color: '#bdbdbd' }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Agenzia delle Entrate" secondary="Amministratore" />
      </Wrapper>
    </ListItem>
  )
}
