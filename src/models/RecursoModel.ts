import { Model } from "sequelize";

// ============================================================
// PLANTILLA — MODELO SQL (entidad principal)
// ------------------------------------------------------------
// Renombra "Recurso" por tu entidad real (Producto, Tarea, etc.),
// ajusta los atributos a tu dominio y cambia "modelName" abajo.
// El loader (models/index.ts) registra este archivo automáticamente.
// ============================================================

//  CAMBIAR: enum de ejemplo. Bórralo o adáptalo a tu caso de uso.
export enum EstadoRecurso {
    ACTIVO = "ACTIVO",
    INACTIVO = "INACTIVO",
    ARCHIVADO = "ARCHIVADO"
}

interface RecursoAtributos {
    idRecurso: number;
    nombre: string;
    descripcion: string | null;
    estado: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class RecursoModel extends Model<RecursoAtributos> implements RecursoAtributos {
        idRecurso!: number;
        nombre!: string;
        descripcion!: string | null;
        estado!: string;

        // Relación N:M de ejemplo: un Recurso tiene muchas Categorías.
        // CAMBIAR / borrar si tu entidad no tiene relaciones.
        static associate(models: any) {
            RecursoModel.belongsToMany(models.Categoria, {
                through: "RecursoCategoria",
                foreignKey: "idRecursoRC",
                otherKey: "idCategoriaRC"
            });
        }
    }

    RecursoModel.init({
        idRecurso: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true //  campo opcional de ejemplo
        },
        estado: {
            type: DataTypes.ENUM,
            values: Object.values(EstadoRecurso),
            allowNull: false,
            defaultValue: EstadoRecurso.ACTIVO
        }
    }, {
        sequelize,
        modelName: "Recurso" // CAMBIAR: nombre con el que se accede vía db.Recurso
    });

    return RecursoModel;
};
