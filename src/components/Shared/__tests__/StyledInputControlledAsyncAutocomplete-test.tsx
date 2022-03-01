import React from 'react'
import renderer from 'react-test-renderer'
import noop from 'lodash/noop'
import { ApiEndpointKey, Party } from '../../../../types'
import { StyledInputControlledAsyncAutocomplete } from '../StyledInputControlledAsyncAutocomplete'

describe('Snapshot', () => {
  it.only('matches', () => {
    function AsyncAutocomplete() {
      const props = {
        label: 'Snapshot autocomplete',
        name: 'autocomplete',
        defaultValue: null,
        placeholder: '...',
        onChange: noop,
        path: { endpoint: 'ONBOARDING_GET_AVAILABLE_PARTIES' as ApiEndpointKey },
        transformKey: 'institutions',
        transformFn: (data: Array<Party>) => data,
        getOptionLabel: (option: Party) => (option ? option.description : ''),
        isOptionEqualToValue: (option: Party, value: Party) => option.id === value.id,
      }
      return <StyledInputControlledAsyncAutocomplete {...props} />
    }

    const component = renderer.create(<AsyncAutocomplete />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
