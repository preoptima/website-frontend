<script setup lang="ts">
import { PortableText } from '@portabletext/vue'
import type { PortableTextComponents } from '@portabletext/vue'
import type { RichTextBlock, SanityImage } from '~/types/sanity'

defineProps<{ block: RichTextBlock }>()

const SanityImg = resolveComponent('SanityImg')

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage }) => h(SanityImg, { image: value, sizes: 'sm:100vw md:800px' }),
  },
}
</script>

<template>
  <section class="py-8">
    <v-container class="rich-text">
      <PortableText
        :value="block.content ?? []"
        :components="components"
      />
    </v-container>
  </section>
</template>

<style scoped>
.rich-text {
  max-width: 800px;
}
</style>
