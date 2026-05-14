import { defineStore } from 'pinia'
import { ref } from 'vue'
import { InspeccionApi } from '@/inspeccion/infrastructure/inspeccion-api.js'
import { InspeccionAssembler } from '@/inspeccion/infrastructure/inspeccion.assembler.js'
const api = new InspeccionApi()
export const useInspeccionStore = defineStore('inspeccion', () => {
    const inspecciones = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { api.getInspecciones().then(r => { inspecciones.value = InspeccionAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => errors.value.push(e)) }
    function getById(id) { return inspecciones.value.find(i => i.id === parseInt(id)) }
    function add(inspeccion) { return api.create(inspeccion).then(r => { const entity = InspeccionAssembler.toEntityFromResource(r.data); inspecciones.value.push(entity); return entity }).catch(e => errors.value.push(e)) }
    function remove(id) { return api.delete(id).then(() => { const i = inspecciones.value.findIndex(ins => ins.id === id); if (i !== -1) inspecciones.value.splice(i, 1) }).catch(e => errors.value.push(e)) }
    return { inspecciones, errors, loaded, fetchAll, getById, add, remove }
})
