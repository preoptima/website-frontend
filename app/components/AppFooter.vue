<script setup lang="ts">
const { data: settings } = await useSiteSettings()
</script>

<template>
  <v-footer>
    <v-container class="d-flex flex-wrap align-center ga-4">
      <span>&copy; {{ new Date().getFullYear() }} {{ settings?.title }}</span>
      <v-spacer />
      <SanityLink
        v-for="link in settings?.footerNavigation"
        :key="link._key"
        :link="link"
      />
    </v-container>
  </v-footer>
</template>
