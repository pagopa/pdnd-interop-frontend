import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { AuthGuard } from './AuthGuard'
import { RouteConfig } from '../../types'

type SubroutingProps = {
  subroutes: Array<RouteConfig>
  rootRedirect?: string
}

export function ProtectedSubroutes({ subroutes, rootRedirect }: SubroutingProps) {
  return (
    <Routes>
      {subroutes.map(({ element: Component, render = true, config, label, path, children }, i) => {
        const redirectToFirstChild =
          !render && children ? Object.values(children)[0].path : undefined

        return (
          <Route
            key={i}
            path={children || !render ? `${path}/*` : path}
            element={
              <AuthGuard {...config}>
                {render && <Component />}
                {children && (
                  <ProtectedSubroutes
                    subroutes={Object.values(children)}
                    rootRedirect={redirectToFirstChild}
                  />
                )}
              </AuthGuard>
            }
          />
        )
      })}

      {rootRedirect && <Route path="/" element={<Navigate to={rootRedirect} />} />}
    </Routes>
  )
}
