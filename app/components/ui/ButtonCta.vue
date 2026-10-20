<script setup lang="ts">
import type { Cta } from '~/types/sanity'

// The design system's ApplicationsButton. Secondary is its "inverse" variant
// and never has an arrow.
const props = withDefaults(defineProps<{
  cta: Cta
  defaultStyle?: NonNullable<Cta['style']>
  arrow?: boolean
}>(), { defaultStyle: 'primary', arrow: true })

const variant = computed(() => props.cta.style ?? props.defaultStyle)
const href = computed(() => resolveLink(props.cta.link))
</script>

<template>
  <NuxtLink
    v-if="href"
    :to="href"
    class="button"
    :class="`button--${variant}`"
  >
    {{ cta.label }}
    <IconArrow v-if="arrow && variant !== 'secondary'" />
  </NuxtLink>
</template>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 14px 28px;
  border-radius: var(--radius-control);
  background: var(--button-bg);
  color: var(--button-fg);
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  transition: background var(--transition-colour);
}

.button:hover {
  background: var(--button-hover);
  color: var(--button-fg);
}

.button--primary {
  --button-bg: var(--blaze-orange);
  --button-hover: var(--orange-hover);
  --button-fg: var(--white);
}

.button--brand {
  --button-bg: var(--deep-sea-green);
  --button-hover: var(--dark-teal);
  --button-fg: var(--white);
}

.button--secondary {
  --button-bg: var(--tint-1);
  --button-hover: var(--white);
  --button-fg: var(--mirage);
}
</style>
