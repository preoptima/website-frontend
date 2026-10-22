<script setup lang="ts">
import type { Card, CardGridBlock } from '~/types/sanity'

const props = defineProps<{ block: CardGridBlock }>()

const MIN_COLUMN = { 2: '420px', 3: '300px', 4: '240px' }

const showPlaceholders = useShowPlaceholders()
const style = computed(() => props.block.cardStyle ?? 'outline')
const columns = computed(() => props.block.columns ?? 3)
const linkAsButton = computed(() => props.block.linkStyle === 'button')
const hasHeader = computed(() => props.block.heading?.text || props.block.intro)
// Card titles sit under the block's heading; without one they're the
// section's top-level headings.
const titleTag = computed(() => (props.block.heading?.text ? 'h3' : 'h2'))

const hasImage = (card: Card) => !!card.media?.image?.asset
const showMedia = (card: Card) =>
  !!card.media && card.media.kind !== 'none' && (hasImage(card) || showPlaceholders)
</script>

<template>
  <section
    class="section"
    :class="`tone--${block.tone ?? 'default'}`"
  >
    <div
      class="section__inner"
      :class="{ 'section__inner--compact': block.spacing === 'compact' }"
    >
      <div
        v-if="hasHeader"
        class="cards__header"
      >
        <HeadingText
          v-if="block.heading?.text"
          :heading="block.heading"
          class="h2"
        />
        <p
          v-if="block.intro"
          class="intro"
        >
          {{ block.intro }}
        </p>
      </div>

      <div
        class="cards__grid"
        :class="[`cards__grid--${style}`, { 'cards__grid--wide': style === 'feature' && columns === 2 }]"
        :style="{ '--min-column': MIN_COLUMN[columns] }"
      >
        <template v-if="style === 'value'">
          <article
            v-for="card in block.cards"
            :key="card._key"
            class="value-card"
          >
            <span class="value-card__icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M8.667 1.333 2 9.333h6l-.667 5.334L14 6.667H8l.667-5.334Z" />
              </svg>
            </span>
            <component
              :is="titleTag"
              class="value-card__title"
            >
              {{ card.title }}
            </component>
            <p class="value-card__body">
              {{ card.body }}
            </p>
          </article>
        </template>

        <template v-else>
          <article
            v-for="card in block.cards"
            :key="card._key"
            class="card"
            :class="[`card--${style}`, { 'card--family': card.family }]"
            :data-family="card.family"
          >
            <div
              v-if="style === 'feature' && (showMedia(card) || card.badge)"
              class="card__media"
            >
              <SanityImg
                v-if="hasImage(card)"
                :image="card.media!.image!"
                :alt="card.media?.alt"
                :sizes="columns === 2 ? 'sm:100vw lg:50vw xl:620px' : 'sm:100vw md:50vw lg:33vw xl:400px'"
              />
              <Placeholder
                v-else-if="showMedia(card)"
                :label="card.media?.label"
              />
              <span
                v-if="card.badge"
                class="card__badge"
              >{{ card.badge }}</span>
            </div>

            <div class="card__content">
              <span
                v-if="card.eyebrow"
                class="card__eyebrow"
              >{{ card.eyebrow }}</span>
              <component
                :is="titleTag"
                v-if="card.title && style !== 'tiles'"
                class="card__title"
                :class="{ 'card__title--large': style === 'feature' && card.subtitle }"
              >
                {{ card.title }}
              </component>
              <p
                v-if="card.subtitle"
                class="card__subtitle"
              >
                {{ card.subtitle }}
              </p>
              <p
                v-if="card.body"
                class="card__body"
              >
                {{ card.body }}
              </p>
              <div
                v-if="style !== 'feature' && showMedia(card)"
                class="card__media card__media--bottom"
              >
                <SanityImg
                  v-if="hasImage(card)"
                  :image="card.media!.image!"
                  :alt="card.media?.alt"
                  sizes="sm:100vw md:50vw lg:33vw xl:400px"
                />
                <Placeholder
                  v-else
                  :label="card.media?.label"
                />
              </div>

              <div class="card__spacer" />

              <template v-if="card.link && resolveLink(card.link.link)">
                <div
                  v-if="linkAsButton"
                  class="card__button"
                >
                  <ButtonCta
                    :cta="card.link"
                    default-style="brand"
                  />
                </div>
                <NuxtLink
                  v-else
                  :to="resolveLink(card.link.link)"
                  class="card__link"
                >
                  {{ card.link.label }}
                  <IconArrow />
                </NuxtLink>
              </template>
              <span
                v-else-if="card.status"
                class="card__status"
              >{{ card.status }}</span>
            </div>
          </article>
        </template>
      </div>

      <div
        v-if="block.ctas?.length"
        class="buttons cards__ctas"
      >
        <ButtonCta
          v-for="cta in block.ctas"
          :key="cta._key"
          :cta="cta"
          default-style="brand"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.cards__header {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 760px;
  margin-bottom: var(--heading-gap);
}

.cards__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--min-column)), 1fr));
  gap: 16px;
}

.cards__grid--wide {
  gap: 24px;
}

.cards__grid--tiles {
  gap: 2px;
  padding: 2px;
  background: var(--tone-tile-frame);
}

.cards__ctas {
  margin-top: 32px;
}

/* The design system's value card, with square corners. */
.value-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  min-height: 180px;
  padding: 16px;
  background: var(--white);
  box-shadow: inset 0 0 0 1px var(--wild-sand);
  color: var(--mirage);
}

.value-card__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--deep-sea-green);
  color: var(--white);
}

.value-card__title {
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
}

.value-card__body {
  font-size: 12px;
  line-height: 18px;
}

.card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  background: var(--white);
  color: var(--mirage);
}

.card--outline,
.card--feature {
  box-shadow: var(--shadow-card);
}

.card--filled {
  background: var(--tone-fill);
}

.card--filled.card--family {
  background: var(--family-surface);
}

/* Product cards take their product's tint. The Wild Sand hairline would read
   as a pale outline on the tint, so only the soft shadow stays. */
.card--feature.card--family {
  --card-rule: rgba(22, 35, 42, 0.15);

  background: var(--family-surface);
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.03);
}

.card__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  padding: clamp(24px, 3vw, 32px);
}

.card--feature .card__content {
  padding: clamp(20px, 4vw, 32px);
}

.card--tiles .card__content {
  padding: 28px;
}

.card__media {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 16 / 9;
  padding: clamp(16px, 3vw, 28px);
  background: var(--family-surface);
}

.card__media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card__media--bottom {
  aspect-ratio: 16 / 10;
  margin-top: 10px;
  padding: 0;
}

.card__media--bottom .placeholder {
  border-color: var(--family-ground);
}

.card__badge {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 10px;
  border-radius: var(--radius-control);
  background: var(--white);
  color: var(--family-ground);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.card__eyebrow {
  color: var(--family-ground);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.card--tiles .card__eyebrow {
  color: var(--family-ground);
}

.card__title {
  font-size: clamp(19px, 2vw, 22px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.card__title--large {
  font-size: 32px;
}

.card__subtitle {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.card__body {
  color: var(--text-secondary-ui);
  font-size: 15px;
  line-height: 1.55;
  text-wrap: pretty;
}

.card--tiles .card__body {
  color: var(--mirage);
}

.card__spacer {
  flex: 1;
}

.card__button {
  display: flex;
  margin-top: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--card-rule, var(--wild-sand));
}

.card__link {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 10px;
  margin-top: 8px;
  color: var(--family-ground);
  font-size: 15px;
  font-weight: 700;
}

.card__status {
  margin-top: 8px;
  color: var(--text-muted-ui);
  font-size: 15px;
  font-weight: 600;
}
</style>
