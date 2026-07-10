import { defineStore } from 'pinia'
import { ref } from 'vue'
import { VerificacionMedidaApi } from '@/mitigation/infrastructure/verificacion-medida-api.js'
import { VerificacionMedidaAssembler } from '@/mitigation/infrastructure/verificacion-medida.assembler.js'

const api = new VerificacionMedidaApi()
export const useVerificacionMedidaStore = defineStore('verificacionMedida', () => {
    const verificaciones = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { errors.value = []; return api.getVerificaciones().then(r => { verificaciones.value = VerificacionMedidaAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => errors.value.push(e)) }
    function getById(id) { return verificaciones.value.find(v => v.id === id) }
    function getByTicketId(tId) { return verificaciones.value.filter(v => v.ticketId === tId) }
    function add(verificacion) { return api.createVerificacion(verificacion).then(r => { const e = VerificacionMedidaAssembler.toEntityFromResource(r.data); verificaciones.value.push(e); return e }).catch(e => errors.value.push(e)) }
    function update(verificacion) { return api.updateVerificacion(verificacion).then(r => { const u = VerificacionMedidaAssembler.toEntityFromResource(r.data); const i = verificaciones.value.findIndex(v => v.id === u.id); if (i !== -1) verificaciones.value[i] = u; return u }).catch(e => errors.value.push(e)) }
    function remove(id) { return api.deleteVerificacion(id).then(() => { const i = verificaciones.value.findIndex(v => v.id === id); if (i !== -1) verificaciones.value.splice(i, 1) }).catch(e => errors.value.push(e)) }
    return { verificaciones, errors, loaded, fetchAll, getById, getByTicketId, add, update, remove }
})
