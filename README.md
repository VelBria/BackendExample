# Plantilla Backend — Express + TypeScript (SQL + NoSQL)

Base reutilizable para arrancar proyectos rápido. Trae dos bases de datos conectadas
y entidades **placeholder** listas para renombrar:

- **SQL** (MySQL vía Sequelize): `Recurso`, `Categoria` y la tabla intermedia `RecursoCategoria` (relación N:M de ejemplo).
- **NoSQL** (MongoDB vía Mongoose + Typegoose): `Documento`.

Cada placeholder tiene marcadores `🔧 CAMBIAR` donde hay que ajustar nombres/campos.

## Arquitectura

```
src/
├── index.ts                  # Punto de entrada: registra los controllers
├── config/                   # Variables de entorno + config de Sequelize  (no suele tocarse)
├── provider/Server.ts        # Express, middlewares y conexión a ambas DB   (no suele tocarse)
├── controllers/
│   ├── AbstractController.ts  # Base Singleton: router + prefijo            (no suele tocarse)
│   ├── RecursoController.ts   # CRUD SQL de ejemplo
│   └── DocumentoController.ts # CRUD NoSQL de ejemplo
├── models/                   # Modelos SQL (se autocargan desde index.ts)
│   ├── index.ts               # Loader dinámico de Sequelize               (no suele tocarse)
│   ├── RecursoModel.ts        # entidad principal
│   ├── CategoriaModel.ts      # entidad secundaria (lado N:M)
│   └── RecursoCategoria.ts    # tabla intermedia N:M
└── modelsNOSQL/              # Modelos NoSQL
    ├── index.ts               # Conexión a MongoDB                         (no suele tocarse)
    └── Documento.ts           # colección de ejemplo
```

## Puesta en marcha

1. `npm install`
2. Crea tu archivo `.env` con las variables que usa [src/config/index.ts](src/config/index.ts):
   `PORT`, `NODE_ENV`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`,
   `DB_NOSQL_NAME`, `DB_NOSQL_USER`, `DB_NOSQL_PASS`, `DB_NOSQL_HOST`.
3. `npm run build:start` (compila y arranca). Para solo compilar: `npm run build`.

Endpoint de salud: `GET /` → `Server is working 🚀`.

### Rutas de ejemplo

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/recurso` | Listar recursos (SQL) |
| GET | `/recurso/:id` | Obtener un recurso |
| POST | `/recurso` | Crear recurso |
| PUT | `/recurso/:id` | Actualizar recurso |
| DELETE | `/recurso/:id` | Eliminar recurso |
| GET | `/recurso/:id/categorias` | Recurso con sus categorías (N:M) |
| POST | `/recurso/:id/categorias` | Asignar categoría a un recurso |
| GET/POST/PUT/DELETE | `/documento[/:id]` | CRUD de documentos (NoSQL) |

## Cómo usar esta plantilla en un proyecto nuevo

### Renombrar una entidad SQL existente
1. Copia `RecursoModel.ts` → `MiEntidadModel.ts` y reemplaza `Recurso` por `MiEntidad`,
   ajustando atributos y el `modelName`.
2. Copia `RecursoController.ts` → `MiEntidadController.ts`, cambia el prefijo y las consultas (`db.MiEntidad`).
3. Registra `MiEntidadController.instance` en [src/index.ts](src/index.ts).
4. El loader [src/models/index.ts](src/models/index.ts) detecta el modelo nuevo automáticamente; no hay que importarlo a mano.

### Renombrar una entidad NoSQL existente
1. Copia `Documento.ts` → `MiColeccion.ts`, cambia la clase, el nombre de la colección y los campos.
2. Copia `DocumentoController.ts` → `MiColeccionController.ts`, importa tu modelo y cambia el prefijo.
3. Registra el controller en [src/index.ts](src/index.ts).

### Si no necesitas relaciones N:M
Borra `CategoriaModel.ts`, `RecursoCategoria.ts` y los endpoints `*/categorias` de `RecursoController.ts`.
