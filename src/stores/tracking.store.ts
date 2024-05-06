import { create } from 'zustand'
// Può essere che serva inserire anche un valore per specificare quando mixPanel è inizializzato completamente
type TrackingStoreType = {
  areCookiesAccepted: boolean
}

export const useTrackingStore = create<TrackingStoreType>(() => ({
  areCookiesAccepted: false,
}))

export const useTrackingConsent = () => {
  return useTrackingStore((state) => state.areCookiesAccepted)
}
