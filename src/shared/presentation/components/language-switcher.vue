<script setup>
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, availableLocales } = useI18n()

function setLocale(language) {
  locale.value = language
}

watch(locale, (language) => {
  localStorage.setItem('riskguard-locale', language)
}, { immediate: true })
</script>

<template>
  <div class="language-switcher" role="group" aria-label="Language selector">
    <button
      v-for="language in availableLocales"
      :key="language"
      type="button"
      class="language-option"
      :class="{ active: locale === language }"
      @click="setLocale(language)"
    >
      {{ language.toUpperCase() }}
    </button>
  </div>
</template>

<style scoped>
.language-switcher {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--rg-border);
  border-radius: 8px;
  background: var(--rg-card);
}

.language-option {
  min-width: 42px;
  height: 30px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--rg-text-muted);
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.language-option.active {
  background: var(--rg-primary);
  color: #ffffff;
}

.language-option:not(.active):hover {
  color: var(--rg-text);
  background: rgba(255, 255, 255, 0.05);
}
</style>
