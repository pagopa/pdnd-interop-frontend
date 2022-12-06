import cloneDeep from 'lodash/cloneDeep'
import { EServiceProvider } from '../../types/eservice.types'

const defaultEServiceProvider = {
  id: 'ad474d35-7939-4bee-bde9-4e469cca1030',
  name: '-- CAMMELLO --',
}

const createMockEServiceProvider = (overwrites: Partial<EServiceProvider> = {}) => {
  return cloneDeep({
    ...defaultEServiceProvider,
    ...overwrites,
  })
}

export { createMockEServiceProvider }
