import { Dialog } from '@/components/dialogs'
import { Footer, Header } from '@/components/layout'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthContextProvider, DialogContextProvider, useDialog } from '@/contexts'
import { NotAuthorizedError } from '@/utils/errors.utils'
import React from 'react'
import { Outlet } from 'react-router-dom'
import useCurrentRoute from '../hooks/useCurrentRoute'
import useDetectLangFromPath from '../hooks/useDetectLangFromPath'
import useScrollTopOnLocationChange from '../hooks/useScrollTopOnLocationChange'

const OutletWrapper: React.FC = () => {
  const { dialog } = useDialog()
  const { isUserAuthorized } = useCurrentRoute()

  if (!isUserAuthorized) {
    throw new NotAuthorizedError()
  }

  return (
    <>
      <Header />
      <AppLayout>
        <Outlet />
      </AppLayout>
      <Footer />
      {dialog && <Dialog {...dialog} />}
    </>
  )
}

const RoutesWrapper: React.FC = () => {
  useDetectLangFromPath()
  useScrollTopOnLocationChange()

  return (
    <AuthContextProvider>
      <DialogContextProvider>
        <OutletWrapper />
      </DialogContextProvider>
    </AuthContextProvider>
  )
}

export default RoutesWrapper
