import React from 'react'
import type { SelfcareInstitution } from '@/api/api.generatedTypes'
import { getPartyList, getProductList, Header } from '../Header'
import type { TFunction } from 'i18next'
import {
  createMockPartySwitchItem,
  createMockProductSwitchItem,
  createMockSelfcareInsitution,
} from '@/../__mocks__/data/selfcare.mocks'
import { createMockJwtUser } from '@/../__mocks__/data/user.mocks'
import { HeaderProduct, type ProductSwitchItem } from '@pagopa/mui-italia'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import * as useErrorData from '@/stores/error-data.store'
import userEvent from '@testing-library/user-event'
import { assistanceLink } from '@/config/constants'
import { FE_LOGIN_URL, SELFCARE_BASE_URL } from '@/config/env'
import type { Mock } from 'vitest'
import type { PartySwitchItem } from '@pagopa/mui-italia/dist/components/PartySwitch'

// Functions and component mocks
const mockTFunction = (key: string) => key

const spyUseErrorData = vi.spyOn(useErrorData, 'useErrorData')

vi.mock('@pagopa/mui-italia', () => {
  return {
    theme: vi.fn(),
    CopyToClipboardButton: vi.fn(),
    HeaderAccount: ({
      onLogin,
      onAssistanceClick,
    }: {
      onLogin?: () => void
      onAssistanceClick?: () => void
    }) => (
      <div>
        <button data-testid="test-login" onClick={() => onLogin && onLogin()}>
          test-login
        </button>
        <button
          data-testid="test-assistance"
          onClick={() => onAssistanceClick && onAssistanceClick()}
        >
          test-assistance
        </button>
      </div>
    ),
    HeaderProduct: vi.fn(),
  }
})

const mockHeaderProduct = (
  partySwitchItem: PartySwitchItem,
  productSwitchItem: ProductSwitchItem
) => {
  vi.mocked(HeaderProduct).mockImplementation(({ onSelectedParty, onSelectedProduct }) => (
    <div>
      <button
        data-testid="test-selectedParty"
        onClick={() => onSelectedParty && onSelectedParty(partySwitchItem)}
      >
        test-selectedParty
      </button>
      <button
        data-testid="test-selectedProduct"
        onClick={() => onSelectedProduct && onSelectedProduct(productSwitchItem)}
      >
        test-selectedProduct
      </button>
    </div>
  ))
}

// useQuery mock
vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useQuery: vi.fn(),
}))

import { useQuery } from '@tanstack/react-query'

const mockUseGetData = (data: {
  partiesData: Array<SelfcareInstitution>
  productsData: Array<{ id: string; name: string }>
}) => {
  const mock = ({ queryKey }: { queryKey: string }) => {
    if (queryKey[0] === 'SelfcareGetPartyList') {
      return { data: data.partiesData }
    }
    if (queryKey[0] === 'SelfcareGetProducts') {
      return { data: data.productsData }
    }
  }

  ;(useQuery as Mock).mockImplementation(mock)
}

// Mock data
const mockProducts: Array<{ id: string; name: string }> = [
  { id: 'idTest1', name: `nameTest1` },
  { id: 'idTest2', name: `nameTest2` },
]

const mockParties: Array<SelfcareInstitution> = [
  createMockSelfcareInsitution({
    id: 'id1',
    description: 'description1',
    parent: 'parent1',
    userProductRoles: ['admin'],
  }),
  createMockSelfcareInsitution({
    id: 'id2',
    description: 'description2',
    parent: 'parent2',
    userProductRoles: ['security', 'api'],
  }),
]

describe('Header', () => {
  it('getPartyList should return an Array of PartySwitchItem', () => {
    const result = getPartyList(mockParties, undefined, mockTFunction as TFunction<'common'>)

    expect(result).toStrictEqual([
      {
        id: 'id1',
        name: 'description1',
        productRole: 'userProductRole.admin',
        parentName: 'parent1',
      },
      {
        id: 'id2',
        name: 'description2',
        productRole: 'userProductRole.security, userProductRole.api',
        parentName: 'parent2',
      },
    ])
  })

  it('getPartyList should return an Array of PartySwitchItem with the jwt PartySwitchItem', () => {
    const jwtMock = createMockJwtUser({
      organization: {
        name: 'orgName',
        roles: [{ role: 'admin' }],
      },
    })

    const result = getPartyList(mockParties, jwtMock, mockTFunction as TFunction<'common'>)

    expect(result).toStrictEqual([
      {
        id: 'id1',
        name: 'description1',
        productRole: 'userProductRole.admin',
        parentName: 'parent1',
      },
      {
        id: 'id2',
        name: 'description2',
        productRole: 'userProductRole.security, userProductRole.api',
        parentName: 'parent2',
      },
      {
        id: jwtMock.selfcareId,
        name: 'orgName',
        productRole: 'userProductRole.admin',
        parentName: jwtMock.rootParent?.description,
      },
    ])
  })

  it('getPartyList should return an Array of PartySwitchItem with only the jwt PartySwitchItem', () => {
    const jwtMock = createMockJwtUser({
      organization: {
        name: 'orgName',
        roles: [{ role: 'admin' }],
      },
    })

    const mockParties: Array<SelfcareInstitution> = []

    const result = getPartyList(mockParties, jwtMock, mockTFunction as TFunction<'common'>)

    expect(result).toStrictEqual([
      {
        id: jwtMock.selfcareId,
        name: jwtMock.organization.name,
        productRole: 'userProductRole.admin',
        parentName: jwtMock.rootParent?.description,
      },
    ])
  })

  it('getPartyList should return a void array', () => {
    const mockParties: Array<SelfcareInstitution> = []

    const result = getPartyList(mockParties, undefined, mockTFunction as TFunction<'common'>)

    expect(result).toStrictEqual([])
  })

  it('getProductList should return an array with only interop and selfcare products if products is undefined (considering STAGE === DEV)', () => {
    const mockSelfcareProduct = createMockProductSwitchItem({
      id: 'selfcare',
      title: 'Area Riservata',
    })

    const mockInteropProduct = createMockProductSwitchItem({
      id: 'prod-interop',
      title: `Interoperabilità`,
    })

    const products = undefined
    const result = getProductList(products)

    expect(result).toStrictEqual([mockSelfcareProduct, mockInteropProduct])
  })

  it('getProductList should return an array with only interop and selfcare products if products is a void array (considering STAGE === DEV)', () => {
    const mockSelfcareProduct = createMockProductSwitchItem({
      id: 'selfcare',
      title: 'Area Riservata',
    })

    const mockInteropProduct = createMockProductSwitchItem({
      id: 'prod-interop',
      title: `Interoperabilità`,
    })

    const products: Array<{ id: string; name: string }> = []
    const result = getProductList(products)

    expect(result).toStrictEqual([mockSelfcareProduct, mockInteropProduct])
  })

  it('getProductList should return an array with only interop and selfcare products if products is populated (considering STAGE === DEV)', () => {
    const mockSelfcareProduct = createMockProductSwitchItem({
      id: 'selfcare',
      title: 'Area Riservata',
    })

    const result = getProductList(mockProducts)

    expect(result).toStrictEqual([
      mockSelfcareProduct,
      { id: 'idTest1', title: `nameTest1`, productUrl: '', linkType: 'internal' },
      { id: 'idTest2', title: `nameTest2`, productUrl: '', linkType: 'internal' },
    ])
  })

  it('Header goToAssistance action should return the correct url if there is no correlationId', async () => {
    const jwtMock = createMockJwtUser()

    mockUseGetData({
      partiesData: mockParties,
      productsData: mockProducts,
    })

    const spyWindowOpen = vi.spyOn(window, 'open')

    spyUseErrorData.mockReturnValue({
      correlationId: null,
      errorCode: null,
      timeoutId: null,
      setErrorData: vi.fn(),
      clearErrorData: vi.fn(),
    })

    const screen = renderWithApplicationContext(<Header jwt={jwtMock} />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    const assistanceButton = screen.getByRole('button', { name: 'test-assistance' })

    const user = userEvent.setup()
    await user.click(assistanceButton)

    expect(spyWindowOpen).toHaveBeenCalledTimes(1)
    expect(spyWindowOpen).toHaveBeenCalledWith(assistanceLink, '_blank')
  })

  it('Header goToAssistance action should return the correct url if there is a correlationId', async () => {
    const jwtMock = createMockJwtUser()
    mockUseGetData({
      partiesData: mockParties,
      productsData: mockProducts,
    })

    const spyWindowOpen = vi.spyOn(window, 'open')

    const correlationId = 'test-correlation-id'
    const errorCode = 'test-error-code'

    const errorData = {
      traceId: correlationId,
      errorCode: errorCode,
    }

    spyUseErrorData.mockReturnValue({
      correlationId,
      errorCode,
      timeoutId: null,
      setErrorData: vi.fn(),
      clearErrorData: vi.fn(),
    })

    const screen = renderWithApplicationContext(<Header jwt={jwtMock} />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    const assistanceButton = screen.getByRole('button', { name: 'test-assistance' })

    const user = userEvent.setup()
    await user.click(assistanceButton)

    const assistanceLinkWithCorrelationId = `${assistanceLink}&data=${JSON.stringify(errorData)}`

    expect(spyWindowOpen).toHaveBeenCalledTimes(1)
    expect(spyWindowOpen).toHaveBeenCalledWith(`${assistanceLinkWithCorrelationId}`, '_blank')
  })

  it('Header goToLogin action should return the correct url', async () => {
    const jwtMock = createMockJwtUser()
    mockUseGetData({
      partiesData: mockParties,
      productsData: mockProducts,
    })

    const mockWindowAssign = vi.fn()
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      assign: mockWindowAssign,
    } as unknown as Location)

    const screen = renderWithApplicationContext(<Header jwt={jwtMock} />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    const goToLoginButton = screen.getByRole('button', { name: 'test-login' })

    const user = userEvent.setup()
    await user.click(goToLoginButton)

    expect(mockWindowAssign).toBeCalledTimes(1)
    // TODO: remove comment when the PR for pin-6109 is merged
    // expect(mockWindowAssign).toHaveBeenCalledWith(`${FE_LOGIN_URL}`)
  })

  it('Header handleSelectParty action should return the correct url', async () => {
    const user = userEvent.setup()

    const jwtMock = createMockJwtUser()
    mockUseGetData({
      partiesData: mockParties,
      productsData: mockProducts,
    })
    const mockPartySwitchItem = createMockPartySwitchItem({
      id: 'test-party-id',
    })

    const mockProductSwitchItem = createMockProductSwitchItem()
    mockHeaderProduct(mockPartySwitchItem, mockProductSwitchItem)

    const mockWindowAssign = vi.fn()
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      assign: mockWindowAssign,
    } as unknown as Location)

    const screen = renderWithApplicationContext(<Header jwt={jwtMock} />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    const selectPartyButton = screen.getByRole('button', { name: 'test-selectedParty' })

    expect(selectPartyButton).toBeInTheDocument()

    await user.click(selectPartyButton)

    expect(mockWindowAssign).toBeCalledWith(
      `${SELFCARE_BASE_URL}/token-exchange?institutionId=${'test-party-id'}&productId=prod-interop`
    )
  })

  it('Header handleSelectProcuct action should return nothing if selfcareId from jwt is undefined', async () => {
    const user = userEvent.setup()

    mockUseGetData({
      partiesData: mockParties,
      productsData: mockProducts,
    })

    const mockPartySwitchItem = createMockPartySwitchItem()
    const mockProductSwitchItem = createMockProductSwitchItem()

    mockHeaderProduct(mockPartySwitchItem, mockProductSwitchItem)

    const mockWindowAssign = vi.fn()
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      assign: mockWindowAssign,
    } as unknown as Location)

    const screen = renderWithApplicationContext(<Header jwt={undefined} />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    const selectProductButton = screen.getByRole('button', { name: 'test-selectedProduct' })

    expect(selectProductButton).toBeInTheDocument()

    await user.click(selectProductButton)

    expect(mockWindowAssign).not.toBeCalled()
  })

  it('Header handleSelectProcuct action should return the correct url if product.id is "selfcare" and there is a jwt.selcareId', async () => {
    const user = userEvent.setup()

    const selfcareId = 'test-selfcare-id'

    const jwtMock = createMockJwtUser({
      selfcareId,
    })
    mockUseGetData({
      partiesData: mockParties,
      productsData: mockProducts,
    })

    const mockPartySwitchItem = createMockPartySwitchItem()
    const mockProductSwitchItem = createMockProductSwitchItem({
      id: 'selfcare',
    })

    mockHeaderProduct(mockPartySwitchItem, mockProductSwitchItem)

    const mockWindowAssign = vi.fn()
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      assign: mockWindowAssign,
    } as unknown as Location)

    const screen = renderWithApplicationContext(<Header jwt={jwtMock} />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    const selectProductButton = screen.getByRole('button', { name: 'test-selectedProduct' })

    expect(selectProductButton).toBeInTheDocument()

    await user.click(selectProductButton)

    expect(mockWindowAssign).toBeCalledWith(`${SELFCARE_BASE_URL}/dashboard/${selfcareId}`)
  })

  it('Header handleSelectProcuct action should return the correct url if product.id is not "selfcare" and there is a jwt.selcareId', async () => {
    const user = userEvent.setup()

    const selfcareId = 'test-selfcare-id'

    const jwtMock = createMockJwtUser({
      selfcareId,
    })
    mockUseGetData({
      partiesData: mockParties,
      productsData: mockProducts,
    })

    const mockPartySwitchItem = createMockPartySwitchItem()

    const productId = 'test-product-id'
    const mockProductSwitchItem = createMockProductSwitchItem({
      id: productId,
    })

    mockHeaderProduct(mockPartySwitchItem, mockProductSwitchItem)

    const mockWindowAssign = vi.fn()
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      assign: mockWindowAssign,
    } as unknown as Location)

    const screen = renderWithApplicationContext(<Header jwt={jwtMock} />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    const selectProductButton = screen.getByRole('button', { name: 'test-selectedProduct' })

    expect(selectProductButton).toBeInTheDocument()

    await user.click(selectProductButton)

    expect(mockWindowAssign).toBeCalledWith(
      `${SELFCARE_BASE_URL}/token-exchange?institutionId=${selfcareId}&productId=${productId}`
    )
  })
})
