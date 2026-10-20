<script setup lang="ts">
import type { SanityImage } from '~/types/sanity'

defineProps<{ image: SanityImage, sizes?: string }>()
</script>

<template>
  <NuxtImg
    v-if="image.asset?._ref"
    provider="sanity"
    :src="image.asset._ref"
    :alt="image.alt ?? ''"
    :sizes="sizes"
    :modifiers="{ crop: image.crop, hotspot: image.hotspot }"
    format="webp"
    class="w-100 h-auto"
  />
</template>
