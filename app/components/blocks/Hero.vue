<script setup lang="ts">
import type { HeroBlock } from '~/types/sanity'

defineProps<{ block: HeroBlock }>()
</script>

<template>
  <section class="py-16">
    <v-container>
      <v-row align="center">
        <v-col
          cols="12"
          md="6"
        >
          <h1 class="text-display-medium mb-4">
            {{ block.heading }}
          </h1>
          <p
            v-if="block.subheading"
            class="text-body-large mb-6"
          >
            {{ block.subheading }}
          </p>
          <div class="d-flex flex-wrap ga-3">
            <v-btn
              v-for="(link, index) in block.links"
              :key="link._key"
              :to="resolveLink(link)"
              :variant="index === 0 ? 'flat' : 'outlined'"
              color="primary"
              size="large"
            >
              {{ link.label }}
            </v-btn>
          </div>
        </v-col>
        <v-col
          v-if="block.image?.asset"
          cols="12"
          md="6"
        >
          <SanityImg
            :image="block.image"
            sizes="sm:100vw md:50vw"
          />
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>
