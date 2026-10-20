import type { Link } from '~/types/sanity'

// Turns a CMS link object into something NuxtLink / v-btn :to can use.
export function resolveLink(link: Link): string | undefined {
  if (link.type === 'external') return link.external
  if (!link.internal) return undefined
  return link.internal.isHome ? '/' : `/${link.internal.slug}`
}
