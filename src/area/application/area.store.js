import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AreaApi } from '@/area/infrastructure/area-api.js'
import { AreaAssembler } from '@/area/infrastructure/area.assembler.js'
/**
 * @author u20241a322  Blancas Chávez, Carlos Franco
 */
const api = new AreaApi()
export const useAreaStore = defineStore('area', () => {
    const areas = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { api.getAreas().then(r => { areas.value = AreaAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => errors.value.push(e)) }
    function getById(id) { return areas.value.find(a => a.id === parseInt(id)) }
    function getBySedeId(sId) { return areas.value.filter(a => a.sedeId === parseInt(sId)) }
    function add(area) { return api.createArea(area).then(r => areas.value.push(AreaAssembler.toEntityFromResource(r.data))).catch(e => errors.value.push(e)) }
    function update(area) { return api.updateArea(area).then(r => { const u = AreaAssembler.toEntityFromResource(r.data); const i = areas.value.findIndex(a => a.id === u.id); if (i !== -1) areas.value[i] = u }).catch(e => errors.value.push(e)) }
    function remove(id) { return api.deleteArea(id).then(() => { const i = areas.value.findIndex(a => a.id === id); if (i !== -1) areas.value.splice(i, 1) }).catch(e => errors.value.push(e)) }
    return { areas, errors, loaded, fetchAll, getById, getBySedeId, add, update, remove }
})
