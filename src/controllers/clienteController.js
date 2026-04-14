import { Cliente } from "../models/Cliente.js"
import { Telefone } from "../models/Telefone.js"
import { Endereco } from "../models/Endereco.js"
import clienteRepository from "../repositories/clienteRepository.js";
import axios from "axios";

const clienteController = {


    criar: async (req, res) => {
        try {
            let { nome, cpf, telefones, cep, numero, complemento } = req.body;

            // BLOQUEIA se não vier telefone
            if (!telefones) {
                return res.status(400).json({
                    message: "É obrigatório informar pelo menos um telefone"
                });
            }

            // NORMALIZA
            if (typeof telefones === "string") {
                telefones = telefones.includes(',')
                    ? telefones.split(',').map(t => t.trim())
                    : [telefones];
            }

            console.log("TELEFONES FINAL:", telefones);

            const cepRegex = /^[0-9]{8}$/;
            if (!cepRegex.test(cep)) {
                return res.status(400).json({ message: 'Verifique o cep informado' });
            }

            const respApi = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

            if (respApi.data.erro) {
                throw new Error('Erro ao consultar o cep na API');
            }

            const clientes = Cliente.criar({ nome, cpf });
            const telefonesObj = Telefone.criar({ telefones });

            const enderecos = Endereco.criar({
                cep,
                numero,
                complemento,
                logradouro: respApi.data.logradouro,
                uf: respApi.data.uf,
                cidade: respApi.data.localidade,
                bairro: respApi.data.bairro
            });

            const result = await clienteRepository.criar(clientes, telefonesObj, enderecos);

            res.status(201).json({ data: result });

        } catch (error) {
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: error.message
            });
        }
    },
    deletar: async (req, res) => {

        try {
            const id = req.params.id;
            const result = await clienteRepository.deletar(id);
            res.status(201).json({ result })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
        }

    },
    editar: async (req, res) => {
        try {
            const id = req.params.id;
            let { nome, cpf, telefones, cep, numero, complemento } = req.body;

            const respApi = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

            if (respApi.data.erro) {
                throw new Error('Erro ao consultar o cep na API');
            }

            const clientes = Cliente.alterar({ nome, cpf },id);

            const telefonesObj = Telefone.alterar({ telefones });

            const enderecos = Endereco.alterar({
                cep,
                numero,
                complemento,
                logradouro: respApi.data.logradouro,
                uf: respApi.data.uf,
                cidade: respApi.data.localidade,
                bairro: respApi.data.bairro
            });

            const result = await clienteRepository.alterar(clientes, telefonesObj, enderecos,id);

            res.status(201).json({ data: result });

        } catch (error) {
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: error.message
            });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await clienteRepository.selecionar();
            res.status(201).json({ result })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
        }
    }



};

export default clienteController;

async function consultarCep(cep) {
    try {
        const respApi = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

        if (respApi.data.erro) {
            throw new Error('CEP não encontrado')
        }

        return respApi.data;
    } catch (error) {
        console.error(error)
        throw new Error("Erro ao buscar o CEP", error.message)
    }
}