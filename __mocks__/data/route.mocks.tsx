import { createMockFactory } from '@/utils/testing.utils'
import React from 'react'

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
