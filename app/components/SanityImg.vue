<script setup lang="ts">
import type { SanityImage } from '~/types/sanity'

// `sizes` must prefix every entry with a breakpoint (sm:100vw, not 100vw):
// @nuxt/image treats an unprefixed entry as a 1px screen and adds 1w/2w
// candidates to the srcset.
const props = withDefaults(defineProps<{
  image: SanityImage
  alt?: string
  sizes?: string
  loading?: 'lazy' | 'eager'
}>(), { loading: 'lazy' })

// The editor's crop is applied by the image CDN. Images are only sized by
// width, so frames crop them with `object-fit: cover`; aim that crop at the
// hotspot. Hotspot coordinates are relative to the uncropped image, so map
// them into the cropped one. With object-position at the hotspot's own
// percentage, the hotspot stays in frame at every aspect ratio.
const objectPosition = computed(() => {
  const { hotspot, crop } = props.image
  if (!hotspot) return undefined
  const left = crop?.left ?? 0
  const top = crop?.top ?? 0
  const width = 1 - left - (crop?.right ?? 0)
  const height = 1 - top - (crop?.bottom ?? 0)
  const percent = (value: number) => `${(Math.min(Math.max(value, 0), 1) * 100).toFixed(1)}%`
  return `${percent((hotspot.x - left) / width)} ${percent((hotspot.y - top) / height)}`
})
</script>

<template>
  <NuxtImg
    v-if="image.asset?._ref"
    provider="sanity"
    :src="image.asset._ref"
    :alt="alt ?? ''"
    :sizes="sizes"
    :modifiers="{ crop: image.crop }"
    :style="objectPosition && { objectPosition }"
    format="webp"
    :loading="loading"
  />
</template>
