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

// The stacked layout puts the text above a wide screenshot window. It only
// applies to a product screen; anything else falls back to the split layout.
const stacked = computed(() => props.hero.layout === 'stacked' && mediaKind.value === 'screen')
const frameColours = {
  nightBordeaux: 'var(--night-bordeaux)',
  deepSea: 'var(--deep-sea-green)',
  mirage: 'var(--mirage)',
}
const frameColour = computed(() => frameColours[media.value?.frameColor ?? 'nightBordeaux'])
const windowStyle = computed(() => ({
  '--window-bar': frameColour.value,
  '--image-aspect': imageAspect(media.value?.image),
}))
</script>

<template>
  <section
    class="hero section"
    :class="[`tone--${hero.tone ?? 'surface'}`, { 'hero--stacked': stacked }]"
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
          v-if="hero.body?.length || hero.ctas?.length"
          class="hero__side"
        >
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
        v-if="stacked"
        class="window"
        :style="windowStyle"
      >
        <div class="window__bar">
          <span /><span /><span />
        </div>
        <div class="window__viewport">
          <SanityImg
            v-if="hasImage"
            :image="media!.image!"
            :alt="media?.alt"
            sizes="sm:100vw lg:960px"
            loading="eager"
          />
          <Placeholder
            v-else
            class="window__placeholder"
            :label="media?.label"
          />
        </div>
      </div>

      <div
        v-else-if="mediaKind === 'screen'"
        class="screen"
      >
        <div
          v-if="media?.product || media?.caption"
          class="screen__bar"
        >
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

.hero__side {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
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

/* Only the placeholder gets a background. Behind an image, a light background
   shows through the anti-aliased rounded corners as a pale outline. */
.screen__body {
  position: relative;
  aspect-ratio: 16 / 10;
}

.screen__body:has(.screen__placeholder) {
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

/* Stacked layout: eyebrow, then the heading beside the body and buttons, then
   a wide screenshot window cut off flat by the section's bottom edge. */
.hero--stacked {
  overflow: hidden;
  border-bottom: 1px solid var(--rule);
}

.hero--stacked .hero__inner {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 0;
  container-type: inline-size;
}

.hero--stacked .hero__text {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  align-items: end;
  gap: 24px 64px;
}

.hero--stacked .hero__eyebrow,
.hero--stacked .hero__points {
  grid-column: 1 / -1;
}

/* Smaller than the split heading so the two columns balance. */
.hero--stacked .hero__heading {
  font-size: clamp(36px, 4vw, 48px);
}

/* Sits the buttons' baseline on the heading's last line. */
.hero--stacked .hero__side {
  padding-bottom: 6px;
}

.hero--stacked .hero__buttons {
  margin-top: 0;
}

.window {
  position: relative;
  width: 100%;
  max-width: 960px;
  height: clamp(240px, 36vw, 460px);
  /* Never taller than the title bar plus the whole screenshot, so a narrow
     window doesn't show white space below it. */
  max-height: calc(32px + min(100cqw, 960px) * var(--image-aspect, 100));
  margin: clamp(16px, 4vw, 40px) auto 0;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
  background: var(--white);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.28);
}

.window__bar {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px;
  background: var(--window-bar);
}

.window__bar span {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
}

/* The screenshot keeps its natural height, anchored top-left; the window's
   fixed height crops the bottom. */
.window__viewport img {
  display: block;
  width: 100%;
  height: auto;
}

.window .window__placeholder {
  position: absolute;
  inset: 48px 16px 0;
  width: auto;
  height: auto;
  border-bottom: 0;
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
