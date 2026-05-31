import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import { DocumentoModel } from "../modelsNOSQL/Documento";

// ============================================================
//  PLANTILLA — CONTROLLER NoSQL con CRUD completo (Mongoose)
// ------------------------------------------------------------
// Renombra "Documento", cambia el prefijo ("documento") y ajusta
// las consultas a tu colección. Patrón Singleton: la instancia
// se registra en src/index.ts como DocumentoController.instance.
//
// Rutas resultantes (montadas bajo /documento):
//   GET    /documento        -> listar todos
//   GET    /documento/:id    -> obtener uno
//   POST   /documento        -> crear
//   PUT    /documento/:id    -> actualizar
//   DELETE /documento/:id    -> eliminar
// ============================================================
export default class DocumentoController extends AbstractController {
    private static _instance: DocumentoController;
    public static get instance(): DocumentoController {
        return this._instance || (this._instance = new this("documento")); //  CAMBIAR prefijo
    }

    protected initRoutes(): void {
        this.router.get("/", this.getAll.bind(this));
        this.router.get("/:id", this.getById.bind(this));
        this.router.post("/", this.create.bind(this));
        this.router.put("/:id", this.update.bind(this));
        this.router.delete("/:id", this.delete.bind(this));
    }

    // READ — listar todos (más recientes primero)
    private async getAll(req: Request, res: Response): Promise<void> {
        try {
            const documentos = await DocumentoModel.find().sort({ createdAt: -1 });
            res.status(200).json(documentos);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    // READ — obtener uno por _id
    private async getById(req: Request, res: Response): Promise<void> {
        try {
            const documento = await DocumentoModel.findById(req.params.id);
            if (!documento) {
                res.status(404).json({ mensaje: "Documento no encontrado" });
                return;
            }
            res.status(200).json(documento);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    // CREATE
    private async create(req: Request, res: Response): Promise<void> {
        try {
            const documento = await DocumentoModel.create(req.body);
            res.status(201).json({ mensaje: "Documento creado exitosamente", id: documento._id });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    // UPDATE
    private async update(req: Request, res: Response): Promise<void> {
        try {
            const documento = await DocumentoModel.findByIdAndUpdate(req.params.id, req.body, {
                new: true,          // devuelve el documento ya actualizado
                runValidators: true // aplica las validaciones del schema
            });
            if (!documento) {
                res.status(404).json({ mensaje: "Documento no encontrado" });
                return;
            }
            res.status(200).json({ mensaje: "Documento actualizado exitosamente", documento });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    // DELETE
    private async delete(req: Request, res: Response): Promise<void> {
        try {
            const documento = await DocumentoModel.findByIdAndDelete(req.params.id);
            if (!documento) {
                res.status(404).json({ mensaje: "Documento no encontrado" });
                return;
            }
            res.status(200).json({ mensaje: "Documento eliminado exitosamente" });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
}
