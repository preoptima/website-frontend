<script setup lang="ts">
import type { Link } from '~/types/sanity'

// A CMS link. Renders plain text when the link has no destination yet, so a
// half-filled link never becomes a dead `#`.
const props = defineProps<{ link?: Link | null }>()

const href = computed(() => resolveLink(props.link))
</script>

<template>
  <NuxtLink
    v-if="href"
    :to="href"
  >
    <slot />
  </NuxtLink>
  <span v-else><slot /></span>
</template>
