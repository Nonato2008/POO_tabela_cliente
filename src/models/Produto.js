export class Produto{
    #id;
    #idCategoria;
    #nome;  
    #valor;
    #vinculoImagem
    #dataCad;


    constructor(pNome, pValor, pIdCat, pVinculo, pId){
        this.nome = pNome;
        this.valor = pValor;
        this.idCategoria = pIdCat;
        this.vinculoImagem = pVinculo;
        this.id = pId;
    }

    //Métodos acessores - GETTERS e SETTERS
    get id(){
        return this.#id
    }
    set id(value){
        this.#validarId(value);
        this.#id = value;
    }

    get idCategoria(){
        return this.#idCategoria
    }
    set idCategoria(value){
        this.#validarIdCategoria(value);
        this.#idCategoria = value
    }

    get nome(){
        return this.#nome;
    }
    set nome(value){
        this.#validarNome(value);
        this.#nome = value;
    }

    get valor(){
        return this.#valor
    }
    set valor(value){
        this.#validarValor(value);
        this.#valor = value
    }

    get vinculoImagem(){
        return this.#vinculoImagem
    }
    set vinculoImagem(value){
        this.#validarPathImagem(value)
        this.#vinculoImagem = value
    }

    //MÉTODOS AUXILIARES   
    #validarPathImagem(value){
        if(value ){
            if(value.length > 0){
                throw new Error('Imagem não enviada');
            }
            }
    }
    
    #validarId(value){
        if(value && value <= 0){
            throw new Error('Verifique o ID informado');
        }
    }

    #validarIdCategoria(value){
        if(value && value <= 0){
            throw new Error('Verifique o ID da categoria informado');
        }
    }

    #validarNome(value){
        if(!value || value.trim().length < 3 || value.trim().length > 45){
            throw new Error('O campo nome é obrigatório e deve ter entre 3 e 45 caracteres');
        }
    }
    #validarValor(value){
        if(!value || Number(value) <= 0 || isNaN(value)){
            throw new Error('O campo valor é obrigatório deve ter apenas números e ser acima de 3 caracteres');
        }
    }

    //Criação de projet sutilizando o Design Pattern FACTORY METHOD
    static criar(dados){ 
        return new Produto(dados.nome, dados.valor, dados.idCategoria, dados.vinculoImagem, null);
    }
    static alterar(dados, id){ 
        return new Produto(dados.nome, dados.valor, dados.idCategoria, null, id);
    }
} 