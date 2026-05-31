import { Model } from "sequelize";

// ============================================================
//  PLANTILLA — TABLA INTERMEDIA (relación N:M Recurso ↔ Categoria)
// ------------------------------------------------------------
// Define la tabla puente de una relación muchos-a-muchos.
// El campo "nota" muestra cómo guardar datos extra en la relación.
// Las llaves foráneas (idRecursoRC / idCategoriaRC) deben coincidir
// con el foreignKey/otherKey declarados en RecursoModel y CategoriaModel.
// ============================================================

interface RecursoCategoriaAtributos {
    idRecursoRC: number;
    idCategoriaRC: number;
    nota: string | null;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class RecursoCategoriaModel extends Model<RecursoCategoriaAtributos> implements RecursoCategoriaAtributos {
        idRecursoRC!: number;
        idCategoriaRC!: number;
        nota!: string | null;

        static associate(models: any) {
            // TODO: agrega aquí relaciones adicionales si las necesitas.
        }
    }

    RecursoCategoriaModel.init({
        idRecursoRC: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: { model: "Recurso", key: "idRecurso" }
        },
        idCategoriaRC: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: { model: "Categoria", key: "idCategoria" }
        },
        nota: {
            type: DataTypes.STRING,
            allowNull: true //  dato extra de la relación (ej. fecha, rol, cantidad)
        }
    }, {
        sequelize,
        modelName: "RecursoCategoria"
    });

    return RecursoCategoriaModel;
};
