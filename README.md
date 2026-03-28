# MultiplicaGO

Aplicacion web educativa y gamificada para aprender y practicar las tablas de multiplicar del 1 al 12.

Esta app fue disenada para una experiencia juvenil, moderna y motivadora, con enfoque pedagogico real:

- progresion por niveles,
- practica guiada con feedback inmediato,
- modos de juego variados,
- dificultad adaptable,
- refuerzo positivo,
- guardado de progreso en `localStorage`.

## Tecnologias

- React
- JavaScript
- HTML
- CSS
- Vite
- GitHub Pages (`gh-pages`)

## Funcionalidades principales

- Pantalla de inicio con accesos rapidos y guia de uso.
- Modo Aprender con tabla completa, navegacion y patrones.
- Modo Practica Guiada por tabla especifica.
- Modo Mezcla Total.
- Modo Contrarreloj.
- Modo Supervivencia.
- Modo Racha Perfecta.
- Desafios por niveles:
  - Nivel 1: tablas 1, 2 y 3
  - Nivel 2: tablas 4, 5 y 6
  - Nivel 3: tablas 7, 8 y 9
  - Nivel 4: tablas 10, 11 y 12
  - Nivel Final: mezcla 1 al 12
- Panel de progreso con:
  - tablas dominadas y pendientes,
  - porcentaje de aciertos,
  - record de puntaje,
  - racha maxima,
  - niveles completados,
  - insignias/medallas.

## Requisitos

- Node.js 18+ (recomendado)
- npm 9+

## Instalacion

```bash
npm install
```

## Ejecucion local

```bash
npm run dev
```

Abre la URL mostrada por Vite en tu navegador.

## Build de produccion

```bash
npm run build
```

La version compilada se genera en la carpeta `dist/`.

## Deploy en GitHub Pages

### 1) Crea el repositorio en GitHub

Sube este proyecto a tu repositorio (rama principal: `main` o `master`).

### 2) Ejecuta deploy

```bash
npm run deploy
```

Este comando:
- compila el proyecto (`predeploy`),
- publica `dist/` en la rama `gh-pages`.

### 3) Activa GitHub Pages

En el repositorio:
- `Settings` -> `Pages`
- `Source`: `Deploy from a branch`
- `Branch`: `gh-pages` y carpeta `/ (root)`

## Scripts disponibles

```bash
npm run dev
npm run build
npm run preview
npm run deploy
```

## Estructura del proyecto

```text
.
├── index.html
├── package.json
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   ├── styles/
│   └── utils/
└── vite.config.js
```

## Persistencia local

La app guarda en `localStorage`:

- progreso general,
- puntajes maximos,
- niveles desbloqueados,
- niveles completados,
- tablas mas practicadas,
- tablas con mas errores,
- racha maxima,
- insignias desbloqueadas.

## Nota de mantenimiento

El proyecto esta modularizado para escalar facilmente:

- componentes reutilizables,
- logica de preguntas separada,
- sistema de progreso desacoplado,
- paginas por responsabilidad.
