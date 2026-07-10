# RiskGuard Unified Frontend

RiskGuard es una aplicacion web para apoyar la gestion de seguridad industrial. El frontend permite registrar incidencias inspeccionadas por operarios, convertirlas en tickets correctivos gestionados por supervisores y visualizar informacion ejecutiva para administradores.

Este proyecto corresponde al frontend unificado construido con Vue 3 y organizado bajo una estructura inspirada en DDD y bounded contexts.

## Stack

- Vue 3
- JavaScript
- Vite
- PrimeVue
- PrimeFlex
- Pinia
- Vue Router
- Vue I18n
- Axios
- JSON Server para desarrollo
- jsPDF, jsPDF AutoTable y XLSX para exportacion de reportes

## Bounded Contexts

La aplicacion esta organizada en los siguientes bounded contexts:

- `identity-access`: autenticacion, usuarios, roles, sesiones y logs de acceso.
- `organization-assets`: sedes, areas y activos industriales.
- `inspection`: registro y seguimiento de inspecciones/incidencias.
- `risk-assessment`: evaluacion de riesgo, criticidad, patrones e IPERC.
- `mitigation`: tickets correctivos, tecnicos, mitigaciones, verificaciones y alertas SLA.
- `monitoring-dashboard`: dashboard operativo del supervisor y mapa de calor.
- `reports`: dashboard ejecutivo, reportes, historial, alertas, indicadores predictivos y plan SST.
- `shared`: componentes, infraestructura base y recursos compartidos.

## Flujo Por Rol

### Operario

1. Inicia sesion.
2. Ingresa por defecto a `/inspection/list`.
3. Registra una nueva inspeccion en `/inspection/new`.
4. Selecciona tipo de incidente, sede, area, activo vinculado, urgencia y descripcion.
5. El sistema guarda la inspeccion como reporte recibido.
6. Puede revisar sus inspecciones y cancelar logicamente una inspeccion si corresponde.

### Supervisor

1. Inicia sesion.
2. Ingresa por defecto a `/monitoring/dashboard`.
3. Revisa el dashboard con mapa de calor y KPIs operativos.
4. Revisa reportes recibidos desde `/inspection/list`.
5. Convierte un reporte valido en ticket correctivo desde `/mitigation/tickets/new?reporteId=...`.
6. Asigna un tecnico al ticket.
7. Da seguimiento al ticket correctivo.
8. Verifica la medida implementada.
9. Si la verificacion se aprueba, el ticket se cierra; si se rechaza, se reabre.
10. Gestiona sedes, areas, activos y tecnicos desde la seccion de gestion operativa.

### Administrador

1. Inicia sesion.
2. Ingresa por defecto a `/reportes/dashboard`.
3. Revisa indicadores ejecutivos.
4. Consulta reportes, historial de incidentes, alertas, indicadores predictivos y plan SST.
5. Analiza informacion consolidada para seguimiento de cumplimiento y toma de decisiones.

## Usuarios Demo

| Rol | Correo | Contrasena |
| --- | --- | --- |
| Operario | `operario@riskguard.tech` | `Risk123` |
| Supervisor | `supervisor@riskguard.tech` | `Risk123` |
| Administrador | `administrador@riskguard.tech` | `Risk123` |

## Ejecucion Local

Instalar dependencias:

```bash
npm install
```

Levantar JSON Server:

```bash
npm run server
```

Levantar Vite:

```bash
npm run dev
```

URLs locales:

- Frontend: `http://localhost:5173`
- API mock: `http://localhost:3000/api/v1`

Si `localhost` no carga correctamente, usar:

```text
http://127.0.0.1:5173/login
```

## Build

```bash
npm run build
```

El build genera la carpeta `dist/`. Esta carpeta no debe subirse al repositorio porque se genera automaticamente.

## Variables De Entorno

Desarrollo:

```text
VITE_RISKGUARD_API_URL="http://localhost:3000/api/v1"
```

Produccion:

```text
VITE_RISKGUARD_API_URL="https://db-server-risk-0r34.onrender.com"
```

## Estructura General

```text
src/
  identity-access/
  organization-assets/
  inspection/
  risk-assessment/
  mitigation/
  monitoring-dashboard/
  reports/
  shared/
  locales/
  assets/
  router.js
  main.js
```

Cada bounded context sigue una separacion por capas:

```text
application/
domain/
infrastructure/
presentation/
```

## Estado De Validacion

La aplicacion fue validada antes de preparar esta version para GitHub.

Resumen:

- Build de produccion ejecutado correctamente.
- i18n revisado sin claves faltantes.
- Textos raros y tildes retirados de `src`.
- Logs de depuracion retirados del modulo de reportes.
- Relacion inspeccion/reporte a ticket correctivo validada como 1 a 1.
- `node_modules`, `dist` y `.idea` excluidos por `.gitignore`.
- `node_modules` y `dist` fueron eliminados del directorio local antes de preparar el envio.

Ver detalle en:

- [Reporte de validacion](docs/validation-report.md)
- [Notas de arquitectura y flujo](docs/workflow-and-architecture.md)

## Notas Para El Equipo

- No subir `node_modules/`.
- No subir `dist/`.
- No subir `.idea/`.
- Usar `npm install` despues de clonar el proyecto.
- Para demo local, levantar primero `npm run server` y luego `npm run dev`.
- El endpoint de inspecciones puede tardar mas que otros endpoints porque algunas evidencias fotograficas estan guardadas como base64 en `server/db.json`.

