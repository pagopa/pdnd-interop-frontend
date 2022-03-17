import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import { useAsyncFetch } from '../useAsyncFetch'
import { EServiceReadType } from '../../../types'

function TestComponent() {
  const { data, loadingText, error } = useAsyncFetch<Array<Partial<EServiceReadType>>>(
    { path: { endpoint: 'ESERVICE_GET_LIST' } },
    { loadingTextLabel: 'Stiamo caricando i dati...', loaderType: 'contextual' }
  )

  if (loadingText) {
    return <div>{loadingText}</div>
  }

  if (!isEmpty(error)) {
    return <div>errore</div>
  }

  if (isEmpty(data)) {
    return <div>no data</div>
  }

  const safeData = data as Array<Partial<EServiceReadType>>

  return <div>{safeData[0].name}</div>
}

it('useAsyncFetch hook updates correctly with error', async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>

  mockedAxios.request.mockImplementationOnce(() => Promise.reject({ isAxiosError: true }))

  // Display the loader
  act(() => {
    render(<TestComponent />)
  })
  expect(screen.getByText('Stiamo caricando i dati...')).toBeInTheDocument()

  // Fetch the data, there is an error
  await waitFor(() => {
    expect(screen.getByText('errore')).toBeInTheDocument()
  })
})

it('useAsyncFetch hook updates correctly without data', async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>

  mockedAxios.request.mockImplementationOnce(() => Promise.resolve({ data: undefined }))

  // Display the loader
  act(() => {
    render(<TestComponent />)
  })
  expect(screen.getByText('Stiamo caricando i dati...')).toBeInTheDocument()

  // Fetch the data, no data
  await waitFor(() => {
    expect(screen.getByText('no data')).toBeInTheDocument()
  })
})

it('useAsyncFetch hook updates correctly with data', async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>

  mockedAxios.request.mockImplementationOnce(() =>
    Promise.resolve({
      data: [{ name: 'Il mio E-Service 1' }],
    })
  )

  // Display the loader
  act(() => {
    render(<TestComponent />)
  })
  expect(screen.getByText('Stiamo caricando i dati...')).toBeInTheDocument()

  // Fetch the data, there is data
  await waitFor(() => {
    expect(screen.getByText('Il mio E-Service 1')).toBeInTheDocument()
  })
})
