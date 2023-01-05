import { getLocalizedPath } from '@/router/router.utils'

describe('checks router utils functions behavior', () => {
  it('checks that getLocalizedPath returns the right string', () => {
    const result = getLocalizedPath('PROVIDE', 'it')

    expect(result).toEqual('')
  })
})
