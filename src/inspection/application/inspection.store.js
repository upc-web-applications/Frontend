import { defineStore } from 'pinia'
import { ref } from 'vue'
import { InspectionApi } from '@/inspection/infrastructure/inspection-api.js'
import { InspectionAssembler } from '@/inspection/infrastructure/inspection.assembler.js'
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
const api = new InspectionApi()
export const useInspectionStore = defineStore('inspection', () => {
    const inspections = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { return api.getInspections().then(r => { inspections.value = InspectionAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    function getById(id) { return inspections.value.find(i => i.id === parseInt(id)) }
    function add(inspection) { return api.create(inspection).then(r => { const entity = InspectionAssembler.toEntityFromResource(r.data); inspections.value.push(entity); return entity }).catch(e => errors.value.push(e)) }
    function update(inspection) {
        return api.update(inspection).then(r => {
            const entity = InspectionAssembler.toEntityFromResource(r.data)
            const index = inspections.value.findIndex(ins => ins.id === entity.id)
            if (index !== -1) inspections.value[index] = entity
            return entity
        }).catch(e => { errors.value.push(e); return Promise.reject(e) })
    }
    function cancel(id) {
        const current = getById(id)
        if (!current) return Promise.reject(new Error('Inspection not found'))
        return update({ ...current, estado: 'Cancelada', fechaActualizacion: new Date().toISOString() })
    }
    function remove(id) { return cancel(id) }
    return { inspections, errors, loaded, fetchAll, getById, add, update, cancel, remove }
})
