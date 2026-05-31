import 'reflect-metadata';
import { PORT, NODE_ENV } from './config';
import Server from './provider/Server';
import express from 'express';
import cors from 'cors';

// 🔧 PLANTILLA — Importa aquí tus controllers
import RecursoController from './controllers/RecursoController';
import DocumentoController from './controllers/DocumentoController';

const server: Server = new Server({
    port: PORT,
    env: NODE_ENV,
    middlewares: [
        express.json(),
        express.urlencoded({ extended: true }),
        cors()
    ],
    controllers: [
        // 🔧 PLANTILLA — Registra aquí la instancia (Singleton) de cada controller
        RecursoController.instance,
        DocumentoController.instance
    ]
});
server.init();
