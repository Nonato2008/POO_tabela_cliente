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
    alterar: async (cliente, telefone, endereco, id) => {
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
            // posso trazer de forma separada
            const [clientes] = await connection.execute(`
                SELECT 
                    *
                FROM clientes c
                INNER JOIN enderecos e ON e.IdCliente = c.id
                INNER JOIN telefones t ON t.idCliente = c.id;
            `);

            return clientes;

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