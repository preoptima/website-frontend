// GROQ queries. References are expanded here so components receive flat props
// shaped like the design handoff's fixtures.

const isHome = /* groq */ `_id == *[_type == "siteSettings"][0].homePage._ref`

const link = /* groq */ `{
  type,
  url,
  anchor,
  "page": internal->{ "slug": slug.current, "isHome": ${isHome} }
}`

const labelledLink = /* groq */ `{ _key, label, "link": link${link} }`

const cta = /* groq */ `{ _key, label, style, "link": link${link} }`

const pageFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  "isHome": ${isHome},
  theme,
  navSection,
  seo,
  hero{
    ...,
    ctas[]${cta}
  },
  "blocks": blocks[hidden != true]{
    ...,
    ctas[]${cta},
    _type == "cardGridBlock" => { cards[]{ ..., "link": link${labelledLink} } },
    _type == "logoStripBlock" => { "partners": partners[]->{ _id, name, logo, url } },
  }
`

export const siteSettingsQuery = /* groq */ `{
  "settings": *[_type == "siteSettings"][0]{ title, seo },
  "navigation": *[_id == "navigation"][0]{
    groups[]{
      _key,
      label,
      accent,
      section,
      "link": link${link},
      items[]{ _key, label, description, badge, "link": link${link} }
    },
    links[]{ _key, label, section, "link": link${link} },
    "signIn": signIn${labelledLink},
    "cta": cta${cta}
  },
  "footer": *[_id == "footer"][0]{
    tagline,
    legal,
    strapline,
    columns[]{ _key, heading, links[]${labelledLink} },
    social
  }
}`

export const homePageQuery = /* groq */ `*[_type == "siteSettings"][0].homePage->{ ${pageFields} }`

export const pageBySlugQuery = /* groq */ `*[_type == "page" && slug.current == $slug][0]{ ${pageFields} }`
