<script setup lang="ts">
import type { Page } from '~/types/sanity'

// Header, the fixed hero, the page's blocks and the footer. The theme sets
// data-family on <main>, which remaps the --family-* colours for every block.
defineProps<{ page: Page }>()
</script>

<template>
  <SiteHeader :active="page.navSection" />
  <main :data-family="page.theme && page.theme !== 'masterbrand' ? page.theme : undefined">
    <BlockHero
      v-if="page.hero"
      :hero="page.hero"
    />
    <BlockRenderer :blocks="page.blocks" />
  </main>
  <SiteFooter />
</template>
