<script setup>
import { useI18n } from 'vue-i18n';

const { locale, availableLocales } = useI18n();
</script>

<template>
  <div class="lang-switcher">
    <button
        v-for="lang in availableLocales"
        :key="lang"
        class="lang-btn"
        :class="{ active: locale === lang }"
        @click="locale = lang"
    >
      {{ lang.toUpperCase() }}
    </button>
  </div>
</template>

<style scoped>
.lang-switcher {
  display: flex;
  gap: 6px;
}

.lang-btn {
  padding: 5px 14px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.5px;
}

.lang-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.lang-btn:hover:not(.active) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}
</style>
