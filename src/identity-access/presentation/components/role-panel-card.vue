<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  role: {
    type: Object,
    default: null
  }
})

const panelTitle = computed(() => {
  const roleCode = props.role ? props.role.code : ''
  if (roleCode === 'supervisor') return t('account.supervisorPanel')
  if (roleCode === 'plant-operator') return t('account.operatorPanel')
  if (roleCode === 'administrator') return t('account.adminPanel')
  return t('account.title')
})

const panelIcon = computed(() => {
  const roleCode = props.role ? props.role.code : ''
  if (roleCode === 'plant-operator') return 'pi pi-wrench'
  if (roleCode === 'administrator') return 'pi pi-shield'
  return 'pi pi-desktop'
})
</script>

<template>
  <div>
    <div class="flex align-items-center gap-3">
      <div class="role-icon">
        <i :class="panelIcon"></i>
      </div>
      <div>
        <h1>{{ panelTitle }}</h1>
        <p class="muted">{{ t('account.summary') }}</p>
      </div>
    </div>

    <div class="grid mt-4">
      <div class="col-12 md:col-4">
        <div class="info-box">
          <span>{{ t('account.fullName') }}</span>
          <strong>{{ user.fullName }}</strong>
        </div>
      </div>
      <div class="col-12 md:col-4">
        <div class="info-box">
          <span>{{ t('account.role') }}</span>
          <strong>{{ role ? role.name : '-' }}</strong>
        </div>
      </div>
      <div class="col-12 md:col-4">
        <div class="info-box">
          <span>{{ t('account.sector') }}</span>
          <strong>{{ user.sectorId || '-' }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.role-icon {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: #ff5b00;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex: 0 0 auto;
}

h1 {
  margin: 0 0 0.3rem;
}

.info-box {
  border-left: 4px solid #ff5b00;
  background: #151d28;
  border: 1px solid #253246;
  border-radius: 8px;
  padding: 1rem;
  min-height: 96px;
}

.info-box span {
  display: block;
  color: #8a8f9a;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.info-box strong {
  font-size: 1.2rem;
}

</style>
