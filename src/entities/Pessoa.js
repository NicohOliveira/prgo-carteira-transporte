/**
 * Camada: Entity
 * Seguindo o diagrama: Atributos privados e método de cadastro.
 */
export default class Pessoa {
  constructor(nome, idade, cpf, telefone) {
    this._nome = nome;
    this._idade = idade;
    this._cpf = cpf;
    this._telefone = telefone;
  }

  // Método solicitado no diagrama
  // Em arquitetura BCE, a Entidade prepara o objeto para o Control
  cadastrarPessoa() {
    console.log(`Log: Objeto pessoa para ${this._nome} instanciado com sucesso.`);
    // Aqui poderiam vir validações específicas de negócio do objeto
    return {
      nome: this._nome,
      idade: this._idade,
      cpf: this._cpf,
      telefone: this._telefone,
      dataCriacao: new Date().toISOString()
    };
  }

  // Getters e Setters
  get nome() { return this._nome; }
  set nome(v) { this._nome = v; }
  
  get idade() { return this._idade; }
  set idade(v) { this._idade = v; }

  get cpf() { return this._cpf; }
  set cpf(v) { this._cpf = v; }

  get telefone() { return this._telefone; }
  set telefone(v) { this._telefone = v; }
}