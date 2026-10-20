import { siteSettingsQuery } from '~/queries'
import type { SiteSettings } from '~/types/sanity'

// Shared across app.vue, header and footer; useSanityQuery dedupes by key.
export async function useSiteSettings() {
  const { data } = await useSanityQuery<SiteSettings>(siteSettingsQuery, {}, { key: 'site-settings' })
  return data
}
