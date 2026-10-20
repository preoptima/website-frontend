// Shared GROQ fragments. Links are dereferenced here so components never have
// to resolve references themselves.
const linkFields = /* groq */ `
  _key,
  label,
  type,
  external,
  internal->{
    "slug": slug.current,
    "isHome": _id == *[_type == "siteSettings"][0].homePage._ref
  }
`

const pageFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  "isHome": _id == *[_type == "siteSettings"][0].homePage._ref,
  seo,
  content[]{
    ...,
    _type == "hero" => { links[]{ ${linkFields} } },
    _type == "callToAction" => { link{ ${linkFields} } },
  }
`

export const siteSettingsQuery = /* groq */ `*[_type == "siteSettings"][0]{
  title,
  seo,
  mainNavigation[]{ ${linkFields} },
  footerNavigation[]{ ${linkFields} },
}`

export const homePageQuery = /* groq */ `*[_type == "siteSettings"][0].homePage->{ ${pageFields} }`

export const pageBySlugQuery = /* groq */ `*[_type == "page" && slug.current == $slug][0]{ ${pageFields} }`
