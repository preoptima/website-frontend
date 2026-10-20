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
// them into the cropped one.
//
// On each axis, object-position p shows the window starting at p × (1 − v),
// where v is the visible fraction. Setting p = start / (1 − size) for the
// hotspot box keeps the whole box in view whenever the frame is big enough
// to hold it, at any aspect ratio: a box touching the top edge gives 0%.
const objectPosition = computed(() => {
  const { hotspot, crop } = props.image
  if (!hotspot) return undefined
  const axis = (centre: number, size: number, cropStart = 0, cropEnd = 0) => {
    const span = 1 - cropStart - cropEnd
    const box = Math.min(size / span, 1)
    const start = (centre - cropStart) / span - box / 2
    const position = box < 1 ? start / (1 - box) : 0.5
    return `${(Math.min(Math.max(position, 0), 1) * 100).toFixed(1)}%`
  }
  return [
    axis(hotspot.x, hotspot.width, crop?.left, crop?.right),
    axis(hotspot.y, hotspot.height, crop?.top, crop?.bottom),
  ].join(' ')
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
