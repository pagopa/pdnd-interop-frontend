import React from 'react'
import { useJwt } from './useJwt'

export function useTOSAgreementLocalStorage(localStorageKey = 'acceptTOS') {
  const getLocalStorageTOS = React.useCallback(() => {
    return localStorage.getItem(localStorageKey)
  }, [localStorageKey])

  const [tosAcceptedId, setTOSAcceptedId] = React.useState<string | null>(getLocalStorageTOS())
  const { jwt } = useJwt()

  React.useEffect(() => {
    function listenForStorage() {
      setTOSAcceptedId(getLocalStorageTOS())
    }
    window.addEventListener('storage', listenForStorage)
    return () => {
      window.removeEventListener('storage', listenForStorage)
    }
  }, [getLocalStorageTOS])

  const acceptTOS = React.useCallback(() => {
    const id = JSON.stringify({ id: jwt?.uid, timestamp: new Date().toISOString() })
    setTOSAcceptedId(id)
    localStorage.setItem(localStorageKey, id)
  }, [localStorageKey, jwt?.uid])

  return { isTOSAccepted: !!tosAcceptedId, acceptTOS, tosAcceptedId }
}
