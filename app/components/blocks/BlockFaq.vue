<script setup lang="ts">
import { PortableText, type PortableTextComponents } from '@portabletext/vue'
import SanityLink from '~/components/SanityLink.vue'
import type { Faq, FaqBlock, Link } from '~/types/sanity'

const props = defineProps<{ block: FaqBlock }>()

// Questions whose FAQ document was deleted come back as null.
const faqs = computed(() => (props.block.faqs ?? []).filter((faq): faq is Faq => !!faq))

// One answer open at a time, the first by default.
const openIndex = ref(0)
const toggle = (index: number) => (openIndex.value = openIndex.value === index ? -1 : index)

const id = useId()

const components: PortableTextComponents = {
  marks: {
    link: (markProps, { slots }) => h(SanityLink, { link: markProps.value as Link }, slots.default),
  },
}
</script>

<template>
  <section
    class="section"
    :class="`tone--${block.tone ?? 'default'}`"
  >
    <div class="section__inner faq">
      <div class="faq__header">
        <h2 class="h2">
          {{ block.heading || 'Frequently asked questions.' }}
        </h2>
        <p
          v-if="block.contactPrompt || block.contactLink"
          class="faq__contact"
        >
          {{ block.contactPrompt }}
          <template v-if="block.contactLink">
            <SanityLink
              :link="block.contactLink.link"
              class="faq__contact-link"
            >
              {{ block.contactLink.label }}
            </SanityLink>.
          </template>
        </p>
      </div>

      <div class="faq__list">
        <div
          v-for="(faq, index) in faqs"
          :key="faq._id"
          class="faq__item"
        >
          <h3>
            <button
              :id="`${id}-q${index}`"
              type="button"
              class="faq__question"
              :aria-expanded="openIndex === index"
              :aria-controls="`${id}-a${index}`"
              @click="toggle(index)"
            >
              {{ faq.question }}
              <span
                class="faq__toggle"
                aria-hidden="true"
              >{{ openIndex === index ? '−' : '+' }}</span>
            </button>
          </h3>
          <div
            v-show="openIndex === index"
            :id="`${id}-a${index}`"
            role="region"
            :aria-labelledby="`${id}-q${index}`"
            class="faq__answer"
          >
            <PortableText
              v-if="faq.answer"
              :value="faq.answer"
              :components="components"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 48px var(--split-gap);
}

.faq__header {
  display: flex;
  flex: 1 1 340px;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.faq__contact {
  color: var(--text-secondary-ui);
  font-size: 17px;
  line-height: 1.55;
}

.faq__contact-link {
  color: var(--family-ground);
  font-weight: 700;
}

.faq__list {
  display: flex;
  flex: 2 1 480px;
  flex-direction: column;
  min-width: 0;
  border-top: 1px solid var(--rule);
}

.faq__item {
  border-bottom: 1px solid var(--rule-light);
}

.faq__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  padding: 24px 0;
  border: 0;
  background: none;
  color: var(--mirage);
  font: inherit;
  font-size: clamp(17px, 1.6vw, 19px);
  font-weight: 600;
  letter-spacing: -0.01em;
  text-align: left;
  cursor: pointer;
}

.faq__toggle {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--family-surface);
  color: var(--family-ground);
  font-size: 18px;
  font-weight: 500;
}

.faq__answer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 720px;
  margin-bottom: 24px;
  color: var(--text-secondary-ui);
  font-size: 16px;
  line-height: 1.6;
  text-wrap: pretty;
}

.faq__answer :deep(a) {
  color: var(--family-ground);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.faq__contact-link:hover,
.faq__answer :deep(a:hover) {
  color: var(--blaze-orange);
}
</style>
