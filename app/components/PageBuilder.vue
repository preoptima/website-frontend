<script setup lang="ts">
import type { Component } from 'vue'
import type { PageBuilderBlock } from '~/types/sanity'
import BlocksCallToAction from './blocks/CallToAction.vue'
import BlocksHero from './blocks/Hero.vue'
import BlocksRichText from './blocks/RichText.vue'

defineProps<{ blocks?: PageBuilderBlock[] | null }>()

// Keys match the block `_type` names in the CMS schema.
const components: Record<PageBuilderBlock['_type'], Component> = {
  callToAction: BlocksCallToAction,
  hero: BlocksHero,
  richText: BlocksRichText,
}
</script>

<template>
  <template
    v-for="block in blocks"
    :key="block._key"
  >
    <component
      :is="components[block._type]"
      v-if="components[block._type]"
      :block="block"
    />
  </template>
</template>
