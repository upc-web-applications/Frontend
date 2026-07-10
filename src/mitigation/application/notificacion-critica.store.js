import { defineStore } from 'pinia'
import { ref } from 'vue'
import { NotificacionCriticaApi } from '@/mitigation/infrastructure/notificacion-critica-api.js'
import { NotificacionCriticaAssembler } from '@/mitigation/infrastructure/notificacion-critica.assembler.js'

const api = new NotificacionCriticaApi()
export const useNotificacionCriticaStore = defineStore('notificacionCritica', () => {
    const notificaciones = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { errors.value = []; return api.getNotificaciones().then(r => { notificaciones.value = NotificacionCriticaAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => errors.value.push(e)) }
    function getById(id) { return notificaciones.value.find(n => n.id === id) }
    function getByTicketId(tId) { return notificaciones.value.filter(n => n.ticketId === tId) }
    function add(notificacion) { return api.createNotificacion(notificacion).then(r => notificaciones.value.push(NotificacionCriticaAssembler.toEntityFromResource(r.data))).catch(e => errors.value.push(e)) }
    function update(notificacion) { return api.updateNotificacion(notificacion).then(r => { const u = NotificacionCriticaAssembler.toEntityFromResource(r.data); const i = notificaciones.value.findIndex(n => n.id === u.id); if (i !== -1) notificaciones.value[i] = u }).catch(e => errors.value.push(e)) }
    function remove(id) { return api.deleteNotificacion(id).then(() => { const i = notificaciones.value.findIndex(n => n.id === id); if (i !== -1) notificaciones.value.splice(i, 1) }).catch(e => errors.value.push(e)) }
    return { notificaciones, errors, loaded, fetchAll, getById, getByTicketId, add, update, remove }
})
