import React from 'react'
import axios from 'axios'
import { render, screen, waitFor } from '@testing-library/react'
import { AllTheProviders } from '../../__mocks__/providers'
import { EServiceCreateStep1General } from '../EServiceCreateStep1General'
import { eserviceDraft } from '../../__mocks__/e-service'

describe('Rendering tests', () => {
  it('Should render form input fields', async () => {
    const forward = jest.fn()
    const back = jest.fn()

    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.request.mockImplementation(() =>
      Promise.resolve({ isAxiosError: false, data: eserviceDraft })
    )

    // Fetch the data
    await waitFor(() => {
      render(
        <AllTheProviders>
          <EServiceCreateStep1General forward={forward} back={back} />
        </AllTheProviders>
      )
    })

    expect(screen.getByRole('heading', { name: 'Caratterizzazione E-Service' })).toBeInTheDocument()

    expect(
      screen.getByRole('textbox', { name: "Nome dell'eservice (richiesto)" })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('textbox', { name: "Descrizione dell'E-Service (richiesto)" })
    ).toBeInTheDocument()

    expect(screen.getByLabelText('REST')).toBeInTheDocument()
    expect(screen.getByLabelText('SOAP')).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Attributi' })).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Salva bozza e prosegui' })).toBeInTheDocument()
  })

  it('Should render attributes', async () => {
    const forward = jest.fn()
    const back = jest.fn()

    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.request.mockImplementation(() =>
      Promise.resolve({ isAxiosError: false, data: eserviceDraft })
    )

    // Fetch the data
    await waitFor(() => {
      render(
        <AllTheProviders>
          <EServiceCreateStep1General forward={forward} back={back} />
        </AllTheProviders>
      )
    })

    // Certified attribute displays 1 item. See if title matches
    expect(screen.getByText('Attributo 1')).toBeInTheDocument()
    // Verified and declared attributes both currently display a "no attribute" message
    expect(screen.queryAllByText('Nessun attributo presente').length).toBe(2)
  })
})
