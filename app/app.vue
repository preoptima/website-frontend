<script setup lang="ts">
const { data: settings } = await useSiteSettings()

useSeoMeta({
  titleTemplate: title => (title ? `${title} | ${settings.value?.settings?.title}` : settings.value?.settings?.title ?? ''),
})
</script>

<template>
  <NuxtPage />
</template>
