<script setup lang="ts">
import type { SanityImage } from '~/types/sanity'

withDefaults(defineProps<{
  image: SanityImage
  alt?: string
  sizes?: string
  loading?: 'lazy' | 'eager'
}>(), { loading: 'lazy' })
</script>

<template>
  <NuxtImg
    v-if="image.asset?._ref"
    provider="sanity"
    :src="image.asset._ref"
    :alt="alt ?? ''"
    :sizes="sizes"
    :modifiers="{ crop: image.crop, hotspot: image.hotspot }"
    format="webp"
    :loading="loading"
  />
</template>
