<script setup lang="ts">
import type { Family, NavSection } from '~/types/sanity'

defineProps<{ active?: NavSection }>()

const { data } = useSiteSettings()
const nav = computed(() => data.value?.navigation)

const ACCENTS: Record<Family, string> = {
  pacer: 'var(--night-bordeaux)',
  concept: 'var(--deep-sea-green)',
}
const accent = (family?: Family) => ACCENTS[family ?? 'concept']

// Mobile menu. Desktop dropdowns are pure CSS (hover and focus-within).
const menuOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => (menuOpen.value = false))
</script>

<template>
  <header
    v-if="nav"
    class="header"
  >
    <div class="header__bar">
      <NuxtLink
        to="/"
        class="header__logo"
        aria-label="Preoptima home"
      >
        <span class="wordmark" />
      </NuxtLink>

      <nav
        class="header__nav"
        aria-label="Main"
      >
        <div
          v-for="group in nav.groups"
          :key="group._key"
          class="nav-group"
        >
          <SanityLink
            :link="group.link"
            class="nav-link nav-group__label"
            :class="{ 'is-active': active && group.section === active }"
            :style="active && group.section === active ? { color: accent(group.accent) } : undefined"
          >
            {{ group.label }}
            <IconChevron />
          </SanityLink>
          <div class="nav-group__menu">
            <SanityLink
              v-for="item in group.items"
              :key="item._key"
              :link="item.link"
              class="nav-item"
            >
              <span class="nav-item__label">
                {{ item.label }}
                <span
                  v-if="item.badge"
                  class="nav-badge"
                  :style="{ background: accent(group.accent) }"
                >{{ item.badge }}</span>
              </span>
              <span
                v-if="item.description"
                class="nav-item__description"
              >{{ item.description }}</span>
            </SanityLink>
          </div>
        </div>
        <SanityLink
          v-for="item in nav.links"
          :key="item._key"
          :link="item.link"
          class="nav-link"
          :class="{ 'is-active': active && item.section === active }"
        >
          {{ item.label }}
        </SanityLink>
      </nav>

      <div class="header__actions">
        <SanityLink
          v-if="nav.signIn"
          :link="nav.signIn.link"
          class="nav-link"
        >
          {{ nav.signIn.label }}
        </SanityLink>
        <ButtonCta
          v-if="nav.cta"
          :cta="nav.cta"
          :arrow="false"
        />
      </div>

      <button
        type="button"
        class="header__toggle"
        :aria-expanded="menuOpen"
        aria-controls="mobile-menu"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        @click="menuOpen = !menuOpen"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path :d="menuOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'" />
        </svg>
      </button>
    </div>

    <div
      v-show="menuOpen"
      id="mobile-menu"
      class="mobile-menu"
    >
      <div class="mobile-menu__inner">
        <div
          v-for="group in nav.groups"
          :key="group._key"
          class="mobile-menu__group"
        >
          <span
            class="mobile-menu__heading"
            :style="{ color: accent(group.accent) }"
          >{{ group.label }}</span>
          <SanityLink
            v-for="item in group.items"
            :key="item._key"
            :link="item.link"
            class="mobile-menu__item"
          >
            {{ item.label }}
            <span
              v-if="item.badge"
              class="nav-badge"
              :style="{ background: accent(group.accent) }"
            >{{ item.badge }}</span>
          </SanityLink>
        </div>
        <SanityLink
          v-for="item in nav.links"
          :key="item._key"
          :link="item.link"
          class="mobile-menu__link"
        >
          {{ item.label }}
        </SanityLink>
        <SanityLink
          v-if="nav.signIn"
          :link="nav.signIn.link"
          class="mobile-menu__link"
        >
          {{ nav.signIn.label }}
        </SanityLink>
        <ButtonCta
          v-if="nav.cta"
          :cta="nav.cta"
          :arrow="false"
          class="mobile-menu__cta"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--white);
  border-bottom: 1px solid var(--wild-sand);
}

.header__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 16px var(--gutter-header);
  white-space: nowrap;
}

.header__logo {
  display: flex;
}

/* The wordmark PNG used as a mask so it can be tinted Deep Sea. */
.wordmark {
  display: block;
  width: 124px;
  height: 26px;
  background-color: var(--deep-sea-green);
  mask: url('/logos/wordmark-mirage.png') center / 100% 100% no-repeat;
}

.header__nav {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 24px;
  min-width: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--deep-sea-green);
  font-size: 15px;
  font-weight: 600;
}

.nav-link.is-active {
  font-weight: 800;
}

.nav-group {
  position: relative;
  padding: 8px 0;
}

.nav-group__menu {
  display: none;
  position: absolute;
  top: 100%;
  left: -16px;
  z-index: 5;
  flex-direction: column;
  min-width: 280px;
  padding: 8px;
  border-radius: var(--radius-control);
  background: var(--white);
  box-shadow: var(--shadow-dropdown);
}

.nav-group:hover .nav-group__menu,
.nav-group:focus-within .nav-group__menu {
  display: flex;
}

.nav-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border-radius: 6px;
  color: var(--mirage);
  font-size: 15px;
  transition: background var(--transition-colour), color var(--transition-colour);
}

.nav-item:hover {
  background: var(--light-gray);
}

.nav-item__label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

.nav-item__description {
  color: var(--text-secondary-ui);
  font-size: 13px;
  white-space: normal;
}

.nav-badge {
  padding: 2px 6px;
  border-radius: var(--radius-control);
  color: var(--white);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 1.4;
  text-transform: uppercase;
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header__toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: var(--radius-control);
  background: transparent;
  color: var(--deep-sea-green);
  cursor: pointer;
  transition: background var(--transition-colour);
}

.header__toggle:hover {
  background: var(--wild-sand);
}

.mobile-menu {
  max-height: calc(100vh - 77px);
  overflow-y: auto;
  border-top: 1px solid var(--wild-sand);
  background: var(--white);
}

.mobile-menu__inner {
  display: flex;
  flex-direction: column;
  padding: 8px var(--gutter-header) 24px;
  font-size: 16px;
  font-weight: 600;
}

.mobile-menu__group {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--wild-sand);
}

.mobile-menu__heading {
  padding: 16px 0 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.mobile-menu__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  color: var(--mirage);
}

.mobile-menu__link {
  padding: 12px 0;
  color: var(--deep-sea-green);
}

.mobile-menu__cta {
  align-self: flex-start;
  margin-top: 16px;
}

/* The only fixed breakpoint in the design. */
@media (max-width: 999px) {
  .header__nav,
  .header__actions {
    display: none;
  }

  .header__toggle {
    display: flex;
  }
}

@media (min-width: 1000px) {
  .mobile-menu {
    display: none !important;
  }
}
</style>
