import  produtoController from "../controllers/produtoController.js"
import uploadImage from "../middlewares/uploadImage.midldleware.js";
import {Router} from "express"

const produtoRoutes = Router();

produtoRoutes.post('/', uploadImage, produtoController.criar);
produtoRoutes.put('/:id', produtoController.editar);
produtoRoutes.delete('/:id',produtoController.deletar);
produtoRoutes.get('/', produtoController.selecionar);

export default produtoRoutes