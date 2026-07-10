import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MitigationApi } from '@/mitigation/infrastructure/mitigation-api.js'
import { MitigationAssembler } from '@/mitigation/infrastructure/mitigation.assembler.js'
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
const api = new MitigationApi()
export const useMitigationStore = defineStore('mitigation', () => {
    const mitigations = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { return api.getMitigations().then(r => { mitigations.value = MitigationAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    function getById(id) { return mitigations.value.find(m => m.id === id) }
    function getByAssessmentId(aId) { return mitigations.value.filter(m => m.riskAssessmentId === aId) }
    function getByTicketId(tId) { return mitigations.value.find(m => m.ticketId === tId) }
    function add(mitigation) { return api.createMitigation(mitigation).then(r => { const e = MitigationAssembler.toEntityFromResource(r.data); mitigations.value.push(e); return e }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    function update(mitigation) { return api.updateMitigation(mitigation).then(r => { const u = MitigationAssembler.toEntityFromResource(r.data); const i = mitigations.value.findIndex(m => m.id === u.id); if (i !== -1) mitigations.value[i] = u; return u }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    function remove(id) { return api.deleteMitigation(id).then(() => { const i = mitigations.value.findIndex(m => m.id === id); if (i !== -1) mitigations.value.splice(i, 1) }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    return { mitigations, errors, loaded, fetchAll, getById, getByAssessmentId, getByTicketId, add, update, remove }
})
