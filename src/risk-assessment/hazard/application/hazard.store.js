import { defineStore } from 'pinia'
import { ref } from 'vue'
import { HazardApi } from '@/risk-assessment/hazard/infrastructure/hazard-api.js'
import { HazardAssembler } from '@/risk-assessment/hazard/infrastructure/hazard.assembler.js'
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
const api = new HazardApi()
export const useHazardStore = defineStore('hazard', () => {
    const hazards = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { return api.getHazards().then(r => { hazards.value = HazardAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    function getById(id) { return hazards.value.find(h => h.id === id) }
    function add(hazard) { return api.createHazard(hazard).then(r => { const e = HazardAssembler.toEntityFromResource(r.data); hazards.value.push(e); return e }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    function update(hazard) { return api.updateHazard(hazard).then(r => { const u = HazardAssembler.toEntityFromResource(r.data); const i = hazards.value.findIndex(h => h.id === u.id); if (i !== -1) hazards.value[i] = u; return u }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    function remove(id) { return api.deleteHazard(id).then(() => { const i = hazards.value.findIndex(h => h.id === id); if (i !== -1) hazards.value.splice(i, 1) }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    return { hazards, errors, loaded, fetchAll, getById, add, update, remove }
})
