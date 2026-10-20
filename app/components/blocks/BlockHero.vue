<script setup lang="ts">
import type { Hero } from '~/types/sanity'

const props = defineProps<{ hero: Hero }>()

const showPlaceholders = useShowPlaceholders()
const media = computed(() => props.hero.media)
const hasImage = computed(() => !!media.value?.image?.asset)
const mediaKind = computed(() => {
  const kind = media.value?.kind ?? 'none'
  return kind !== 'none' && (hasImage.value || showPlaceholders) ? kind : 'none'
})
const eyebrow = computed(() => props.hero.eyebrow)
</script>

<template>
  <section
    class="hero section"
    :class="`tone--${hero.tone ?? 'surface'}`"
  >
    <div class="hero__inner">
      <div class="hero__text">
        <div
          v-if="eyebrow?.product || eyebrow?.tagline || eyebrow?.badge"
          class="hero__eyebrow"
        >
          <template v-if="eyebrow.product">
            <span class="hero__product">{{ eyebrow.product }}</span>
            <span
              v-if="eyebrow.tagline"
              class="hero__rule"
            />
          </template>
          <span
            v-if="eyebrow.tagline"
            class="hero__tagline"
          >{{ eyebrow.tagline }}</span>
          <span
            v-if="eyebrow.badge"
            class="badge"
          >{{ eyebrow.badge }}</span>
        </div>

        <HeadingText
          :heading="hero.heading"
          as="h1"
          class="hero__heading"
        />

        <div
          v-if="hero.body?.length"
          class="hero__body"
        >
          <p
            v-for="(paragraph, index) in hero.body"
            :key="index"
          >
            {{ paragraph }}
          </p>
        </div>

        <div
          v-if="hero.ctas?.length"
          class="buttons hero__buttons"
        >
          <ButtonCta
            v-for="cta in hero.ctas"
            :key="cta._key"
            :cta="cta"
          />
        </div>

        <ol
          v-if="hero.points?.length"
          class="hero__points"
        >
          <li
            v-for="(point, index) in hero.points"
            :key="index"
          >
            <span class="hero__point-number">{{ listNumber(index) }}.</span>
            {{ point }}
          </li>
        </ol>
      </div>

      <div
        v-if="mediaKind === 'screen'"
        class="screen"
      >
        <div class="screen__bar">
          <span class="screen__product">{{ media?.product }}</span>
          <span class="screen__caption">{{ media?.caption }}</span>
        </div>
        <div class="screen__body">
          <SanityImg
            v-if="hasImage"
            :image="media!.image!"
            :alt="media?.alt"
            sizes="sm:100vw lg:50vw xl:600px"
            loading="eager"
          />
          <Placeholder
            v-else
            class="screen__placeholder"
            :label="media?.label"
          />
        </div>
      </div>

      <div
        v-else-if="mediaKind === 'photo'"
        class="photo"
      >
        <SanityImg
          v-if="hasImage"
          :image="media!.image!"
          :alt="media?.alt"
          sizes="sm:100vw lg:50vw xl:600px"
          loading="eager"
        />
        <Placeholder
          v-else
          class="photo__placeholder"
          :label="media?.label"
        />
        <div class="photo__strip">
          <span>{{ media?.caption }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero__inner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  align-items: center;
  gap: var(--split-gap);
  max-width: var(--content-width);
  margin: 0 auto;
  padding: var(--hero-padding) var(--gutter);
}

.hero__text {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.hero__eyebrow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  color: var(--tone-label);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero__product {
  font-weight: 800;
}

.hero__tagline {
  font-weight: 700;
}

.hero__rule {
  width: 24px;
  height: 1px;
  background: currentColor;
}

.hero__heading {
  font-size: clamp(40px, 5vw, 68px);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.035em;
  text-wrap: balance;
}

.hero__body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 560px;
  color: var(--tone-muted);
  font-size: clamp(17px, 1.6vw, 19px);
  line-height: 1.55;
  letter-spacing: -0.01em;
  text-wrap: pretty;
}

.hero__buttons {
  margin-top: 8px;
}

/* The hero's secondary button sits on white rather than the tint. */
.hero__buttons :deep(.button--secondary) {
  --button-bg: var(--white);
}

.hero__points {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 32px;
  margin-top: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--tone-rule);
}

.hero__points li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 600;
}

.hero__point-number {
  color: var(--blaze-orange);
  font-size: 13px;
  font-weight: 700;
}

.screen {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  border-radius: 16px;
  background: var(--white);
  box-shadow: var(--shadow-window);
}

.screen__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px;
  overflow: hidden;
  border-bottom: 1px solid var(--wild-sand);
  background: var(--light-gray);
  font-size: 12px;
  white-space: nowrap;
}

.screen__product {
  color: var(--family-ground);
  font-weight: 700;
  letter-spacing: 0.04em;
}

.screen__caption {
  overflow: hidden;
  color: var(--text-muted-ui);
  text-overflow: ellipsis;
}

.screen__body {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--light-gray);
}

.screen__body img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.screen__placeholder {
  position: absolute;
  inset: 16px;
  width: auto;
  height: auto;
}

.photo {
  display: grid;
  grid-template-columns: 3.5fr 1fr;
  height: clamp(300px, 45vw, 480px);
  min-width: 0;
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo__placeholder {
  --placeholder-bg: var(--wild-sand);
  --placeholder-border: var(--rule);
  --placeholder-ink: var(--text-muted-ui);
}

.photo__strip {
  display: flex;
  align-items: flex-end;
  padding: 20px 16px;
  background: var(--family-ground);
}

.photo__strip span {
  color: var(--family-surface);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}
</style>
