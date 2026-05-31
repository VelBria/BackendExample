import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";

// ============================================================
//  PLANTILLA — MODELO NoSQL (MongoDB con Mongoose + Typegoose)
// ------------------------------------------------------------
// Renombra "Documento" por tu colección real, cambia el nombre
// de la colección y ajusta los campos a tu dominio.
// ============================================================

//  CAMBIAR: enum de ejemplo. Bórralo o adáptalo a tu caso de uso.
export enum EstadoDocumento {
    BORRADOR = "BORRADOR",
    PUBLICADO = "PUBLICADO",
    ARCHIVADO = "ARCHIVADO"
}

@modelOptions({
    schemaOptions: {
        collection: "documentos", //  CAMBIAR: nombre de la colección en Mongo
        timestamps: true          // agrega automáticamente createdAt y updatedAt
    }
})
export class Documento {
    @prop({ required: true, trim: true })
    public titulo!: string;

    @prop({ trim: true })
    public contenido?: string; //  campo opcional de ejemplo

    @prop({ enum: EstadoDocumento, default: EstadoDocumento.BORRADOR })
    public estado?: EstadoDocumento;

    //  ejemplo de arreglo. Borra si no lo necesitas.
    @prop({ type: () => [String], default: [] })
    public etiquetas?: string[];
}

export const DocumentoModel = getModelForClass(Documento);
