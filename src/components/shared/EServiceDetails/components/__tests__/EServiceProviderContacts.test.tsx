import React from 'react'
import { render } from '@testing-library/react'
import { EServiceProviderContacts } from '../EServiceProviderContacts'
import { mockEServiceDetailsContext } from './test.commons'
import { createMockEServiceDescriptorCatalog } from '@/../__mocks__/data/eservice.mocks'

describe('EServiceProviderContacts', () => {
  it('should match the snapshot', () => {
    mockEServiceDetailsContext({
      descriptor: createMockEServiceDescriptorCatalog({
        eservice: {
          mail: {
            address: 'mail@example.com',
            description: "mail's description",
          },
        },
      }),
    })

    const { baseElement } = render(<EServiceProviderContacts />)
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot without description', () => {
    mockEServiceDetailsContext({
      descriptor: createMockEServiceDescriptorCatalog({
        eservice: {
          mail: {
            address: 'mail@example.com',
          },
        },
      }),
    })

    const { baseElement } = render(<EServiceProviderContacts />)
    expect(baseElement).toMatchSnapshot()
  })

  it('should not render if the email is falsy', () => {
    mockEServiceDetailsContext({
      descriptor: createMockEServiceDescriptorCatalog({
        eservice: {
          mail: undefined,
        },
      }),
    })

    const { container } = render(<EServiceProviderContacts />)
    expect(container).toBeEmptyDOMElement()
  })
})
