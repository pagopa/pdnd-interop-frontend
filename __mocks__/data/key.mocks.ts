import type { PublicKey } from '@/api/api.generatedTypes'
import { createMockFactory } from '../../src/utils/testing.utils'

export const createMockPublicKey = createMockFactory<PublicKey>({
  keyId: 'Fxod41P3BZoe2HT6BuEw3SNFlu9ufAkYgpmtBoNuVkg',
  name: 'string',
  operator: {
    relationshipId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: 'Mario',
    familyName: 'Rossi',
  },
  createdAt: '2023-02-28T10:57:30.512218Z',
  isOrphan: true,
})
