<script setup>
defineProps({
  label: String,
  value: [String, Number],
  icon: String,
  status: {
    type: String,
    default: 'normal'
  }
})
</script>

<template>
  <div class="kpi-card" :class="status">
    <div>
      <span>{{ label }}</span>
      <strong>{{ value }}</strong>
    </div>
    <i :class="icon"></i>
  </div>
</template>

<style scoped>
.kpi-card {
  min-height: 112px;
  background: #111821;
  border: 1px solid #202a38;
  border-left: 4px solid #00c97b;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kpi-card.warning {
  border-left-color: #ff5b00;
}

.kpi-card.danger {
  border-left-color: #ff3b30;
}

.kpi-card span {
  color: #8a8f9a;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.kpi-card strong {
  display: block;
  font-size: 2rem;
  margin-top: 0.5rem;
}

.kpi-card i {
  color: #8a8f9a;
  font-size: 1.5rem;
}
</style>
