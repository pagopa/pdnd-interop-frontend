import { create } from 'zustand'

type LoadingOverlayStoreType = {
  isShown: boolean
  message: string
  showOverlay: (message: string) => void
  hideOverlay: () => void
}

export const useLoadingOverlayStore = create<LoadingOverlayStoreType>((set) => ({
  isShown: false,
  message: '',
  showOverlay: (message: string) => set(() => ({ message, isShown: true })),
  hideOverlay: () => set({ isShown: false }),
}))

export const useLoadingOverlay = () => {
  const showOverlay = useLoadingOverlayStore((state) => state.showOverlay)
  const hideOverlay = useLoadingOverlayStore((state) => state.hideOverlay)

  return { showOverlay, hideOverlay }
}
