export class Telefone {
    #id;
    #idCliente;
    #telefone;

    constructor(tId, tIdCliente, tTelefone) {
        this.id = tId;
        this.idCliente = tIdCliente;
        this.telefones = tTelefone;
    }

    //Métodos acessores - GETTERS e SETTERS
    get id() {
        return this.#id;
    }

    set id(value) {

        this.#id = value;
    }

    get idCliente() {
        return this.#idCliente;
    }

    set idCliente(value) {
        this.#idCliente = value;
    }

    get telefones() {
        return this.#telefone;
    }

    set telefones(telefones) {
        this.#validarTelefone(telefones);
        this.#telefone = telefones
    }


    //MÉTODOS AUXILIARES  

    #validarTelefone(telefones) {
        if (!telefones || !Array.isArray(telefones) || telefones.length === 0) {
            throw new Error("É obrigatório informar pelo menos um telefone");
        }

        for (let i = 0; i < telefones.length; i++) {
            const tel = String(telefones[i]).trim();
            const telLimpo = tel.replace(/\D/g, '');

            if (!telLimpo) {
                throw new Error(`Telefone na posição ${i + 1} está vazio`);
            }

            if (telLimpo.length < 10 || telLimpo.length > 11) {
                throw new Error(`Telefone inválido na posição ${i + 1}: "${tel}". Deve ter 10 ou 11 dígitos.`);
            }
        }
    }

    //Criação de projet sutilizando o Design Pattern FACTORY METHOD
    static criar(dados) {
        console.log(dados.telefone)
        return new Telefone(dados.id, dados.telefones);
    }
    static alterar(dados, id) {
        return new Telefone(id, dados.idCliente, dados.telefone);
    }
}