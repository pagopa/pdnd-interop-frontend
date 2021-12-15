import { getKeys } from '../array-utils'

it('Object returns keys array', () => {
  expect(getKeys({ a: 1, b: 2 })).toEqual(['a', 'b'])
})
