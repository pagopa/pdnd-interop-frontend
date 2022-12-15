import { QueryClient, QueryClientConfig } from '@tanstack/react-query'
import { queryClientConfig } from '../config/query-client'
import { deepmerge } from '@mui/utils'
import noop from 'lodash/noop'

const queryClientConfigMock: QueryClientConfig = deepmerge(
  {
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    // Disables logging
    logger: {
      log: noop,
      warn: noop,
      error: noop,
    },
  },
  queryClientConfig
)

export const queryClientMock = new QueryClient(queryClientConfigMock)
