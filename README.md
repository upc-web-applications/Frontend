# RiskGuard

RiskGuard es una aplicacion web para apoyar la gestion de seguridad y salud en el trabajo. El operario registra una incidencia asociada a un activo; el supervisor revisa el reporte, asigna la atencion correctiva y verifica el resultado; el administrador consulta indicadores para el seguimiento ejecutivo.

Este repositorio contiene el frontend desarrollado con Vue 3. La aplicacion se mantiene organizada por bounded contexts y por capas, con una separacion clara entre la interfaz, el estado, los modelos y el acceso a los servicios.

## Tecnologias

- Vue 3 y JavaScript
- Vite
- Pinia
- Vue Router
- Vue I18n
- PrimeVue
- Axios
- jsPDF, AutoTable y XLSX para exportaciones

## Bounded contexts

- `identity-access`: autenticacion, sesiones, roles y control de acceso.
- `organization-assets`: sedes, areas y activos.
- `inspection`: registro, consulta y cancelacion logica de inspecciones.
- `risk-assessment`: evaluacion de riesgo, peligros, patrones y criticidad.
- `mitigation`: tickets correctivos, tecnicos, mitigaciones, verificaciones y SLA.
- `monitoring-dashboard`: dashboard operativo, mapa de calor y mantenimiento.
- `reports`: indicadores, historial, alertas, reportes y plan SST.
- `shared`: componentes, estilos, rutas y servicios comunes.

Cada contexto sigue, cuando corresponde, la estructura:

```text
application/
domain/
infrastructure/
presentation/
```

Los `assembler.js` convierten los nombres y estados de la interfaz al contrato del backend. Esta decision mantiene el dominio de la interfaz en espanol sin obligar al backend a cambiar sus nombres tecnicos.

## Flujo de trabajo

### Operario

1. Inicia sesion y llega a `/inspection/list`.
2. Registra una inspeccion en `/inspection/new`, seleccionando tipo de incidente, sede, area, activo, urgencia y descripcion.
3. La inspeccion queda disponible para la revision del supervisor.
4. Consulta sus propios reportes y puede cancelarlos de forma logica cuando corresponda.

### Supervisor

1. Inicia sesion y llega a `/monitoring/dashboard`.
2. Revisa los reportes recibidos y el mapa de calor.
3. Convierte un reporte valido en un ticket correctivo y asigna un tecnico.
4. Da seguimiento al trabajo, revisa el SLA y verifica la medida implementada.
5. Cierra el ticket cuando la verificacion es favorable o lo reabre cuando la medida no es suficiente.
6. Administra sedes, areas, activos y tecnicos.

### Administrador

1. Inicia sesion y llega a `/reportes/dashboard`.
2. Consulta indicadores ejecutivos, historial de incidentes, alertas, tendencias y plan SST.
3. Usa la informacion consolidada para seguimiento y toma de decisiones.

## Requisitos

- Node.js 20 o superior
- .NET SDK 9 para compilar el backend
- MySQL 8 con el servicio activo en `localhost:3306`

El backend y el frontend se ejecutan desde carpetas separadas. Para una prueba local, el backend debe estar disponible antes de abrir la interfaz.

## Configuracion local

El frontend usa `.env.development` con esta URL:

```text
VITE_RISKGUARD_API_URL="http://localhost:5175/api/v1"
```

El backend usa la base `riskguard-platform`. En una instalacion nueva se puede crear con:

```sql
CREATE DATABASE `riskguard-platform`;
```

Las credenciales de base de datos y el secreto JWT deben manejarse mediante configuracion local o variables de entorno. No se deben publicar credenciales reales en un repositorio.

## Ejecucion

Primero, backend:

```cmd
cd Backend-main
dotnet restore
dotnet run --urls http://localhost:5175
```

Las migraciones pendientes se ejecutan antes de la carga de datos iniciales. Swagger queda disponible en:

```text
http://localhost:5175/swagger
```

Luego, frontend:

```cmd
cd Frontend-main
npm.cmd install
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```

La aplicacion queda disponible en `http://127.0.0.1:5173/login`.

JSON Server se conserva como respaldo temporal para desarrollo aislado, pero la fuente principal de datos de esta version es ASP.NET con MySQL.

## Usuarios demo

| Rol | Correo | Contrasena |
| --- | --- | --- |
| Operario | `operario@riskguard.tech` | `Risk123` |
| Supervisor | `supervisor@riskguard.tech` | `Risk123` |
| Administrador | `admin@riskguard.tech` | `Risk123` |

## Validacion local

En esta iteracion se verifico:

- Arranque del backend con una base nueva mediante migraciones.
- Compilacion del backend con `dotnet build --no-restore`.
- Compilacion del frontend con `npm.cmd run build`.
- Disponibilidad de Swagger y del documento OpenAPI.
- Inicio de sesion y permisos basicos de los tres roles.
- Acceso del operario a sus inspecciones y a los datos de sedes, areas y activos necesarios para registrar un reporte.
- Proteccion de endpoints para accesos anonimos y operaciones administrativas.
- Cambio de idioma en la interfaz principal, conservando sin traducir los valores ingresados por el usuario.
- Inicio del Operario en `/inspection/list`, consulta de sus propios reportes y registro de una inspeccion.
- Conversion de nombres del frontend al contrato tecnico del backend al guardar una inspeccion.
- Cancelacion logica de una inspeccion, conservando el registro con estado `Cancelada`.
- Inicio del Supervisor en `/monitoring/dashboard`, carga de contadores, mapa de calor y reportes recibidos.
- Carga de `Tickets Correctivos` y filtrado local por numero de ticket.
- Inicio del Administrador en `/reportes/dashboard` y carga de indicadores ejecutivos.

Todavia debe repetirse, preferentemente con datos controlados, el flujo completo de convertir un reporte en ticket, asignar un tecnico, registrar la mitigacion y emitir la verificacion del supervisor. Esta comprobacion evita alterar los datos demo durante las pruebas y debe realizarse antes del despliegue definitivo.

## Recomendaciones para el equipo

- No subir `node_modules/` ni `dist/`.
- Mantener los secretos fuera de los archivos versionados.
- Levantar primero MySQL y el backend, y despues Vite.
- Revisar en Swagger los contratos cuando se modifique un endpoint.
- Mantener los nombres tecnicos del backend en los assemblers, sin trasladar esa conversion a los componentes Vue.
