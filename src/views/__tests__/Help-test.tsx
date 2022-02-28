import React from 'react'
import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import uniq from 'lodash/uniq'
import axios from '../../__mocks__/axios'
import { Help } from '../Help'
import html from '../../../public/data/help.json'

it('has all anchors working', async () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>
  mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ isAxiosError: false, data: html }))

  let helpPage: RenderResult
  await waitFor(() => {
    helpPage = render(<Help />)
  })

  const allAnchors = screen
    .getAllByRole('link')
    .map((link) => link.getAttribute('href'))
    .filter((link) => link && link.charAt(0) === '#')
    .map((link) => decodeURI(link as string)) as string[]
  // Get all unique anchors
  const anchors = uniq(allAnchors)

  const hasAllAnchors = anchors.every((anchor) => {
    // Search the heading related to the anchor
    const heading = helpPage.container.querySelector(anchor)
    // It should exist
    expect(heading).not.toBeUndefined()
    return Boolean(heading)
  })

  // There should be one heading id for every anchor
  expect(hasAllAnchors).toBe(true)
})
