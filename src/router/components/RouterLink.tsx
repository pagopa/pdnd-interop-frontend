import React from 'react'
import { Button, ButtonProps, Link as MUILink, LinkProps as MUILinkProps } from '@mui/material'
import { Link, NavigateOptions, useNavigate } from 'react-router-dom'
import useNavigateRouter from '../hooks/useNavigateRouter'
import { RouteKey, RouteParams } from '../types'
import omit from 'lodash/omit'

interface RouterLinkOptions extends NavigateOptions {
  urlParams: Record<string, string>
}

type RouterLinkProps<T extends RouteKey> =
  | { to: T; params?: RouteParams<T>; options?: RouterLinkOptions } & (
      | ({ as?: 'link' } & Omit<MUILinkProps<typeof Link>, 'component' | 'to'>)
      | ({ as: 'button'; children: React.ReactNode } & Omit<ButtonProps, 'onClick'>)
    )

const RouterLink = React.forwardRef(function _RouterLink<T extends RouteKey>(
  props: RouterLinkProps<T>,
  ref: React.Ref<HTMLAnchorElement> | React.Ref<HTMLButtonElement>
) {
  const { getRouteUrl } = useNavigateRouter()
  const navigate = useNavigate()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  let url = getRouteUrl(props.to, { params: props?.params })

  if (props.options?.urlParams) {
    url = `${url}?${new URLSearchParams(props.options.urlParams).toString()}`
  }

  if (props.as === 'button') {
    const handleClick = () => {
      navigate(url)
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
