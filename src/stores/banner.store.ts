import { create } from 'zustand'

interface BannerState {
  currentBanner: { bannerKey: string; priority: number } | null
  setCurrentBanner: (banner: { bannerKey: string; priority: number } | null) => void
}

export const useBannerStore = create<BannerState>((set) => ({
  currentBanner: null,
  setCurrentBanner: (banner) =>
    set((state: BannerState) => {
      if (banner === null) return { currentBanner: null }
      if (state.currentBanner === null) return { currentBanner: banner }

      // mitigation for visual banner order based on priority:
      // only update if the new banner has higher priority
      if (banner.priority < state.currentBanner.priority) {
        return { currentBanner: banner }
      }
      return state
    }),
}))
