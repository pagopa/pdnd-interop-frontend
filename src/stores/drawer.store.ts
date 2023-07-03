import type { DrawerProps } from '@/components/layout/Drawer'
import { create } from 'zustand'

type DrawerStoreType = {
  isOpen: boolean
  drawer: DrawerProps | null
  openDrawer: (drawer: DrawerProps) => void
  closeDrawer: () => void
}

export const useDrawerStore = create<DrawerStoreType>((set) => ({
  isOpen: false,
  drawer: null,
  openDrawer: (drawer: DrawerProps) => set(() => ({ drawer, isOpen: true })),
  closeDrawer: () => set({ drawer: null, isOpen: false }),
}))

export const useDrawer = () => {
  const openDrawer = useDrawerStore((state) => state.openDrawer)
  const closeDrawer = useDrawerStore((state) => state.closeDrawer)

  return { openDrawer, closeDrawer }
}
