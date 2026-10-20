<script setup lang="ts">
import type { Link } from '~/types/sanity'

const props = defineProps<{ link: Link }>()

const to = computed(() => resolveLink(props.link))
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    v-bind="$attrs"
  >
    <slot>{{ link.label }}</slot>
  </NuxtLink>
</template>
