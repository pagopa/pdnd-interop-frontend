import type { routes } from '@/router/routes'
import type { LangCode } from '@/types/common.types'
import type { UserProductRole } from '@/types/party.types'
import type { NavigateOptions } from 'react-router-dom'

export type RouteKey = keyof typeof routes
export type ExtractRouteParams<T> = string extends T
  ? Record<string, string>
  : T extends `${infer _Start}:${infer Param}/${infer Rest}`
  ? { [k in Param | keyof ExtractRouteParams<Rest>]: string }
  : T extends `${infer _Start}:${infer Param}`
  ? { [k in Param]: string }
  : undefined

export type RouteParams<T extends RouteKey> = ExtractRouteParams<(typeof routes)[T]['PATH']['it']>

type UrlParams = Record<string, string>

export type GetRouteUrl = <T extends RouteKey>(
  route: T,
  ...config: RouteParams<T> extends undefined
    ? [{ urlParams?: UrlParams }] | []
    : [{ params: RouteParams<T> } & { urlParams?: UrlParams }]
) => string

type ExtendedNavigateOptions = NavigateOptions & { urlParams?: UrlParams }

export type Navigate = <T extends RouteKey>(
  route: T,
  ...config: RouteParams<T> extends undefined
    ? [ExtendedNavigateOptions] | []
    : [{ params: RouteParams<T> } & ExtendedNavigateOptions]
) => void

export type RouteAuthLevel = Readonly<Array<UserProductRole>>

export type LocalizedRoute = Readonly<{
  PATH: Record<LangCode, string>
  LABEL: Record<LangCode, string>
  COMPONENT: React.FC
  PUBLIC: boolean
  AUTH_LEVELS: RouteAuthLevel
}>

export type LocalizedRoutes = Readonly<Record<string, LocalizedRoute>>
