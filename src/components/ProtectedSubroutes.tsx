import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { AuthGuard } from './AuthGuard'
import { RouteConfig } from '../../types'

type SubroutingProps = {
  subroutes: Array<RouteConfig>
  rootRedirect?: string
  parentPath?: string
}

export function ProtectedSubroutes({ parentPath, subroutes, rootRedirect }: SubroutingProps) {
  return (
    <Routes>
      {subroutes.map(({ element: Component, render = true, config, name, path, children }, i) => {
        const shouldRedirect = children || !render
        const redirectToFirstChild = shouldRedirect ? Object.values(children!)[0].path : undefined

        return (
          <Route
            key={i}
            path={shouldRedirect ? `${path}/*` : path}
            element={
              <AuthGuard {...config}>
                {render && <Component />}
                {children && (
                  <ProtectedSubroutes
                    parentPath="/"
                    subroutes={Object.values(children)}
                    rootRedirect={redirectToFirstChild}
                  />
                )}
              </AuthGuard>
            }
          />
        )
      })}

      {rootRedirect && <Route path={parentPath} element={<Navigate to={rootRedirect} />} />}
    </Routes>
  )
}
