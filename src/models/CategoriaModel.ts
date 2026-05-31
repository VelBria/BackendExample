import { Model } from "sequelize";

// ============================================================
//  PLANTILLA — MODELO SQL (entidad secundaria / lado N:M)
// ------------------------------------------------------------
// Ejemplo del "otro lado" de una relación muchos-a-muchos.
// Si no necesitas relaciones, puedes borrar este archivo,
// CategoriaController y la tabla intermedia RecursoCategoria.
// ============================================================

interface CategoriaAtributos {
    idCategoria: number;
    nombre: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
    class CategoriaModel extends Model<CategoriaAtributos> implements CategoriaAtributos {
        idCategoria!: number;
        nombre!: string;

        static associate(models: any) {
            CategoriaModel.belongsToMany(models.Recurso, {
                through: "RecursoCategoria",
                foreignKey: "idCategoriaRC",
                otherKey: "idRecursoRC"
            });
        }
    }

    CategoriaModel.init({
        idCategoria: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { notEmpty: true }
        }
    }, {
        sequelize,
        modelName: "Categoria"
    });

    return CategoriaModel;
};
