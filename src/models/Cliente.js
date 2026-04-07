export class Cliente {
    #id;
    #nome;
    #dataCad;
    #cpf;


    constructor(cId, cNome, cCpf) {
        this.id = cId;
        this.nome = cNome;
        this.cpf = cCpf;
    }

    //Métodos acessores - GETTERS e SETTERS
    get id() {
        return this.#id
    }
    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    get nome() {
        return this.#nome;
    }
    set nome(value) {
        this.#validarNome(value);
        this.#nome = value;
    }

    get cpf() {
        return this.#cpf
    }

    set cpf(value) {
        this.#validarCpf(value);
        this.#cpf = value
    }

    //MÉTODOS AUXILIARES    
    #validarId(value) {
        if (value && value <= 0) {
            throw new Error('Verifique o ID informado');
        }
    }
    #validarNome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 45) {
            throw new Error('O campo nome é obrigatório e deve ter entre 3 e 45 caracteres');
        }
    }

    #validarCpf(cpf) {
        if (!cpf) return { valido: false, mensagem: "CPF não informado" };

        // Remove tudo que não for número
        cpf = cpf.replace(/\D/g, '');

        // Validações básicas
        if (cpf.length !== 11) {
            return { valido: false, mensagem: "CPF deve ter 11 dígitos" };
        }

        if (/^(\d)\1{10}$/.test(cpf)) {
            return { valido: false, mensagem: "CPF com todos os dígitos iguais" };
        }

        const digitos = cpf.split('').map(Number);

        // Cálculo do 1º dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += digitos[i] * (10 - i);
        }
        let resto = soma % 11;
        const dv1 = resto < 2 ? 0 : 11 - resto;

        if (dv1 !== digitos[9]) {
            return { valido: false, mensagem: "Dígito verificador 1 inválido" };
        }

        // Cálculo do 2º dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += digitos[i] * (11 - i);
        }
        resto = soma % 11;
        const dv2 = resto < 2 ? 0 : 11 - resto;

        const valido = dv2 === digitos[10];

        return {
            valido: valido,
            mensagem: valido ? "CPF válido" : "Dígito verificador 2 inválido"
        };

    }

    //Criação de projeto utilizando o Design Pattern FACTORY METHOD
    static criar(dados) {
        return new Cliente(null, dados.nome, dados.cpf);
    }
    static alterar(dados, id) {
        return new Cliente(id, dados.nome, dados.cpf);
    }

}