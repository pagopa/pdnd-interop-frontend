import React from 'react'
import renderer from 'react-test-renderer'
import { noop } from 'lodash'
import { StyledTableRow } from '../StyledTableRow'

const cellData = [{ label: 'Mario' }, { label: 'Rossi' }, { label: 'rejsedf3-re4k-rew2-eoer' }]
const singleActionBtn = { label: 'Ispeziona', to: '/rotta-esempio' }
const actions = [
  { onClick: noop, label: 'Azione 1' },
  { onClick: noop, label: 'Azione 2' },
]

describe('Snapshot', () => {
  it('matches row without actions', () => {
    const component = renderer.create(<StyledTableRow cellData={cellData} index={0} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches row with single action button', () => {
    const component = renderer.create(
      <StyledTableRow cellData={cellData} index={0} singleActionBtn={singleActionBtn} />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches row with single action button and action list button', () => {
    const component = renderer.create(
      <StyledTableRow
        cellData={cellData}
        index={0}
        singleActionBtn={singleActionBtn}
        actions={actions}
      />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
