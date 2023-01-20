import { PageBottomActionsContainer, PageContainer } from '@/components/layout/containers'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { Button, Stack, Typography } from '@mui/material'
import React from 'react'

const AuthErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ErrorBoundary FallbackComponent={AuthError}>{children}</ErrorBoundary>
}

const AuthError: React.FC = () => {
  return (
    <Stack alignItems="center" sx={{ flex: 1 }}>
      <PageContainer>
        <Typography component="h1" mt="50%" variant="h3">
          Chiamata di swap token fallita
        </Typography>
        <Typography sx={{ mt: 2, maxWidth: 'sm' }}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsa esse maiores quasi fuga
          sunt in similique doloremque nemo! Veritatis facilis soluta, atque fugiat ex
          necessitatibus sed laborum similique ab dignissimos.
        </Typography>
        <PageBottomActionsContainer>
          <Button size="small" variant="contained">
            Test
          </Button>
        </PageBottomActionsContainer>
      </PageContainer>
    </Stack>
  )
}

export default AuthErrorBoundary
