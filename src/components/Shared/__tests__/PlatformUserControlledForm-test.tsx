import React from 'react'
import { useForm } from 'react-hook-form'
import renderer from 'react-test-renderer'
import { PlatformUserControlledForm } from '../PlatformUserControlledForm'

describe('Snapshot', () => {
  it('matches', () => {
    const UserForm = () => {
      const {
        control,
        formState: { errors },
      } = useForm()

      return <PlatformUserControlledForm prefix="operator" control={control} errors={errors} />
    }

    const component = renderer.create(<UserForm />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
