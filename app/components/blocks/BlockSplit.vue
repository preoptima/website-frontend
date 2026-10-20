<script setup lang="ts">
import type { SplitBlock } from '~/types/sanity'

const props = defineProps<{ block: SplitBlock }>()

const showPlaceholders = useShowPlaceholders()
const media = computed(() => props.block.media)
const hasImage = computed(() => !!media.value?.image?.asset)
const mediaKind = computed(() => {
  const kind = media.value?.kind ?? 'none'
  if (kind === 'none' || kind === 'video') return kind
  return hasImage.value && kind === 'image' ? 'image' : showPlaceholders ? 'placeholder' : 'none'
})
const hasMedia = computed(() => mediaKind.value !== 'none')

const listStyle = computed(() => props.block.list?.style ?? 'none')
const items = computed(() => (listStyle.value === 'none' ? [] : props.block.list?.items ?? []))
const hasExtras = computed(() => items.value.length > 0 || !!props.block.ctas?.length || !!props.block.stats?.length)
</script>

<template>
  <section
    class="section"
    :class="`tone--${block.tone ?? 'default'}`"
  >
    <div
      class="section__inner split"
      :class="{
        'split--statement': !hasMedia,
        'split--media-left': block.mediaPosition === 'left',
        'split--extras': hasExtras,
      }"
    >
      <div class="split__text">
        <HeadingText
          :heading="block.heading"
          class="h2"
        />
        <template v-if="hasMedia">
          <p
            v-for="(paragraph, index) in block.body"
            :key="index"
            class="split__paragraph"
          >
            {{ paragraph }}
          </p>
        </template>
      </div>

      <div
        v-if="!hasMedia && block.body?.length"
        class="split__statement"
      >
        <p
          v-for="(paragraph, index) in block.body"
          :key="index"
          class="split__paragraph"
        >
          {{ paragraph }}
        </p>
      </div>

      <div
        v-if="hasMedia"
        class="split__media"
      >
        <SanityImg
          v-if="mediaKind === 'image'"
          :image="media!.image!"
          :alt="media?.alt"
          :style="{ aspectRatio: aspectRatio(media?.aspect) }"
          sizes="sm:100vw lg:50vw xl:600px"
        />
        <component
          :is="media?.videoUrl ? 'a' : 'div'"
          v-else-if="mediaKind === 'video'"
          :href="media?.videoUrl"
          class="video"
          target="_blank"
          rel="noopener"
        >
          <SanityImg
            v-if="hasImage"
            :image="media!.image!"
            class="video__poster"
            sizes="sm:100vw lg:50vw xl:600px"
          />
          <span class="video__play">
            <svg
              width="22"
              height="22"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M5 3.5v9l7-4.5z" />
            </svg>
          </span>
          <span
            v-if="media?.label || media?.alt"
            class="video__label"
          >{{ media?.label || media?.alt }}</span>
        </component>
        <Placeholder
          v-else
          class="split__placeholder"
          :label="media?.label"
          :style="{ aspectRatio: aspectRatio(media?.aspect) }"
        />
      </div>

      <div
        v-if="hasExtras"
        class="split__extras"
      >
        <div
          v-if="block.stats?.length"
          class="stats"
        >
          <div
            v-for="stat in block.stats"
            :key="stat._key"
            class="stat"
          >
            <span
              v-if="stat.label"
              class="stat__label"
            >{{ stat.label }}</span>
            <span class="stat__value">{{ stat.value }}</span>
            <span
              v-if="stat.text"
              class="stat__text"
            >{{ stat.text }}</span>
          </div>
        </div>

        <ol
          v-if="listStyle === 'numbered' && items.length"
          class="numbered"
        >
          <li
            v-for="(item, index) in items"
            :key="index"
          >
            <span class="numbered__number">{{ listNumber(index) }}</span>
            <span>{{ item }}</span>
          </li>
        </ol>

        <ul
          v-if="listStyle === 'chips' && items.length"
          class="chips"
        >
          <li
            v-for="(item, index) in items"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>

        <div
          v-if="block.ctas?.length"
          class="buttons"
        >
          <ButtonCta
            v-for="cta in block.ctas"
            :key="cta._key"
            :cta="cta"
            default-style="brand"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.split {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  align-items: center;
  gap: 40px var(--split-gap);
}

.split--statement {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr));
  align-items: start;
}

.split__text,
.split__statement,
.split__extras {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.split__statement {
  gap: 14px;
}

.split__paragraph {
  color: var(--tone-muted);
  font-size: 17px;
  line-height: 1.55;
  text-wrap: pretty;
}

.split__statement .split__paragraph {
  line-height: 1.6;
}

.split__media {
  min-width: 0;
}

.split--extras .split__media {
  grid-row: span 2;
}

.split--media-left .split__media {
  order: -1;
}

.split--statement .split__extras {
  grid-column: -2 / -1;
}

.split__media img {
  width: 100%;
  object-fit: cover;
}

.split__placeholder {
  --placeholder-bg: var(--tone-placeholder);
  --placeholder-border: var(--tone-label);
  --placeholder-ink: var(--tone-label);
}

.video {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  aspect-ratio: 16 / 9;
  padding: 24px;
  background: var(--mirage);
  text-align: center;
}

.video__poster {
  position: absolute;
  inset: 0;
  height: 100%;
  opacity: 0.6;
}

.video__play {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--family-ground);
  color: var(--white);
}

.video__label {
  position: relative;
  color: var(--wild-sand);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  gap: 16px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 28px;
  background: var(--white);
  box-shadow: inset 0 0 0 1px var(--wild-sand);
  color: var(--mirage);
}

.stat__label {
  color: var(--family-ground);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.stat__value {
  font-size: clamp(40px, 4vw, 56px);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.04em;
}

.stat__text {
  color: var(--text-secondary-ui);
  font-size: 15px;
  line-height: 1.5;
}

.numbered {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--tone-rule-strong);
}

.numbered li {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--tone-rule);
  font-size: 16px;
  line-height: 1.45;
}

.numbered__number {
  flex: none;
  width: 24px;
  color: var(--tone-number);
  font-size: 12px;
  font-weight: 700;
}

.chips {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  gap: 8px;
}

.chips li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: var(--tone-chip);
  font-size: 15px;
  font-weight: 600;
}

.chips li::before {
  content: '';
  flex: none;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--tone-label);
}
</style>
