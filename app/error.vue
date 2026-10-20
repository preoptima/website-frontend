<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

useSeoMeta({ title: props.error.statusCode === 404 ? 'Page not found' : 'Something went wrong' })
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="py-16 text-center">
        <h1 class="text-display-small mb-4">
          {{ error.statusCode === 404 ? 'Page not found' : 'Something went wrong' }}
        </h1>
        <v-btn
          color="primary"
          @click="clearError({ redirect: '/' })"
        >
          Back to home
        </v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>
