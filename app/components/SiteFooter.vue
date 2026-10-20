<script setup lang="ts">
const { data } = useSiteSettings()
const footer = computed(() => data.value?.footer)
</script>

<template>
  <footer
    v-if="footer"
    class="footer"
  >
    <div class="footer__inner">
      <div class="footer__grid">
        <div class="footer__brand">
          <img
            src="/logos/wordmark-wildsand.png"
            alt="Preoptima"
            width="130"
            height="28"
          >
          <span v-if="footer.tagline">{{ footer.tagline }}</span>
        </div>
        <nav
          v-for="column in footer.columns"
          :key="column._key"
          class="footer__column"
          :aria-label="column.heading"
        >
          <span class="footer__heading">{{ column.heading }}</span>
          <SanityLink
            v-for="item in column.links"
            :key="item._key"
            :link="item.link"
          >
            {{ item.label }}
          </SanityLink>
        </nav>
      </div>
      <div class="footer__legal">
        <span>{{ footer.legal }}</span>
        <span>{{ footer.strapline }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--mirage);
  color: var(--wild-sand);
}

.footer__inner {
  display: flex;
  flex-direction: column;
  gap: 56px;
  max-width: var(--content-width);
  margin: 0 auto;
  padding: clamp(48px, 7vw, 72px) var(--gutter) 40px;
}

.footer__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr));
  gap: clamp(28px, 4vw, 40px);
}

.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 14px;
}

.footer__brand img {
  width: 130px;
  height: auto;
}

.footer__column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
}

.footer__column a,
.footer__column span {
  color: var(--wild-sand);
}

.footer__column a:hover {
  color: var(--blaze-orange);
}

.footer__column .footer__heading {
  color: var(--blaze-orange);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.footer__legal {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 13px;
}
</style>
