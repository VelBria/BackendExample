import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from "../models";

// ============================================================
//  PLANTILLA — CONTROLLER SQL con CRUD completo (Sequelize)
// ------------------------------------------------------------
// Renombra "Recurso", cambia el prefijo ("recurso") y ajusta
// las rutas/consultas a tu entidad. Patrón Singleton: la instancia
// se registra en src/index.ts como RecursoController.instance.
//
// Rutas resultantes (montadas bajo /recurso):
//   GET    /recurso             -> listar todos
//   GET    /recurso/:id         -> obtener uno
//   POST   /recurso             -> crear
//   PUT    /recurso/:id         -> actualizar
//   DELETE /recurso/:id         -> eliminar
//   GET    /recurso/:id/categorias  -> ejemplo relación N:M (leer)
//   POST   /recurso/:id/categorias  -> ejemplo relación N:M (asignar)
// ============================================================
export default class RecursoController extends AbstractController {
    private static _instance: RecursoController;
    public static get instance(): RecursoController {
        return this._instance || (this._instance = new this("recurso")); //  CAMBIAR prefijo
    }

    protected initRoutes(): void {
        // CRUD
        this.router.get("/", this.getAll.bind(this));
        this.router.get("/:id", this.getById.bind(this));
        this.router.post("/", this.create.bind(this));
        this.router.put("/:id", this.update.bind(this));
        this.router.delete("/:id", this.delete.bind(this));

        //  Ejemplos de relación N:M (Recurso ↔ Categoria). Borra si no aplican.
        this.router.get("/:id/categorias", this.getConCategorias.bind(this));
        this.router.post("/:id/categorias", this.asignarCategoria.bind(this));
    }

    // READ — listar todos
    private async getAll(req: Request, res: Response) {
        try {
            const recursos = await db.Recurso.findAll();
            res.status(200).json(recursos);
        } catch (err) {
            console.log(err);
            res.status(500).json({ mensaje: err });
        }
    }

    // READ — obtener uno por id
    private async getById(req: Request, res: Response) {
        try {
            const recurso = await db.Recurso.findByPk(req.params.id);
            if (!recurso) {
                res.status(404).json({ mensaje: "Recurso no encontrado" });
                return;
            }
            res.status(200).json(recurso);
        } catch (err) {
            console.log(err);
            res.status(500).json({ mensaje: err });
        }
    }

    // CREATE
    private async create(req: Request, res: Response) {
        try {
            const recurso = await db.Recurso.create(req.body);
            res.status(201).json({ mensaje: "Recurso creado exitosamente", id: recurso.idRecurso });
        } catch (err) {
            console.log(err);
            res.status(500).json({ mensaje: err });
        }
    }

    // UPDATE
    private async update(req: Request, res: Response) {
        try {
            const [filasActualizadas] = await db.Recurso.update(req.body, {
                where: { idRecurso: req.params.id }
            });
            if (filasActualizadas === 0) {
                res.status(404).json({ mensaje: "Recurso no encontrado" });
                return;
            }
            res.status(200).json({ mensaje: "Recurso actualizado exitosamente" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ mensaje: err });
        }
    }

    // DELETE
    private async delete(req: Request, res: Response) {
        try {
            const filasEliminadas = await db.Recurso.destroy({
                where: { idRecurso: req.params.id }
            });
            if (filasEliminadas === 0) {
                res.status(404).json({ mensaje: "Recurso no encontrado" });
                return;
            }
            res.status(200).json({ mensaje: "Recurso eliminado exitosamente" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ mensaje: err });
        }
    }

    // RELACIÓN N:M — leer un recurso junto con sus categorías
    private async getConCategorias(req: Request, res: Response) {
        try {
            const recurso = await db.Recurso.findByPk(req.params.id, {
                include: db.Categoria
            });
            if (!recurso) {
                res.status(404).json({ mensaje: "Recurso no encontrado" });
                return;
            }
            res.status(200).json(recurso);
        } catch (err) {
            console.log(err);
            res.status(500).json({ mensaje: err });
        }
    }

    // RELACIÓN N:M — asignar una categoría existente al recurso
    // Espera body: { "idCategoria": <number>, "nota"?: <string> }
    private async asignarCategoria(req: Request, res: Response) {
        try {
            const recurso = await db.Recurso.findByPk(req.params.id);
            if (!recurso) {
                res.status(404).json({ mensaje: "Recurso no encontrado" });
                return;
            }
            // addCategoria es un método que genera Sequelize por la relación belongsToMany.
            await recurso.addCategoria(req.body.idCategoria, {
                through: { nota: req.body.nota ?? null }
            });
            res.status(200).json({ mensaje: "Categoría asignada al recurso" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ mensaje: err });
        }
    }
}
