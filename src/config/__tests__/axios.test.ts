import { describe, expect, it } from 'vitest'
import axiosInstance from '../axios'

describe('axios params serializer', () => {
  it('URL-encodes reserved characters in query params while preserving comma-separated arrays', () => {
    const uri = axiosInstance.getUri({
      url: '/catalog',
      params: {
        q: '% & "\'',
        states: ['PUBLISHED', undefined, null, 'DRAFT'],
        eserviceIds: [undefined],
        offset: 0,
        empty: '',
        omitted: undefined,
      },
    })

    expect(uri).toBe(
      '/catalog?q=%25%20%26%20%22%27&states=PUBLISHED,DRAFT&eserviceIds=&offset=0&empty='
    )
  })
})
