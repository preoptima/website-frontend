<script setup lang="ts">
import type { HeadingText } from '~/types/sanity'

// Renders a heading with its highlight in the tone's highlight colour.
const props = withDefaults(defineProps<{ heading?: HeadingText, as?: string }>(), { as: 'h2' })

const parts = computed(() => {
  const text = props.heading?.text ?? ''
  const highlight = props.heading?.highlight
  const index = highlight ? text.indexOf(highlight) : -1
  if (!highlight || index < 0) return { before: text }
  return { before: text.slice(0, index), highlight, after: text.slice(index + highlight.length) }
})
</script>

<template>
  <component :is="as">
    {{ parts.before }}<span
      v-if="parts.highlight"
      class="highlight"
    >{{ parts.highlight }}</span>{{ parts.after }}
  </component>
</template>

<style scoped>
.highlight {
  color: var(--heading-highlight, var(--tone-highlight));
}
</style>
