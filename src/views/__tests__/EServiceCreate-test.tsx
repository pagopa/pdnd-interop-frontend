import React from 'react'
import { fireEvent, render, RenderResult, screen, waitFor, act } from '@testing-library/react'
import axios from 'axios'
import { EServiceCreate } from '../EServiceCreate'
import { AllTheProviders } from '../../__mocks__/providers'
import { eserviceWithDescriptorDraft } from '../../__mocks__/e-service'

it('Navigates steps correctly', async () => {
  const step1FieldLabel = 'Caratterizzazione E-Service'
  const step2FieldLabel = 'Informazioni di versione'
  const step3FieldLabel = 'Interfaccia (richiesto)'
  const stepFowardBtnLabel = 'Salva bozza e prosegui'
  const stepBackBtnLabel = 'Indietro'

  const mockedAxios = axios as jest.Mocked<typeof axios>
  // Fetch data first time to check whether there's already a draft
  mockedAxios.request.mockImplementationOnce(() =>
    Promise.resolve({ isAxiosError: false, data: eserviceWithDescriptorDraft })
  )
  // Fetch data on first step to check whether there's already a draft
  mockedAxios.request.mockImplementationOnce(() =>
    Promise.resolve({ isAxiosError: false, data: eserviceWithDescriptorDraft })
  )
  // Post data on first step submit (returns outcome === 'success')
  mockedAxios.request.mockImplementationOnce(() =>
    Promise.resolve({ isAxiosError: false, data: eserviceWithDescriptorDraft })
  )
  // Fetch data on second step to check whether there's already a draft
  mockedAxios.request.mockImplementationOnce(() =>
    Promise.resolve({ isAxiosError: false, data: eserviceWithDescriptorDraft })
  )
  // Post data on second step submit (returns outcome === 'success')
  mockedAxios.request.mockImplementationOnce(() =>
    Promise.resolve({ isAxiosError: false, data: eserviceWithDescriptorDraft })
  )
  // Fetch data on third step to check whether there's already a draft
  mockedAxios.request.mockImplementationOnce(() =>
    Promise.resolve({ isAxiosError: false, data: eserviceWithDescriptorDraft })
  )

  let createPage: RenderResult
  await waitFor(() => {
    createPage = render(
      <AllTheProviders>
        <EServiceCreate />
      </AllTheProviders>
    )
  })

  expect(screen.getByText(step1FieldLabel)).toBeInTheDocument()

  console.log('before click 2')
  fireEvent.click(createPage.getByText(stepFowardBtnLabel))
  console.log('after click 2')

  // We need to wait because there's async work going on in the step (data fetch)
  waitFor(async () => {
    console.log('before expecting 2')
    await expect(createPage.findByText(step2FieldLabel)).toBeInTheDocument()
    // expect(screen.getByText(step2FieldLabel)).toBeInTheDocument()
    console.log('after expecting 2')
  })

  console.log('before click 3')
  fireEvent.click(createPage.getByText(`${stepFowardBtnLabel}ii`))
  console.log('after click 3')

  waitFor(() => {
    console.log('before expecting 3')
    expect(screen.getByText(step3FieldLabel)).toBeInTheDocument()
    console.log('after expecting 3')
  })

  // console.log('before click 3')
  // console.log('after click 3')

  // We need to wait because there's async work going on in the step (data fetch)
})
