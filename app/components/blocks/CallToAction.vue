<script setup lang="ts">
import type { CallToActionBlock } from '~/types/sanity'

defineProps<{ block: CallToActionBlock }>()
</script>

<template>
  <section class="py-12">
    <v-container>
      <v-sheet
        color="primary"
        rounded="lg"
        class="pa-10 text-center"
      >
        <h2 class="text-headline-medium mb-3">
          {{ block.heading }}
        </h2>
        <p
          v-if="block.body"
          class="mb-6"
        >
          {{ block.body }}
        </p>
        <v-btn
          v-if="block.link"
          :to="resolveLink(block.link)"
          color="white"
          size="large"
        >
          {{ block.link.label }}
        </v-btn>
      </v-sheet>
    </v-container>
  </section>
</template>
