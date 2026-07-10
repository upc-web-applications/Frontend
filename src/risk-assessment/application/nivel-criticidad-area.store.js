import { defineStore } from 'pinia'
import { ref } from 'vue'
import { NivelCriticidadAreaApi } from '@/risk-assessment/infrastructure/nivel-criticidad-area-api.js'
import { NivelCriticidadAreaAssembler } from '@/risk-assessment/infrastructure/nivel-criticidad-area.assembler.js'

const api = new NivelCriticidadAreaApi()
export const useNivelCriticidadAreaStore = defineStore('nivelCriticidadArea', () => {
    const niveles = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { api.getAll().then(r => { niveles.value = NivelCriticidadAreaAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => errors.value.push(e)) }
    function getById(id) { return niveles.value.find(n => n.id === id) }
    function getBySectorId(sId) { return niveles.value.filter(n => n.sectorId === parseInt(sId)) }
    function add(nivel) { return api.create(nivel).then(r => niveles.value.push(NivelCriticidadAreaAssembler.toEntityFromResource(r.data))).catch(e => errors.value.push(e)) }
    function update(nivel) { return api.update(nivel).then(r => { const u = NivelCriticidadAreaAssembler.toEntityFromResource(r.data); const i = niveles.value.findIndex(n => n.id === u.id); if (i !== -1) niveles.value[i] = u }).catch(e => errors.value.push(e)) }
    function remove(id) { return api.delete(id).then(() => { const i = niveles.value.findIndex(n => n.id === id); if (i !== -1) niveles.value.splice(i, 1) }).catch(e => errors.value.push(e)) }
    return { niveles, errors, loaded, fetchAll, getById, getBySectorId, add, update, remove }
})
