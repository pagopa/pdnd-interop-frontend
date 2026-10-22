export type BannerLink = {
  link: string
  label: string
}

export type BannerData = {
  start: { date: string; time: string }
  end: { date: string; time: string }
  title?: string
  description?: string
  firstLink?: BannerLink
  secondLink?: BannerLink
}
