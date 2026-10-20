<script setup lang="ts">
const { data: settings } = await useSiteSettings()
</script>

<template>
  <v-app-bar flat>
    <v-container class="d-flex align-center">
      <NuxtLink
        to="/"
        class="text-title-large text-decoration-none text-primary"
      >
        {{ settings?.title }}
      </NuxtLink>
      <v-spacer />
      <nav class="d-flex ga-2">
        <SanityLink
          v-for="link in settings?.mainNavigation"
          :key="link._key"
          :link="link"
        />
      </nav>
    </v-container>
  </v-app-bar>
</template>
