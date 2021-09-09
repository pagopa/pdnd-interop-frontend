import React, { useEffect, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useLocation } from 'react-router-dom'
import { StyledToast } from './StyledToast'
import { ToastContentWithOutcome, ToastProps } from '../../types'

type ToastOnMountProps = {}

export function withToastOnMount<T extends ToastOnMountProps>(
  WrappedComponent: React.ComponentType<T>
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

  const ComponentWithToastOnMount = (props: Omit<T, keyof ToastOnMountProps>) => {
    const [toast, setToast] = useState<ToastProps>()
    const location = useLocation()

    const closeToast = () => {
      setToast(undefined)
    }

    useEffect(() => {
      if (!isEmpty(location.state) && !isEmpty((location.state as any).toast)) {
        const toastContent = (location.state as any).toast as ToastContentWithOutcome
        setToast({ ...toastContent, onClose: closeToast })
      }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <React.Fragment>
        <WrappedComponent {...(props as T)} />
        {toast && <StyledToast {...toast} />}
      </React.Fragment>
    )
  }

  ComponentWithToastOnMount.displayName = `withToastOnMount(${displayName})`

  return ComponentWithToastOnMount
}
