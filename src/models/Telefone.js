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

    set telefones(value) {
        this.#validarTelefone(value);
        this.#telefone = value
    }


    //MÉTODOS AUXILIARES  

    #validarTelefone(value) {
        if (!value || value.trim().length < 0) {
            throw new Error("É obrigatório informar pelo menos um telefone asdiuodh");
        }

        // for (let i  = 0; i < value.length; i++) {
        //     const tel = String(value[i]).trim();
        //     const telLimpo = tel.replace(/\D/g, '');

        //     if (!telLimpo) {
        //         throw new Error(`Telefone na posição ${i + 1} está vazio`);
        //     }

        //     if (telLimpo.length < 10 || telLimpo.length > 11) {
        //         throw new Error(`Telefone inválido na posição ${i + 1}: "${tel}". Deve ter 10 ou 11 dígitos.`);
        //     }
        // }
    }

    //Criação de projeto utilizando o Design Pattern FACTORY METHOD
    static criar(dados) {
        return new Telefone(null, null, dados.telefones[0]);
    }
    static alterar(dados, id) {
        return new Telefone(id, dados.idCliente, dados.telefones);
    }
}