import React from 'react'
import renderer from 'react-test-renderer'
import { noop } from 'lodash'
import { ApiEndpointKey } from '../../../../types'
import { StyledInputControlledAsyncAutocomplete } from '../StyledInputControlledAsyncAutocomplete'

describe('Snapshot', () => {
  it.only('matches', () => {
    function AsyncAutocomplete() {
      const props = {
        label: 'Snapshot autocomplete',
        name: 'autocomplete',
        defaultValue: null,
        labelKey: 'name',
        placeholder: '...',
        onChange: noop,
        path: { endpoint: 'ONBOARDING_GET_AVAILABLE_PARTIES' as ApiEndpointKey },
        transformFn: (data: Record<string, unknown>) =>
          data.values as Array<Record<string, unknown>>,
      }
      return <StyledInputControlledAsyncAutocomplete {...props} />
    }

    const component = renderer.create(<AsyncAutocomplete />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
