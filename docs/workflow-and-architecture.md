# RiskGuard - Flujo Y Arquitectura Frontend

## Proposito

RiskGuard ayuda a una empresa industrial a registrar incidencias, priorizarlas, asignar acciones correctivas y supervisar el cumplimiento de medidas de seguridad.

La aplicacion no busca representar una fabrica especifica, sino un flujo general que pueda ayudar a mejorar la seguridad en contextos industriales.

## Flujo Principal

```text
Operario registra inspeccion
        |
        v
Supervisor recibe el reporte
        |
        v
Supervisor crea ticket correctivo y asigna tecnico
        |
        v
Tecnico ejecuta la mitigacion
        |
        v
Supervisor verifica la medida
        |
        +--> Aprobado: ticket cerrado
        |
        +--> Rechazado: ticket reabierto
        |
        v
Administrador revisa indicadores y cumplimiento
```

## Relacion Entre Entidades

```text
Sede
  -> Area
      -> Activo
          -> Inspeccion
              -> Ticket Correctivo
                  -> Verificacion
```

Regla acordada para la demo:

```text
1 inspeccion/reporte -> 1 ticket correctivo
```

## Bounded Contexts

### identity-access

Responsable de:

- Usuarios.
- Roles.
- Inicio de sesion.
- Sesiones.
- Logs de acceso.

### organization-assets

Responsable de:

- Sedes.
- Areas.
- Activos.

Este contexto permite que las inspecciones siempre esten asociadas a un activo real dentro de una sede y un area.

### inspection

Responsable de:

- Registro de inspecciones.
- Listado de reportes.
- Detalle de inspeccion.
- Cancelacion logica.

La inspeccion es registrada por el operario y pasa a ser revisada por el supervisor.

### risk-assessment

Responsable de:

- Evaluacion de riesgo.
- Criticidad.
- Patrones.
- Resumenes.
- Catalogo de peligros.

En la UI actual, la evaluacion de riesgo funciona como proceso de apoyo, no como flujo principal independiente para el supervisor.

### mitigation

Responsable de:

- Tickets correctivos.
- Tecnicos.
- Mitigaciones.
- Verificaciones.
- Alertas SLA.
- Historial de tickets.

Es el contexto central para el trabajo del supervisor despues de recibir un reporte.

### monitoring-dashboard

Responsable de:

- Dashboard operativo.
- KPIs del supervisor.
- Mapa de calor.

El mapa de calor esta integrado al dashboard y no se maneja como seccion principal separada.

### reports

Responsable de:

- Dashboard ejecutivo.
- Reportes.
- Historial de incidentes.
- Alertas.
- Indicadores predictivos.
- Plan SST.

Este contexto esta orientado al administrador.

## Rutas Principales

### Operario

```text
/inspection/list
/inspection/new
/inspection/:id
```

### Supervisor

```text
/monitoring/dashboard
/inspection/list
/mitigation/tickets
/mitigation/verificaciones
/mitigation/alertas-sla
/organization-assets/site/list
/organization-assets/area/list
/organization-assets/asset/list
/mitigation/technicians
```

### Administrador

```text
/reportes/dashboard
/reportes/new
/reportes/list
/reportes/history
/reportes/alerts
/reportes/predictive-indicators
/reportes/sst-plan
```

## Estados Del Flujo

### Inspeccion

Estados principales:

```text
Recibido
En revision
Convertido a ticket
No procede
Cancelada
```

### Ticket Correctivo

Estados principales:

```text
Asignado
En ejecucion
Mitigacion reportada
En verificacion
Cerrado
Reabierto
```

### SLA

SLA no es un estado principal. Es un indicador que depende de:

- Criticidad.
- Tiempo transcurrido.
- Estado del ticket.

Si el tiempo excede el limite, se considera alerta SLA.

## Criterio De Preparacion Para GitHub

El frontend queda preparado para GitHub cuando:

- Compila correctamente.
- No tiene `node_modules`.
- No tiene `dist`.
- `.idea/` esta ignorado.
- No hay claves i18n faltantes.
- No hay textos corruptos visibles.
- Los roles tienen rutas separadas.
- El mock data respeta la relacion 1 a 1 entre reporte y ticket.

