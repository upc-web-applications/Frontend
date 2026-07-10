function normalizeText(value) {
  return (value || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function parseDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function getSlaLimitHours(ticket) {
  const explicitLimit = Number(ticket.slaLimiteHoras)
  if (Number.isFinite(explicitLimit) && explicitLimit > 0) return explicitLimit

  const criticality = normalizeText(ticket.nivelCriticidad)
  if (criticality.includes('critico')) return 4
  if (criticality.includes('importante') || criticality.includes('alto')) return 8
  if (criticality.includes('moderado') || criticality.includes('medio')) return 24
  return 72
}

export function isClosedTicket(ticket) {
  return normalizeText(ticket.estado).includes('cerrado')
}

export function evaluateSla(ticket, now = new Date()) {
  const createdAt = parseDate(ticket.fechaCreacion)
  const slaLimiteHoras = getSlaLimitHours(ticket)

  if (!createdAt) {
    return {
      fechaLimiteSla: '',
      horasTranscurridas: 0,
      slaLimiteHoras,
      slaIncumplido: false
    }
  }

  const deadline = new Date(createdAt.getTime() + slaLimiteHoras * 60 * 60 * 1000)
  const horasTranscurridas = Math.max(0, Math.floor((now.getTime() - createdAt.getTime()) / 3600000))
  const slaIncumplido = !isClosedTicket(ticket) && now.getTime() > deadline.getTime()

  return {
    fechaLimiteSla: deadline.toISOString(),
    horasTranscurridas,
    slaLimiteHoras,
    slaIncumplido
  }
}

export function withSlaEvaluation(ticket, now = new Date()) {
  return {
    ...ticket,
    ...evaluateSla(ticket, now)
  }
}

export function needsSlaSync(ticket, evaluatedTicket) {
  return Boolean(ticket.slaIncumplido) !== Boolean(evaluatedTicket.slaIncumplido)
    || (ticket.fechaLimiteSla || '') !== (evaluatedTicket.fechaLimiteSla || '')
    || Number(ticket.slaLimiteHoras || 0) !== Number(evaluatedTicket.slaLimiteHoras || 0)
}

export function buildComputedSlaAlert(ticket, now = new Date()) {
  const evaluatedTicket = withSlaEvaluation(ticket, now)
  return {
    id: `ticket-${ticket.id}`,
    ticketId: ticket.id,
    ticketNumber: ticket.ticketNumber,
    horasTranscurridas: evaluatedTicket.horasTranscurridas,
    slaLimiteHoras: evaluatedTicket.slaLimiteHoras,
    fechaAlerta: now.toISOString().split('T')[0],
    notificadoA: null,
    notificadoNombre: 'Supervisor',
    computedFromTicket: true
  }
}
