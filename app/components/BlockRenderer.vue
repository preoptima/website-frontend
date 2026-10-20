<script setup lang="ts">
import type { Component } from 'vue'
import type { PageBlock } from '~/types/sanity'
import BlockCards from './blocks/BlockCards.vue'
import BlockCta from './blocks/BlockCta.vue'
import BlockLogos from './blocks/BlockLogos.vue'
import BlockSplit from './blocks/BlockSplit.vue'

defineProps<{ blocks?: PageBlock[] | null }>()

// Keys match the block `_type` names in the CMS schema. Unknown types are
// skipped, so the CMS can get ahead of the frontend without breaking pages.
const registry: Record<PageBlock['_type'], Component> = {
  cardGridBlock: BlockCards,
  ctaBlock: BlockCta,
  logoStripBlock: BlockLogos,
  splitBlock: BlockSplit,
}
</script>

<template>
  <template
    v-for="block in blocks"
    :key="block._key"
  >
    <div
      v-if="registry[block._type]"
      :id="block.anchorId"
      class="block"
      :data-block-type="block._type"
    >
      <component
        :is="registry[block._type]"
        :block="block"
      />
    </div>
  </template>
</template>

<style scoped>
.block {
  scroll-margin-top: 80px;
}
</style>
