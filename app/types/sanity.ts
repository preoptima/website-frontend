// Hand-written types for the shapes returned by app/queries.ts.
// Once the schema settles, consider replacing these with `sanity typegen` output.
import type { PortableTextBlock } from '@portabletext/types'

export interface SanityImage {
  _type: 'image'
  asset?: { _ref: string, _type: 'reference' }
  alt?: string
  crop?: { top: number, bottom: number, left: number, right: number }
  hotspot?: { x: number, y: number, height: number, width: number }
}

export interface Link {
  _key: string
  label: string
  type?: 'internal' | 'external'
  external?: string
  internal?: { slug?: string, isHome: boolean } | null
}

export interface Seo {
  title?: string
  description?: string
  image?: SanityImage
  noIndex?: boolean
}

export interface HeroBlock {
  _type: 'hero'
  _key: string
  heading: string
  subheading?: string
  image?: SanityImage
  links?: Link[]
}

export interface RichTextBlock {
  _type: 'richText'
  _key: string
  content?: (PortableTextBlock | SanityImage)[]
}

export interface CallToActionBlock {
  _type: 'callToAction'
  _key: string
  heading: string
  body?: string
  link?: Link
}

export type PageBuilderBlock = HeroBlock | RichTextBlock | CallToActionBlock

export interface Page {
  _id: string
  title: string
  slug: string
  seo?: Seo
  content?: PageBuilderBlock[]
}

export interface SiteSettings {
  title: string
  seo?: Seo
  mainNavigation?: Link[]
  footerNavigation?: Link[]
}
