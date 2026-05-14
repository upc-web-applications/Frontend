<script setup>
const currentYear = new Date().getFullYear();
</script>

<template>
  <div class="footer-content">
    <div class="footer-section">
      <p class="copyright">
        &copy; {{ currentYear }} RiskGuard. Plant OPS v1.0
      </p>
    </div>
    <div class="footer-section">
      <p class="powered-by">
        Powered by Vue 3 + Vite + PrimeVue
      </p>
    </div>
  </div>
</template>

<style scoped>
.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #0A0C0F;
  border-top: 1px solid #1A1E24;
  color: #9CA3AF;
  font-size: 12px;
}

.footer-section {
  margin: 0;
}

.copyright {
  margin: 0;
  color: #FF5B00;
  font-weight: 500;
}

.powered-by {
  margin: 0;
  color: #9CA3AF;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
</style>