<script setup lang="ts">
// A dashed slot for imagery the client hasn't supplied yet. Only rendered when
// placeholders are switched on (see useShowPlaceholders); colours come from the
// parent via --placeholder-ink, --placeholder-border and --placeholder-bg.
defineProps<{ label?: string, caption?: string }>()
</script>

<template>
  <div
    class="placeholder"
    role="img"
    :aria-label="label ? `Placeholder: ${label}` : 'Placeholder'"
  >
    <span class="placeholder__label">{{ label }}</span>
    <span
      v-if="caption"
      class="placeholder__caption"
    >{{ caption }}</span>
  </div>
</template>

<style scoped>
.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  height: 100%;
  padding: 16px;
  border: 1px dashed var(--placeholder-border, var(--family-ground));
  background: var(--placeholder-bg, transparent);
  color: var(--placeholder-ink, var(--family-ground));
  text-align: center;
}

.placeholder__label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1.3;
  text-transform: uppercase;
}

.placeholder__caption {
  max-width: 320px;
  font-size: 13px;
}
</style>
