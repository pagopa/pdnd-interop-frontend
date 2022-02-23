import React from 'react'
import renderer from 'react-test-renderer'
import { createMemoryHistory, History } from 'history'
import { AllTheProviders } from '../../../__mocks__/providers'
import { StyledBreadcrumbs } from '../StyledBreadcrumbs'
import { getDecoratedRoutes } from '../../../lib/router-utils'

function takeSnapshot(history: History<unknown>) {
  const component = renderer.create(
    <AllTheProviders defaultHistory={history}>
      <StyledBreadcrumbs />
    </AllTheProviders>
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
}

describe('Snapshot', () => {
  it('matches empty component', () => {
    const history = createMemoryHistory()
    takeSnapshot(history)
  })

  it('matches empty component', () => {
    const allRoutes = getDecoratedRoutes()
    const routes = allRoutes['it']
    const history = createMemoryHistory()
    history.push(routes.PROVIDE.PATH) // Push first level route
    takeSnapshot(history)
  })

  it('matches breadcrumbs', () => {
    const allRoutes = getDecoratedRoutes()
    const routes = allRoutes['it']
    const history = createMemoryHistory()
    history.push(routes.PROVIDE_AGREEMENT_LIST.PATH)
    takeSnapshot(history)
  })

  it('matches breadcrumbs', () => {
    const allRoutes = getDecoratedRoutes()
    const routes = allRoutes['it']
    const history = createMemoryHistory()
    history.push(routes.PROVIDE_ESERVICE_CREATE.PATH)
    takeSnapshot(history)
  })
})
