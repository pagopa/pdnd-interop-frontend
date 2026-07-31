import { renderWithApplicationContext } from '@/utils/testing.utils'
import { screen } from '@testing-library/react'
import type { NoDataBoxProps } from '../components/NoDataBox'
import NoDataBox from '../components/NoDataBox'

const renderComponent = () => {
  const props: NoDataBoxProps = {
    label: 'No data available',
  }
  return renderWithApplicationContext(<NoDataBox {...props} />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

describe('DialogCancelVersionArchiving', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the provided label', () => {
    renderComponent()
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })
})
