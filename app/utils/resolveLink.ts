import type { Link } from '~/types/sanity'

// Turns a CMS link object into an href for NuxtLink. Returns undefined when the
// link has no destination yet, so callers can render plain text instead.
export function resolveLink(link?: Link | null): string | undefined {
  if (!link) return undefined
  const hash = link.anchor ? `#${link.anchor}` : ''
  switch (link.type) {
    case 'external':
      return link.url || undefined
    case 'anchor':
      return hash || undefined
    default:
      if (!link.page) return undefined
      return `${link.page.isHome ? '/' : `/${link.page.slug}`}${hash}`
  }
}
