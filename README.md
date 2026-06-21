# RiskGuard Unified Frontend

Aplicacion web unificada de RiskGuard construida con Vue 3, JavaScript, PrimeVue, Pinia, Vue Router, Vue I18n y JSON Server.

## Bounded contexts

- `identity-access`: autenticacion, sesiones y roles.
- `site`, `area`, `asset`: sedes, areas y activos industriales.
- `inspection`: reporte de incidentes y condiciones inseguras.
- `risk-assessment`: evaluacion IPERC, patrones y mapa de calor.
- `mitigation`: acciones correctivas, tickets, verificaciones y SLA.
- `monitoring-dashboard`: monitoreo operativo para supervisores.
- `reports`: dashboard ejecutivo y cumplimiento SST.

## Usuarios demo

| Rol | Correo | Contrasena |
| --- | --- | --- |
| Operario | `operario@riskguard.tech` | `Risk123` |
| Supervisor | `supervisor@riskguard.tech` | `Risk123` |
| Administrador/Gerente | `administrador@riskguard.tech` | `Risk123` |

Cada rol tiene rutas y navegacion propias. Los intentos de acceso a funciones de otro rol son redirigidos al inicio correspondiente.

## Ejecucion local

```sh
npm install
npm run server
npm run dev
```

La aplicacion usa `http://localhost:3000/api/v1` como API local y el frontend se sirve normalmente en `http://localhost:5173`.

## Verificacion

```sh
npm run build
```
