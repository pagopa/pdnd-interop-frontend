import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { Spinner } from '@/components/shared/Spinner'
import ProvidersWrapper from '@/contexts'
import { RouterProvider } from './router'
import { LoadingOverlay } from './components/layout'

function App() {
  return (
    <React.Suspense fallback={<FirstLoadingSpinner />}>
      <ProvidersWrapper>
        <CssBaseline />
        <RouterProvider />
        <LoadingOverlay />
      </ProvidersWrapper>
    </React.Suspense>
  )
}

const FirstLoadingSpinner: React.FC = () => {
  return <Spinner sx={{ height: '100vh' }} />
}

export default App
