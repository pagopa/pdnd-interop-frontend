import React from 'react'
import renderer from 'react-test-renderer'
import { TableWithLoader } from '../TableWithLoader'
import { AxiosError } from 'axios'
import { StyledTableRow } from '../StyledTableRow'
import noop from 'lodash/noop'
import { createMemoryHistory } from 'history'
import { AllTheProviders } from '../../../__mocks__/providers'
import { ActionMenu } from '../ActionMenu'
import { StyledButton } from '../StyledButton'
import { axiosErrorToError } from '../../../lib/error-utils'

type ExampleDatum = {
  name: string
  surname: string
  id: string
}
const headData = ['Nome', 'Cognome', '']
const rawData: Array<ExampleDatum> = [
  { name: 'Mario', surname: 'Rossi', id: 'rejsedf3-re4k-rew2-eoer' },
  { name: 'Teresa', surname: 'Verdi', id: 'dosf0i23-jkds-32jd-23rj' },
]

describe('Snapshot', () => {
  it('matches error', () => {
    const error: AxiosError = {
      isAxiosError: true,
      config: {},
      name: '',
      message: '',
      toJSON: () => ({}),
    }
    const component = renderer.create(
      <TableWithLoader loadingText={null} headData={headData} error={axiosErrorToError(error)} />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches loading', () => {
    const component = renderer.create(
      <TableWithLoader loadingText="Sto caricando..." headData={headData} />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches table without actions', () => {
    const getTableRow = (item: ExampleDatum, i: number) => (
      <StyledTableRow key={i} cellData={[{ label: item.name }, { label: item.surname }]} />
    )
    const component = renderer.create(
      <TableWithLoader loadingText={null} headData={headData}>
        {rawData.map((item, i) => getTableRow(item, i))}
      </TableWithLoader>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches table with single action button', () => {
    const history = createMemoryHistory()

    const getTableRow = (item: ExampleDatum, i: number) => (
      <StyledTableRow key={i} cellData={[{ label: item.name }, { label: item.surname }]}>
        <StyledButton
          onClick={() => {
            history.push(`/user/${item.id}`)
          }}
        >
          Ispeziona
        </StyledButton>
      </StyledTableRow>
    )
    const component = renderer.create(
      <AllTheProviders defaultHistory={history}>
        <TableWithLoader loadingText={null} headData={headData}>
          {rawData.map((item, i) => getTableRow(item, i))}
        </TableWithLoader>
      </AllTheProviders>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches table with single action button and action list button', () => {
    const history = createMemoryHistory()

    const getTableRow = (item: ExampleDatum, i: number) => (
      <StyledTableRow key={i} cellData={[{ label: item.name }, { label: item.surname }]}>
        <StyledButton
          onClick={() => {
            history.push(`/user/${item.id}`)
          }}
        >
          Ispeziona
        </StyledButton>
        <ActionMenu
          actions={[
            { onClick: noop, label: 'Azione 1' },
            { onClick: noop, label: 'Azione 2' },
          ]}
          snapshotTestInternalId="1"
        />
      </StyledTableRow>
    )
    const component = renderer.create(
      <AllTheProviders defaultHistory={history}>
        <TableWithLoader loadingText={null} headData={headData}>
          {rawData.map((item, i) => getTableRow(item, i))}
        </TableWithLoader>
      </AllTheProviders>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
