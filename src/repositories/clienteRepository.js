import { pool } from "../configs/Database.js";

const clienteRepository = {

    criar: async (clientes, telefones, enderecos) => {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // 1. Insere na tabela clientes
            const [clienteResult] = await connection.execute(
                `INSERT INTO clientes (nome, cpf) VALUES (?, ?)`,
                [clientes.nome, clientes.cpf]
            );

            const clienteId = clienteResult.insertId;

            // 2. Insere na tabela enderecos
            await connection.execute(
                `INSERT INTO enderecos 
                 (IdCliente, Cep, Uf, Cidade, Bairro, Complemento, Logradouro, Numero) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    clienteId,
                    enderecos.Cep,
                    enderecos.Uf,
                    enderecos.Cidade,
                    enderecos.Bairro,
                    enderecos.Complemento,
                    enderecos.Logradouro,
                    enderecos.Numero
                ]
            );

            // 3. Insere telefones (array)
            if (telefones && telefones.telefone && Array.isArray(telefones.telefone) && telefones.telefone.length > 0) {
                
                const telefonesUnicos = [...new Set(telefones.telefone)];

                for (const telefone of telefonesUnicos) {
                    await connection.execute(
                        `INSERT INTO telefones (IdCliente, Telefone) VALUES (?, ?)`,
                        [clienteId, telefone]
                    );
                }
            }

            await connection.commit();

            return { 
                sucesso: true, 
                mensagem: 'Cliente criado com sucesso',
                clienteId 
            };

        } catch (error) {
            await connection.rollback();
            console.error("Erro ao criar cliente:", error);
            throw error;
        
        }
    },

    selecionar: async () => {
        const connection = await pool.getConnection();

        try {
            // Busca todos os clientes + endereços
            const [clientes] = await connection.execute(`
                SELECT 
                    c.id,
                    c.nome,
                    c.cpf,
                    e.IdCliente,
                    e.Cep,
                    e.Uf,
                    e.Cidade,
                    e.Bairro,
                    e.Complemento,
                    e.Logradouro,
                    e.Numero
                FROM clientes c
                LEFT JOIN enderecos e ON e.IdCliente = c.id
                ORDER BY c.id DESC
            `);

            if (clientes.length === 0) {
                return { 
                    sucesso: true, 
                    total: 0,
                    clientes: [] 
                };
            }

            // Busca todos os telefones
            const [todosTelefones] = await connection.execute(`
                SELECT IdCliente, Telefone 
                FROM telefones 
                ORDER BY IdCliente, id
            `);

            // Agrupa telefones por cliente
            const telefonesPorCliente = new Map();
            todosTelefones.forEach(tel => {
                if (!telefonesPorCliente.has(tel.IdCliente)) {
                    telefonesPorCliente.set(tel.IdCliente, []);
                }
                telefonesPorCliente.get(tel.IdCliente).push(tel.Telefone);
            });

            // Monta o retorno
            const clientesCompletos = clientes.map(c => ({
                id: c.id,
                nome: c.nome,
                cpf: c.cpf,
                enderecosx: {
                    Cep: c.Cep,
                    Uf: c.Uf,
                    Cidade: c.Cidade,
                    Bairro: c.Bairro,
                    Complemento: c.Complemento,
                    Logradouro: c.Logradouro,
                    Numero: c.Numero
                },
                telefones: telefonesPorCliente.get(c.id) || []
            }));

            return {
                sucesso: true,
                total: clientesCompletos.length,
                clientes: clientesCompletos
            };

        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
            return { 
                sucesso: false, 
                mensagem: "Erro interno ao buscar clientes",
                erro: error.message 
            };
        } 
    }
};

export default clienteRepository;