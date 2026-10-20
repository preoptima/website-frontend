<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const notFound = computed(() => props.error.statusCode === 404)

useSeoMeta({ title: () => (notFound.value ? 'Page not found' : 'Something went wrong') })
</script>

<template>
  <SiteHeader />
  <main class="section tone--default">
    <div class="section__inner error">
      <span class="eyebrow">{{ error.statusCode }}</span>
      <h1 class="h2">
        {{ notFound ? 'We couldn’t find that page.' : 'Something went wrong.' }}
      </h1>
      <p class="intro">
        {{ notFound ? 'It may have moved, or the link may be out of date.' : 'Please try again in a moment.' }}
      </p>
      <div class="buttons">
        <ButtonCta :cta="{ label: 'Back to Home', link: { type: 'internal', page: { isHome: true } } }" />
      </div>
    </div>
  </main>
  <SiteFooter />
</template>

<style scoped>
.error {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  min-height: 50vh;
}
</style>
