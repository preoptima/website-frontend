<script setup lang="ts">
import { pageBySlugQuery } from '~/queries'
import type { Page } from '~/types/sanity'

// Remount on navigation between slugs so the query re-runs with a fresh key.
definePageMeta({ key: route => route.fullPath })

const route = useRoute()
const slug = [route.params.slug].flat().join('/')

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
  <PageBuilder :blocks="page?.content" />
</template>
