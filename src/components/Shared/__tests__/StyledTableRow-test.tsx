import React from 'react'
import renderer from 'react-test-renderer'
import { noop } from 'lodash'
import { createMemoryHistory } from 'history'
import { StyledTableRow } from '../StyledTableRow'
import { StyledButton } from '../StyledButton'
import { AllTheProviders } from '../../../__mocks__/providers'
import { ActionMenu } from '../ActionMenu'

const cellData = [{ label: 'Mario' }, { label: 'Rossi' }, { label: 'rejsedf3-re4k-rew2-eoer' }]
const singleActionLink = { label: 'Ispeziona', to: '/rotta-esempio' }
const actions = [
  { onClick: noop, label: 'Azione 1' },
  { onClick: noop, label: 'Azione 2' },
]

describe('Snapshot', () => {
  it('matches row without actions', () => {
    const component = renderer.create(<StyledTableRow cellData={cellData} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches row with single action button', () => {
    const history = createMemoryHistory()
    const component = renderer.create(
      <AllTheProviders defaultHistory={history}>
        <StyledTableRow cellData={cellData}>
          <StyledButton
            onClick={() => {
              history.push(singleActionLink.to)
            }}
          >
            {singleActionLink.label}
          </StyledButton>
        </StyledTableRow>
      </AllTheProviders>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches row with single action button and action list button', () => {
    const history = createMemoryHistory()
    const component = renderer.create(
      <AllTheProviders defaultHistory={history}>
        <StyledTableRow cellData={cellData}>
          <StyledButton
            onClick={() => {
              history.push(singleActionLink.to)
            }}
          >
            {singleActionLink.label}
          </StyledButton>
        </StyledTableRow>

        <ActionMenu actions={actions} />
      </AllTheProviders>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
