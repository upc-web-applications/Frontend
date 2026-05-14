import { defineStore } from 'pinia'
import { ref } from 'vue'
import { HazardApi } from '@/hazard/infrastructure/hazard-api.js'
import { HazardAssembler } from '@/hazard/infrastructure/hazard.assembler.js'
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
const api = new HazardApi()
export const useHazardStore = defineStore('hazard', () => {
    const hazards = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { api.getHazards().then(r => { hazards.value = HazardAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => errors.value.push(e)) }
    function getById(id) { return hazards.value.find(h => h.id === parseInt(id)) }
    function add(hazard) { return api.createHazard(hazard).then(r => hazards.value.push(HazardAssembler.toEntityFromResource(r.data))).catch(e => errors.value.push(e)) }
    function update(hazard) { return api.updateHazard(hazard).then(r => { const u = HazardAssembler.toEntityFromResource(r.data); const i = hazards.value.findIndex(h => h.id === u.id); if (i !== -1) hazards.value[i] = u }).catch(e => errors.value.push(e)) }
    function remove(id) { return api.deleteHazard(id).then(() => { const i = hazards.value.findIndex(h => h.id === id); if (i !== -1) hazards.value.splice(i, 1) }).catch(e => errors.value.push(e)) }
    return { hazards, errors, loaded, fetchAll, getById, add, update, remove }
})
