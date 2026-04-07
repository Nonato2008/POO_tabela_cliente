import categoriaController from "../controllers/categoriaController.js";
import { Router } from "express";

const categoriaRoutes = Router();

categoriaRoutes.post('/', categoriaController.criar);
categoriaRoutes.put('/:id', categoriaController.editar);
categoriaRoutes.delete('/:id', categoriaController.deletar);
categoriaRoutes.get('/', categoriaController.selecionar);

export default categoriaRoutes