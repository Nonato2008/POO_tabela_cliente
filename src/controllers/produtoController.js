import {Produto} from "../models/Produto.js"
import  produtoRepository from "../repositories/protudoRepository.js"

const produtoController={

    criar: async (req,res) => {
        try {
            const {nome, valor, idCategoria} = req.body;
            const vinculoImagem = `/uploads/imagens/${req.file.filename}`
            const produto = Produto.criar({nome, valor, vinculoImagem, idCategoria});
            const result = await produtoRepository.criar(produto);
            res.status(201).json({result})
        } catch (error) {
            console.log(error);
            res.status(500).json({message:'Ocorreu um erro no servidor', errorMessage: error.message})
        }
    },
    editar: async (req,res) => {
        try {
            const id = req.params.id;
            const {nome, valor,idCategoria} = req.body;
            const produto = Produto.alterar({nome, valor, idCategoria},id);
            const result = await produtoRepository.editar(produto);
            res.status(201).json({result})
        } catch (error) {
            console.log(error);
            res.status(500).json({message:'Ocorreu um erro no servidor', errorMessage: error.message})
        }
    },
    deletar: async (req,res) => {
        try {
            const id = req.params.id;
            const result = await produtoRepository.deletar(id);
            res.status(201).json({result})
        } catch (error) {
            console.log(error);
            res.status(500).json({message:'Ocorreu um erro no servidor', errorMessage: error.message})
        }
    },
    selecionar: async (req,res) => {
        try {
            const result = await produtoRepository.selecionar();
            res.status(201).json({result})
        } catch (error) {
            console.log(error);
            res.status(500).json({message:'Ocorreu um erro no servidor', errorMessage: error.message})
        }
    }
}

export default produtoController