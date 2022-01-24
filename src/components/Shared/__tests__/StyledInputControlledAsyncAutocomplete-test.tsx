import React from 'react'
import { useForm } from 'react-hook-form'
import renderer from 'react-test-renderer'
import { ApiEndpointKey } from '../../../../types'
import { StyledInputControlledAsyncAutocomplete } from '../StyledInputControlledAsyncAutocomplete'

describe('Snapshot', () => {
  it('matches', () => {
    function AsyncAutocomplete() {
      const {
        control,
        formState: { errors },
      } = useForm()

      const props = {
        label: 'Snapshot autocomplete',
        name: 'autocomplete',
        defaultValue: null,
        errors,
        control,
        labelKey: 'name',
        placeholder: '...',
        rules: {},
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
