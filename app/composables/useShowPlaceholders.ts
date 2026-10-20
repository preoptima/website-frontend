// Whether to draw dashed placeholders where an image is missing. On for the
// test host (NUXT_PUBLIC_SHOW_PLACEHOLDERS=true); production hides the slot.
export function useShowPlaceholders() {
  return useRuntimeConfig().public.showPlaceholders as boolean
}
