import { storageDelete, storageRead, storageWrite } from '../storage-utils'

it('Add object to storage', () => {
  storageWrite('test', { a: 1, b: 2 }, 'object')
  expect(storageRead('test', 'object')).toEqual({ a: 1, b: 2 })
})

it('Remove object from storage', () => {
  storageWrite('test', { a: 1, b: 2 }, 'object')
  expect(storageRead('test', 'object')).toEqual({ a: 1, b: 2 })
  storageDelete('test')
  expect(storageRead('test', 'object')).toBeUndefined()
})
