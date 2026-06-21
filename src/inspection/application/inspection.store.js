import { defineStore } from 'pinia'
import { ref } from 'vue'
import { InspectionApi } from '@/inspection/infrastructure/inspection-api.js'
import { InspectionAssembler } from '@/inspection/infrastructure/inspection.assembler.js'
/**
 * @author u20241a322  Blancas Chávez, Carlos Franco
 */
const api = new InspectionApi()
export const useInspectionStore = defineStore('inspection', () => {
    const inspections = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { api.getInspections().then(r => { inspections.value = InspectionAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => errors.value.push(e)) }
    function getById(id) { return inspections.value.find(i => i.id === parseInt(id)) }
    function add(inspection) { return api.create(inspection).then(r => { const entity = InspectionAssembler.toEntityFromResource(r.data); inspections.value.push(entity); return entity }).catch(e => errors.value.push(e)) }
    function remove(id) { return api.delete(id).then(() => { const i = inspections.value.findIndex(ins => ins.id === id); if (i !== -1) inspections.value.splice(i, 1) }).catch(e => errors.value.push(e)) }
    return { inspections, errors, loaded, fetchAll, getById, add, remove }
})
