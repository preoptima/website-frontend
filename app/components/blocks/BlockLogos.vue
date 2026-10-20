<script setup lang="ts">
import type { LogoStripBlock } from '~/types/sanity'

const props = defineProps<{ block: LogoStripBlock }>()

const showPlaceholders = useShowPlaceholders()
const large = computed(() => props.block.size === 'large')
const partners = computed(() =>
  (props.block.partners ?? []).filter(partner => partner?.logo?.asset || showPlaceholders),
)
</script>

<template>
  <section
    v-if="partners.length"
    class="logos"
    :class="{ 'logos--large': large }"
  >
    <div class="logos__inner">
      <span
        v-if="block.label"
        class="logos__label"
      >{{ block.label }}</span>
      <ul class="logos__grid">
        <li
          v-for="partner in partners"
          :key="partner._id"
        >
          <component
            :is="partner.url ? 'a' : 'div'"
            :href="partner.url"
            class="logos__tile"
          >
            <SanityImg
              v-if="partner.logo?.asset"
              :image="partner.logo"
              :alt="partner.name"
              :sizes="large ? '240px' : '160px'"
            />
            <span
              v-else
              class="logos__placeholder"
            >{{ partner.name }}</span>
          </component>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.logos {
  border-top: 1px solid var(--wild-sand);
  border-bottom: 1px solid var(--wild-sand);
  background: var(--white);
}

.logos__inner {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 40px var(--gutter);
}

.logos--large .logos__inner {
  padding-block: clamp(48px, 7vw, 72px);
}

.logos__label {
  color: var(--text-muted-ui);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.logos--large .logos__label {
  color: var(--family-ground);
}

.logos__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 120px), 1fr));
  gap: clamp(8px, 1.5vw, 16px);
}

.logos--large .logos__grid {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
}

.logos__tile {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  padding: 12px;
  background: var(--light-gray);
}

.logos--large .logos__tile {
  height: 96px;
}

.logos__tile img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.logos__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 4px;
  border: 1px dashed var(--rule-light);
  color: var(--text-muted-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  line-height: 1.3;
  text-align: center;
  text-transform: uppercase;
}
</style>
