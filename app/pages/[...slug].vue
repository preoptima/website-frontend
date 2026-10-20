<script setup lang="ts">
import { pageBySlugQuery } from '~/queries'
import type { Page } from '~/types/sanity'

// Remount on navigation between slugs so the query re-runs with a fresh key.
// The path, not fullPath, so in-page anchor links don't remount the page.
definePageMeta({ key: route => route.path })

const route = useRoute()
// Static hosts redirect /pacer to /pacer/, so ignore empty segments from a
// trailing slash. Otherwise the slug wouldn't match the prerendered payload.
const slug = [route.params.slug].flat().filter(Boolean).join('/')

const { data: page } = await useSanityQuery<Page>(pageBySlugQuery, { slug })

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

if (page.value.isHome) {
  await navigateTo('/', { redirectCode: 301, replace: true })
}

usePageSeo(page)
</script>

<template>
  <PageView
    v-if="page"
    :page="page"
  />
</template>
