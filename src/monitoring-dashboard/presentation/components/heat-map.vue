<script setup>
defineProps({
  zones: Array,
  selectedSector: Object
})

const emit = defineEmits(['select-sector'])

function riskClass(level) {
  if (level === 'Critico') return 'risk-critical'
  if (level === 'Alto' || level === 'Medio') return 'risk-medium'
  if (level === 'Bajo') return 'risk-low'
  return 'risk-neutral'
}
</script>

<template>
  <div class="heat-grid">
    <button
      v-for="zone in zones"
      :key="zone.id"
      class="heat-zone"
      :class="[riskClass(zone.riskLevel), zone.position, selectedSector && selectedSector.id === zone.id ? 'selected' : '']"
      @click="emit('select-sector', zone)">
      <span>{{ zone.name }}</span>
      <small>{{ zone.riskLevel }} - {{ zone.heatIndex }}</small>
    </button>
  </div>
</template>

<style scoped>
.heat-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.5rem;
  min-height: 270px;
  align-items: center;
  width: 100%;
  overflow: hidden;
}

.heat-zone {
  border: 0;
  border-radius: 6px;
  min-height: 108px;
  color: #fff;
  cursor: pointer;
  padding: 1rem;
  text-transform: uppercase;
  letter-spacing: 0;
  overflow: hidden;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.heat-zone.wide {
  grid-column: span 2;
}

.heat-zone.center {
  grid-column: span 3;
}

.heat-zone span {
  display: block;
  font-weight: 700;
  margin-bottom: 0.6rem;
}

.heat-zone small {
  opacity: 0.85;
}

.heat-zone.selected {
  outline: 3px solid #ff5b00;
  outline-offset: 3px;
}

@media (max-width: 900px) {
  .heat-grid {
    grid-template-columns: 1fr;
  }

  .heat-zone.wide,
  .heat-zone.center {
    grid-column: span 1;
  }
}
</style>
