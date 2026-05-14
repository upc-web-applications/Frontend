import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ActivoApi } from '@/activo/infrastructure/activo-api.js'
import { ActivoAssembler } from '@/activo/infrastructure/activo.assembler.js'
const api = new ActivoApi()
export const useActivoStore = defineStore('activo', () => {
    const activos = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { api.getActivos().then(r => { activos.value = ActivoAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => errors.value.push(e)) }
    function getById(id) { return activos.value.find(a => a.id === parseInt(id)) }
    function getByAreaId(aId) { return activos.value.filter(a => a.areaId === parseInt(aId) && a.estado === 'Activo') }
    function add(activo) { return api.createActivo(activo).then(r => activos.value.push(ActivoAssembler.toEntityFromResource(r.data))).catch(e => errors.value.push(e)) }
    function update(activo) { return api.updateActivo(activo).then(r => { const u = ActivoAssembler.toEntityFromResource(r.data); const i = activos.value.findIndex(a => a.id === u.id); if (i !== -1) activos.value[i] = u }).catch(e => errors.value.push(e)) }
    function remove(id) { return api.deleteActivo(id).then(() => { const i = activos.value.findIndex(a => a.id === id); if (i !== -1) activos.value.splice(i, 1) }).catch(e => errors.value.push(e)) }
    return { activos, errors, loaded, fetchAll, getById, getByAreaId, add, update, remove }
})
