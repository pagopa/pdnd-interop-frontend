import { createMockFactory } from '../../src/utils/testing.utils'
import type { PublicKey } from '../../src/types/key.types'

export const createMockPublicKey = createMockFactory<PublicKey>({
  createdAt: '2023-02-28T10:57:30.512218Z',
  key: {
    kid: 'Fxod41P3BZoe2HT6BuEw3SNFlu9ufAkYgpmtBoNuVkg',
    use: 'sig',
  },
  name: 'Test Chiave 28/02/2023',
  operator: {
    id: 'test-id',
    familyName: 'Mario',
    name: 'Rossi',
    relationshipId: '9955a748-4e08-4115-995d-313b5f8697bf',
  },
})
