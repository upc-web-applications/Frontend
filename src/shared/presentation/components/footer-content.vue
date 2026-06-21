<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer class="footer-content">
    <small>@ RiskGuard - {{ t('footer.content') }}</small>
  </footer>
</template>

<style scoped>
.footer-content {
  background: #20232d;
  border-top: 1px solid #2c3140;
  color: #f5f7fb;
  display: flex;
  align-items: center;
  justify-content: center;
  grid-column: 1 / -1;
  min-height: 48px;
  padding: 0.75rem 1rem;
  text-align: center;
  font-weight: 700;
}
</style>
