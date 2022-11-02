import React from 'react'
import { Button, ButtonProps, Link as MUILink, LinkProps as MUILinkProps } from '@mui/material'
import { Link, NavigateOptions } from 'react-router-dom'
import useNavigateRouter from '../hooks/useNavigateRouter'
import { RouteKey, RouteParams } from '../types'
import omit from 'lodash/omit'

type RouterLinkProps<T extends RouteKey> =
  | { to: T; params?: RouteParams<T>; options?: NavigateOptions } & (
      | ({ as?: 'link' } & Omit<MUILinkProps<typeof Link>, 'component' | 'to'>)
      | ({ as: 'button'; children: React.ReactNode } & Omit<ButtonProps, 'onClick'>)
    )

const RouterLink = React.forwardRef(function _RouterLink<T extends RouteKey>(
  props: RouterLinkProps<T>,
  ref: React.Ref<HTMLAnchorElement> | React.Ref<HTMLButtonElement>
) {
  const { getRouteUrl, navigate } = useNavigateRouter()

  if (props.as === 'button') {
    const handleClick = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      navigate(props.to, { params: props.params, ...props?.options })
    }

    return (
      <Button
        ref={ref as React.Ref<HTMLButtonElement>}
        {...omit(props, ['to', 'params', 'as', 'children'])}
        onClick={handleClick}
      >
        {props.children}
      </Button>
    )
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const url = getRouteUrl(props.to, props?.params)
  return (
    <MUILink
      ref={ref as React.Ref<HTMLAnchorElement>}
      {...omit(props, ['to', 'params', 'as'])}
      component={Link}
      to={url}
    ></MUILink>
  )
})

export default RouterLink
