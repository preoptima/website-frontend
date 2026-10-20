<script setup lang="ts">
const { data: settings } = await useSiteSettings()

useSeoMeta({
  titleTemplate: title => (title ? `${title} | ${settings.value?.title}` : settings.value?.title ?? ''),
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
