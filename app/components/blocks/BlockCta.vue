<script setup lang="ts">
import type { CtaBlock } from '~/types/sanity'

const props = defineProps<{ block: CtaBlock }>()

const variant = computed(() => props.block.variant ?? 'band')
const tone = computed(() => (variant.value === 'notice' ? 'white' : props.block.tone ?? 'brand'))
</script>

<template>
  <section
    class="cta"
    :class="[`cta--${variant}`, variant === 'band' ? `section tone--${tone}` : 'tone--default']"
  >
    <div class="cta__outer">
      <div
        class="cta__box"
        :class="variant !== 'band' && `tone--${tone}`"
      >
        <div class="cta__text">
          <span
            v-if="variant === 'notice' && block.badge"
            class="badge"
          >{{ block.badge }}</span>
          <h2 class="cta__heading">
            {{ block.heading }}
          </h2>
          <p
            v-if="block.body"
            class="cta__body"
          >
            {{ block.body }}
          </p>
          <div
            v-if="variant !== 'panel' && block.ctas?.length"
            class="buttons cta__buttons"
          >
            <ButtonCta
              v-for="cta in block.ctas"
              :key="cta._key"
              :cta="cta"
            />
          </div>
        </div>
        <div
          v-if="variant === 'panel' && block.ctas?.length"
          class="buttons"
        >
          <ButtonCta
            v-for="cta in block.ctas"
            :key="cta._key"
            :cta="cta"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  background: var(--light-gray);
}

.cta--band {
  background: var(--tone-bg);
}

.cta__outer {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: clamp(32px, 5vw, 56px) var(--gutter);
}

.cta--band .cta__outer {
  padding-block: var(--section-padding);
}

.cta__box {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px 32px;
  color: var(--tone-ink);
}

.cta--panel .cta__box {
  align-items: flex-end;
  padding: clamp(40px, 6vw, 64px) var(--gutter);
  background: var(--tone-bg);
}

.cta--notice .cta__box {
  padding: clamp(24px, 4vw, 48px);
  background: var(--white);
  box-shadow: inset 0 0 0 1px var(--wild-sand);
}

.cta__text {
  display: flex;
  flex: 1 1 480px;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  max-width: 880px;
}

.cta__heading {
  font-size: clamp(32px, 4vw, 56px);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.03em;
  text-wrap: balance;
}

.cta--panel .cta__heading {
  font-size: clamp(32px, 3.6vw, 48px);
}

.cta--notice .cta__heading {
  font-size: clamp(28px, 3vw, 40px);
}

.cta__body {
  max-width: 680px;
  color: var(--tone-muted);
  font-size: clamp(17px, 1.6vw, 19px);
  line-height: 1.5;
  text-wrap: pretty;
}

.cta__buttons {
  margin-top: 8px;
}

.cta--notice .badge {
  background: var(--family-ground);
  color: var(--white);
}
</style>
