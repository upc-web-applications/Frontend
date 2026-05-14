import { defineStore } from 'pinia'
import { ref } from 'vue'
import { PatronRiesgoApi } from '@/risk-assessment/infrastructure/patron-riesgo-api.js'
import { PatronRiesgoAssembler } from '@/risk-assessment/infrastructure/patron-riesgo.assembler.js'

const api = new PatronRiesgoApi()
export const usePatronRiesgoStore = defineStore('patronRiesgo', () => {
    const patrones = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { api.getPatrones().then(r => { patrones.value = PatronRiesgoAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => errors.value.push(e)) }
    function getById(id) { return patrones.value.find(p => p.id === parseInt(id)) }
    function getBySectorId(sId) { return patrones.value.filter(p => p.sectorId === parseInt(sId)) }
    function add(patron) { return api.createPatron(patron).then(r => patrones.value.push(PatronRiesgoAssembler.toEntityFromResource(r.data))).catch(e => errors.value.push(e)) }
    function update(patron) { return api.updatePatron(patron).then(r => { const u = PatronRiesgoAssembler.toEntityFromResource(r.data); const i = patrones.value.findIndex(p => p.id === u.id); if (i !== -1) patrones.value[i] = u }).catch(e => errors.value.push(e)) }
    function remove(id) { return api.deletePatron(id).then(() => { const i = patrones.value.findIndex(p => p.id === id); if (i !== -1) patrones.value.splice(i, 1) }).catch(e => errors.value.push(e)) }
    return { patrones, errors, loaded, fetchAll, getById, getBySectorId, add, update, remove }
})
