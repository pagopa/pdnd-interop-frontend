import { APP_MODE, INTEROP_RESOURCES_BASE_URL } from '@/config/env'
import type { BannerData } from '@/types/banner.types'
import axios from 'axios'
import { z } from 'zod'

const DEFAULT_BANNER_LANGUAGE = 'it'

const productUpdatesBannerLinkSchema = z.object({
  link: z.url({ protocol: /^https?$/ }),
  label: z.string().min(1),
})

const productUpdatesBannerDataSchema = z.object({
  start: z.object({
    date: z.string().min(1),
    time: z.string().min(1),
  }),
  end: z.object({
    date: z.string().min(1),
    time: z.string().min(1),
  }),
  title: z.string().min(1),
  description: z.string().min(1),
  firstLink: productUpdatesBannerLinkSchema.optional(),
  secondLink: productUpdatesBannerLinkSchema.optional(),
})

function getBannerLanguage(language: string) {
  return language.startsWith('en') ? 'en' : DEFAULT_BANNER_LANGUAGE
}

async function fetchProductUpdatesJson(language: string) {
  const response = await axios.get<unknown>(
    `${INTEROP_RESOURCES_BASE_URL}/banner-info-window/${language}/data.json`
  )
  return productUpdatesBannerDataSchema.parse(response.data) satisfies BannerData
}

async function getProductUpdatesJson(language = DEFAULT_BANNER_LANGUAGE) {
  // Mock data in development to avoid CORS issues with S3
  if (APP_MODE === 'development') {
    const bannerData: BannerData = {
      start: {
        date: '2023-05-25',
        time: '10:47',
      },
      end: {
        date: '2028-05-25',
        time: '12:47',
      },
      title: 'Novita su PDND',
      description: 'Sono disponibili nuovi aggiornamenti di piattaforma.',
    }

    return bannerData
  }

  const bannerLanguage = getBannerLanguage(language)

  try {
    return await fetchProductUpdatesJson(bannerLanguage)
  } catch (error) {
    if (bannerLanguage === DEFAULT_BANNER_LANGUAGE) {
      throw error
    }

    return fetchProductUpdatesJson(DEFAULT_BANNER_LANGUAGE)
  }
}

export const ProductUpdatesServices = {
  getProductUpdatesJson,
}
