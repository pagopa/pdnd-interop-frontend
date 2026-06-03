import { describe, expect, it } from 'vitest'
import enEService from '../en/eservice.json'
import itEService from '../it/eservice.json'

describe('eservice locale', () => {
  it('uses a specific title when publishing a new async e-service version', () => {
    expect(itEService.publishThankYou.newVersionAsync.title).toBe(
      "Hai pubblicato una nuova versione dell'e-service asincrono"
    )
    expect(enEService.publishThankYou.newVersionAsync.title).toBe(
      'You have published a new version of the async e-service'
    )
  })
})
