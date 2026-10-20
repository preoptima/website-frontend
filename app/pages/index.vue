<script setup lang="ts">
import { homePageQuery } from '~/queries'
import type { Page } from '~/types/sanity'

const { data: page } = await useSanityQuery<Page>(homePageQuery)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Home page not set in Site settings', fatal: true })
}

await usePageSeo(page)
</script>

<template>
  <PageBuilder :blocks="page?.content" />
</template>
