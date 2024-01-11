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
import type { CompactTenant } from '@/api/api.generatedTypes'
import { useTranslation } from 'react-i18next'

type TenantSelectItemProps = {
  component?: React.ElementType
  tenant: CompactTenant
  onClick?: VoidFunction
} & ListItemProps

export const TenantSelectItem: React.FC<TenantSelectItemProps> = ({
  onClick,
  component,
  tenant,
  ...listItemProps
}) => {
  const { t } = useTranslation('common')

  const Wrapper = onClick
    ? ({ children }: { children: React.ReactNode }) => (
        <ListItemButton onClick={onClick} sx={{ borderRadius: 1 }}>
          {children}
        </ListItemButton>
      )
    : React.Fragment

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
      <Wrapper>
        <ListItemAvatar>
          <Avatar sx={{ width: 48, height: 48, bgcolor: 'white', border: 1 }} src={tenant?.logoUrl}>
            <AccountBalanceIcon sx={{ color: '#bdbdbd' }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={tenant.name} secondary={t('userProductRole.admin')} />
      </Wrapper>
    </ListItem>
  )
}
