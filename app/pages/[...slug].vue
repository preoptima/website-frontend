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

usePageSeo(page)
</script>

<template>
  <PageBuilder :blocks="page?.content" />
</template>
