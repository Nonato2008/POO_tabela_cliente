import { connection } from '../configs/Database.js'

const clienteRepository = {

    criar: async (cliente, telefone, endereco) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            // INSERT CLIENTE
            const sqlCli = 'INSERT INTO clientes(Nome, Cpf) VALUES (?,?);'
            const valuesCli = [cliente.nome, cliente.cpf]
            const [rowsCli] = await conn.execute(sqlCli, valuesCli);

            // INSERT TELEFONE 
            const sqlTel = 'INSERT INTO telefones(IdCliente, Telefone) VALUES (?,?);'
            const valuesTel = [rowsCli.insertId, telefone.telefones];
            const [rowsTel] = await conn.execute(sqlTel, valuesTel);

            // // INSERT ENDEREÇO
            const SqlEnd = 'INSERT INTO enderecos(IdCliente, Cep, Logradouro, Numero, Complemento, Bairro, Cidade, Uf) VALUES (?,?,?,?,?,?,?,?)';
            const valuesEnd = [rowsCli.insertId, endereco.cep, endereco.logradouro, endereco.numero, endereco.complemento, endereco.bairro, endereco.cidade, endereco.uf];
            const [rowsEnd] = await conn.execute(SqlEnd, valuesEnd)

            await conn.commit();

            return { rowsCli, rowsTel, rowsEnd }

        } catch (error) {
            await conn.rollback();
            console.error("Erro ao criar cliente:", error);
            throw error;
        }
        finally {
            conn.release();
        }
    },
    alterar: async (cliente, telefone, endereco,id) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();
            
            // UPDATE CLIENTE
            const sqlCli = 'UPDATE clientes SET Nome = ?, Cpf = ? WHERE id = ?'
            const valuesCli = [cliente.nome, cliente.cpf, id]
            const [rowsCli] = await conn.execute(sqlCli, valuesCli);

            console.log(telefone.id, telefone.telefones, id);
            
            //UPDATE TELEFONE
            const sqlTel = 'UPDATE telefones SET Telefone = ? WHERE idCliente=?'
            const valuesTel = [telefone.telefones, id];
            const [rowsTel] = await conn.execute(sqlTel, valuesTel);

            // //UPDATE ENDEREÇO 
            const sqlEnd = 'UPDATE enderecos SET Cep=?, Logradouro=?, Numero=?, Complemento=?, Bairro=?, Cidade=?, Uf=? WHERE idCliente=?'
            const valuesEnd = [endereco.cep, endereco.logradouro, endereco.numero, endereco.complemento, endereco.bairro, endereco.cidade, endereco.uf, id]
            const [rowsEnd] = await conn.execute(sqlEnd, valuesEnd)

            await conn.commit();

            return { rowsCli, rowsTel, rowsEnd }

        } catch (error) {
            await conn.rollback();
            console.error("Erro ao criar cliente:", error);
            throw error;
        }
        finally {
            conn.release();
        }
        
    },

    selecionar: async () => {


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
    },

    deletar: async (id) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            //DELETE ENDEREÇO
            const sqlEnd = 'DELETE FROM enderecos WHERE IdCliente = ?';
            const valuesEnd = [id];
            const [rowsEnd] = await conn.execute(sqlEnd, valuesEnd)

            //DELETE TELEFONE
            const sqlTel = 'DELETE FROM telefones WHERE IdCliente = ?';
            const valuesTel = [id];
            const [rowsTel] = await conn.execute(sqlTel, valuesTel)

            // DELETE CLIENTE
            const sqlCli = 'DELETE FROM clientes WHERE id = ?'
            const valuesCli = [id]
            const [rowsCli] = await conn.execute(sqlCli, valuesCli);






            await conn.commit();

            return { rowsCli, rowsTel, rowsEnd }


        } catch (error) {
            await conn.rollback();
            console.error("Erro ao criar cliente:", error);
            throw error;
        }
        finally {
            conn.release();
        }

    }
};

export default clienteRepository;