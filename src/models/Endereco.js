export class Endereco {
    #id;
    #idCliente;
    #cep;
    #uf;
    #cidade;
    #bairro;
    #complemento;
    #logradouro;
    #numero;

    constructor(eId, eIdCliente, eCep, eUf, eCidade, eBairro, eComplemento, eLogradouro, eNumero) {
        this.id = eId;
        this.idCliente = eIdCliente;
        this.cep = eCep;
        this.uf = eUf;
        this.cidade = eCidade;
        this.bairro = eBairro;
        this.complemento = eComplemento;
        this.logradouro = eLogradouro;
        this.numero = eNumero;
    }

    //Métodos acessores - GETTERS e SETTERS
    get id() {
        return this.#id
    }
    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    get idCliente() {
        return this.#idCliente
    }
    set idCliente(value) {
        this.#idCliente = value
    }

    get cep() {
        return this.#cep
    }
    set cep(value) {
        this.#validarCep(value)
        this.#cep = value
    }

    get uf() {
        return this.#uf
    }
    set uf(value) {
        this.#uf = value
    }

    get cidade() {
        return this.#cidade
    }
    set cidade(value) {
        this.#cidade = value
    }

    get bairro() {
        return this.#bairro
    }
    set bairro(value) {
        this.#bairro = value
    }

    get complemento() {
        return this.#complemento
    }
    set complemento(value) {
        this.#complemento = value
    }

    get logradouro() {
        return this.#logradouro
    }
    set logradouro(value) {
        this.#logradouro = value
    }

    get numero() {
        return this.#numero
    }
    set numero(value) {
        this.#numero = value
    }

    //MÉTODOS AUXILIARES
    #validarId(value) {
        if (value && value <= 0) {
            throw new Error('Verifique o ID informado');
        }
    }

    #validarCep(value) {
        console.log('cep: ', value);
        
        if (!value || value.trim().length < 8 || value.trim().length > 8) {
            throw new Error('O campo cep é obrigatório e deve ter 9 caracteres');
        }
    }

    //Criação de projeto utilizando o Design Pattern FACTORY METHOD

    static criar(dados){
        console.log(dados.cep, dados.uf, dados.cidade, dados.bairro, dados.complemento, dados.logradouro, dados.numero);
        
        return new Endereco(null, null, dados.cep, dados.uf, dados.cidade, dados.bairro, dados.complemento, dados.logradouro, dados.numero);
    }

    static alterar(dados, id){
        return new Endereco(id, dados.idCliente, dados.cep, dados.uf, dados.cidade, dados.bairro, dados.complemento, dados.logradouro, dados.numero);
    }
}