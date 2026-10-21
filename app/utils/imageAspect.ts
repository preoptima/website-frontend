import type { SanityImage } from '~/types/sanity'

// Height over width of an image after the editor's crop, read from the
// dimensions in its asset ID (image-<hash>-2443x1803-png).
export function imageAspect(image?: SanityImage) {
  const match = image?.asset?._ref.match(/-(\d+)x(\d+)-/)
  if (!match) return undefined
  const { top = 0, bottom = 0, left = 0, right = 0 } = image?.crop ?? {}
  const width = Number(match[1]) * (1 - left - right)
  const height = Number(match[2]) * (1 - top - bottom)
  return height / width
}
