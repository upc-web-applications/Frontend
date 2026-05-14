import { defineStore } from 'pinia'
import { ref } from 'vue'
import { SedeApi } from '@/sede/infrastructure/sede-api.js'
import { SedeAssembler } from '@/sede/infrastructure/sede.assembler.js'
const api = new SedeApi()
export const useSedeStore = defineStore('sede', () => {
    const sedes = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() {
        api.getSedes().then(r => { sedes.value = SedeAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => errors.value.push(e))
    }
    function getById(id) { return sedes.value.find(s => s.id === parseInt(id)) }
    function add(sede) { return api.createSede(sede).then(r => sedes.value.push(SedeAssembler.toEntityFromResource(r.data))).catch(e => errors.value.push(e)) }
    function update(sede) { return api.updateSede(sede).then(r => { const u = SedeAssembler.toEntityFromResource(r.data); const i = sedes.value.findIndex(s => s.id === u.id); if (i !== -1) sedes.value[i] = u }).catch(e => errors.value.push(e)) }
    function remove(id) { return api.deleteSede(id).then(() => { const i = sedes.value.findIndex(s => s.id === id); if (i !== -1) sedes.value.splice(i, 1) }).catch(e => errors.value.push(e)) }
    return { sedes, errors, loaded, fetchAll, getById, add, update, remove }
})
