import type { PortableTextBlock } from '@portabletext/types'

// Hand-written types for the shapes returned by app/queries.ts. They mirror the
// schema in the sibling cms repo; consider `sanity typegen` once it settles.

export interface SanityImage {
  _type: 'image'
  asset?: { _ref: string, _type: 'reference' }
  crop?: { top: number, bottom: number, left: number, right: number }
  hotspot?: { x: number, y: number, height: number, width: number }
}

export type Theme = 'masterbrand' | 'pacer' | 'concept'
export type Family = Exclude<Theme, 'masterbrand'>
export type Tone = 'default' | 'white' | 'surface' | 'ground' | 'brand' | 'dark'
export type NavSection = 'localAuthorities' | 'industry' | 'about' | 'contact'

export interface Link {
  type?: 'internal' | 'external' | 'anchor'
  url?: string
  anchor?: string
  page?: { slug?: string, isHome: boolean } | null
}

export interface LabelledLink {
  _key?: string
  label: string
  link?: Link
}

export interface Cta extends LabelledLink {
  style?: 'primary' | 'brand' | 'secondary'
}

export interface HeadingText {
  text?: string
  highlight?: string
}

export interface Media {
  kind?: 'image' | 'video' | 'placeholder' | 'none'
  image?: SanityImage
  alt?: string
  aspect?: '4:3' | '16:9' | '1:1' | '3:2'
  videoUrl?: string
  label?: string
}

export interface Seo {
  title?: string
  description?: string
  image?: SanityImage
  noIndex?: boolean
}

export interface Hero {
  layout?: 'split' | 'stacked'
  tone?: Tone
  eyebrow?: { product?: string, tagline?: string, badge?: string }
  heading?: HeadingText
  body?: string[]
  ctas?: Cta[]
  media?: {
    kind?: 'screen' | 'photo' | 'none'
    image?: SanityImage
    alt?: string
    product?: string
    caption?: string
    frameColor?: 'nightBordeaux' | 'deepSea' | 'mirage'
    label?: string
  }
  points?: string[]
}

interface BlockBase {
  _key: string
  anchorId?: string
}

export interface SplitBlock extends BlockBase {
  _type: 'splitBlock'
  tone?: Tone
  heading?: HeadingText
  body?: string[]
  list?: { style?: 'none' | 'numbered' | 'chips', items?: string[] }
  media?: Media
  mediaPosition?: 'right' | 'left'
  stats?: { _key: string, label?: string, value: string, text?: string }[]
  ctas?: Cta[]
}

export interface Card {
  _key: string
  eyebrow?: string
  title?: string
  subtitle?: string
  body?: string
  badge?: string
  status?: string
  family?: Family
  media?: Media
  link?: LabelledLink
}

export interface CardGridBlock extends BlockBase {
  _type: 'cardGridBlock'
  tone?: Tone
  heading?: HeadingText
  intro?: string
  cardStyle?: 'value' | 'outline' | 'filled' | 'feature' | 'tiles'
  columns?: 2 | 3 | 4
  linkStyle?: 'text' | 'button'
  spacing?: 'regular' | 'compact'
  cards?: Card[]
  ctas?: Cta[]
}

export interface Partner {
  _id: string
  name: string
  logo?: SanityImage
  url?: string
}

export interface LogoStripBlock extends BlockBase {
  _type: 'logoStripBlock'
  label?: string
  size?: 'small' | 'large'
  partners?: Partner[]
}

export interface CtaBlock extends BlockBase {
  _type: 'ctaBlock'
  variant?: 'band' | 'panel' | 'notice'
  tone?: 'brand' | 'ground' | 'dark'
  badge?: string
  heading: string
  body?: string
  ctas?: Cta[]
}

export interface StepsBlock extends BlockBase {
  _type: 'stepsBlock'
  layout?: 'sequence' | 'stacked'
  tone?: 'default' | 'white' | 'ground' | 'brand'
  heading: string
  body?: string[]
  steps?: { _key: string, label?: string, title: string, body?: string }[]
}

export interface Faq {
  _id: string
  question: string
  // Portable text; link annotations are resolved like any other `Link`.
  answer?: PortableTextBlock[]
}

export interface FaqBlock extends BlockBase {
  _type: 'faqBlock'
  tone?: 'default' | 'white'
  heading?: string
  faqs?: (Faq | null)[]
  contactPrompt?: string
  contactLink?: LabelledLink
}

export type PageBlock = SplitBlock | CardGridBlock | StepsBlock | LogoStripBlock | FaqBlock | CtaBlock

export interface Page {
  _id: string
  title: string
  slug: string
  isHome: boolean
  theme?: Theme
  navSection?: NavSection
  seo?: Seo
  hero?: Hero
  blocks?: PageBlock[]
}

export interface Navigation {
  groups?: {
    _key: string
    label: string
    accent?: Family
    section?: NavSection
    link?: Link
    items?: { _key: string, label: string, description?: string, badge?: string, link?: Link }[]
  }[]
  links?: { _key: string, label: string, section?: NavSection, link?: Link }[]
  signIn?: LabelledLink
  cta?: Cta
}

export interface Footer {
  tagline?: string
  legal?: string
  strapline?: string
  columns?: { _key: string, heading: string, links?: LabelledLink[] }[]
  social?: { _key: string, platform: string, url: string }[]
}

export interface SiteSettings {
  settings?: { title: string, seo?: Seo }
  navigation?: Navigation
  footer?: Footer
}
