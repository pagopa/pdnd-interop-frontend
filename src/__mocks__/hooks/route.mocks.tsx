import React from 'react'
import { createMockFactory } from '../mock.utils'

export const mockUseCurrentRoute = createMockFactory({
  routeKey: 'pathname',
  route: {
    PATH: { it: 'percorso', en: 'path' },
    LABEL: { it: 'Percorso', en: 'Path' },
    COMPONENT: <div>test</div>,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api', 'security'],
  },
  isUserAuthorized: true,
  mode: null,
  isPublic: false,
  isEditPath: false,
  isRouteInCurrentSubtree: false,
})
