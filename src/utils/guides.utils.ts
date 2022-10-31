import { PUBLIC_URL } from '@/config/env'

const anchorBitsRegex = /href="(#.*)"/gi
const localAssetsRegex = /..\/..\/..\/public/gi

export function getReplacedAssetsPaths(htmlString: string) {
  const { pathname } = window.location
  return htmlString
    .replace(anchorBitsRegex, `href="${pathname}$1"`)
    .replace(localAssetsRegex, PUBLIC_URL)
}
