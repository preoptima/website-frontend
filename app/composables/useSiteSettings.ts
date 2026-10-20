import { siteSettingsQuery } from '~/queries'
import type { SiteSettings } from '~/types/sanity'

// Shared across app.vue, header, footer and page SEO; the fixed key dedupes the
// request. Returns the AsyncData so components can `await` it but composables
// don't have to.
export function useSiteSettings() {
  return useSanityQuery<SiteSettings>(siteSettingsQuery, {}, { key: 'site-settings' })
}
