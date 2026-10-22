<script setup lang="ts">
import type { StepsBlock } from '~/types/sanity'

const props = defineProps<{ block: StepsBlock }>()

const layout = computed(() => props.block.layout ?? 'sequence')
</script>

<template>
  <section
    class="section"
    :class="`tone--${block.tone ?? 'default'}`"
  >
    <div
      class="section__inner steps"
      :class="`steps--${layout}`"
    >
      <div class="steps__header">
        <h2 class="h2">
          {{ block.heading }}
        </h2>
        <div
          v-if="block.body?.length"
          class="steps__body"
        >
          <p
            v-for="(paragraph, index) in block.body"
            :key="index"
          >
            {{ paragraph }}
          </p>
        </div>
      </div>

      <ol
        v-if="layout === 'sequence'"
        class="sequence"
      >
        <li
          v-for="(step, index) in block.steps"
          :key="step._key"
          class="sequence__step"
        >
          <div class="sequence__top">
            <span class="sequence__number">{{ listNumber(index) }}</span>
            <span class="sequence__rule" />
          </div>
          <span
            v-if="step.label"
            class="sequence__label"
          >{{ step.label }}</span>
          <h3 class="sequence__title">
            {{ step.title }}
          </h3>
          <p
            v-if="step.body"
            class="sequence__body"
          >
            {{ step.body }}
          </p>
        </li>
      </ol>

      <ol
        v-else
        class="stacked"
      >
        <li
          v-for="(step, index) in block.steps"
          :key="step._key"
          class="stacked__step"
        >
          <span class="stacked__number">{{ listNumber(index) }}</span>
          <div class="stacked__text">
            <h3 class="stacked__title">
              {{ step.title }}
            </h3>
            <p
              v-if="step.body"
              class="stacked__body"
            >
              {{ step.body }}
            </p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.steps__body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  color: var(--tone-muted);
  font-size: 17px;
  line-height: 1.55;
  text-wrap: pretty;
}

/* Sequence: heading and body side by side on their bottom edges, then a
   white strip of numbered cells. */
.steps--sequence .steps__header {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr));
  align-items: end;
  gap: 24px var(--split-gap);
}

.sequence {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
  margin-top: var(--heading-gap);
  overflow: hidden;
  background: var(--white);
  box-shadow: inset 0 0 0 1px var(--wild-sand);
  color: var(--mirage);
}

/* Each cell draws its right and bottom rules and overlaps its neighbours by
   1px, so the outer edges fall under the strip's clipped border. */
.sequence__step {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0 -1px -1px 0;
  padding: 28px 24px 32px;
  border-right: 1px solid var(--wild-sand);
  border-bottom: 1px solid var(--wild-sand);
}

.sequence__top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sequence__number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--family-ground);
  color: var(--white);
  font-size: 12px;
  font-weight: 700;
}

.sequence__rule {
  flex: 1;
  height: 1px;
  background: var(--family-surface);
}

.sequence__label {
  color: var(--family-ground);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.sequence__title {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.sequence__body {
  color: var(--text-secondary-ui);
  font-size: 14px;
  line-height: 1.5;
  text-wrap: pretty;
}

/* Stacked: heading and body on the left, a tinted panel of rows on the
   right. */
.steps--stacked {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  align-items: start;
  gap: 40px var(--split-gap);
}

.steps--stacked .steps__header {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stacked {
  display: flex;
  flex-direction: column;
  background: var(--family-surface);
  color: var(--mirage);
}

.stacked__step {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 20px;
  padding: 28px clamp(20px, 3vw, 32px);
  border-bottom: 1px solid rgba(22, 35, 42, 0.12);
}

.stacked__number {
  color: var(--family-ground);
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.03em;
}

.stacked__text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stacked__title {
  color: var(--family-ground);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.stacked__body {
  font-size: 16px;
  line-height: 1.5;
  text-wrap: pretty;
}
</style>
