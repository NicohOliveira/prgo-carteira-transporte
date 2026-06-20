import Pessoa from './Pessoa';

/**
 * Camada: Entity
 * Responsabilidade: Especialização de Pessoa com dados de acesso e configurações.
 */
export default class Usuario extends Pessoa {
  constructor(nome, idade, cpf, telefone, login, senha, carteirinha, limiteNotificacao) {
    // Chama o construtor da classe pai (Pessoa)
    super(nome, idade, cpf, telefone);
    
    // Atributos específicos de Usuario
    this._login = login;
    this._senha = senha;
    this._carteirinha = carteirinha;
    this._limiteNotificacao = limiteNotificacao;
  }

  // --- Métodos do Diagrama ---

  cadastrarUsuario(dadosPessoa) {
    // Valida se os dados da pessoa foram passados corretamente
    return !!(dadosPessoa && this._login && this._senha);
  }

  excluirUsuario() {
    console.log(`Usuario ${this._login} marcado para exclusão.`);
    return true;
  }

  verDadosUsuario() {
    // Retorna a própria instância como objeto do tipo Pessoa/Usuario
    return this;
  }

  editarDadosUsuario(novosDados) {
    if (novosDados) {
      this.nome = novosDados.nome || this.nome;
      // ... outras atualizações
      return true;
    }
    return false;
  }

  efetuarLogin(login, senha) {
    return this._login === login && this._senha === senha;
  }

  efetuarLogout() {
    console.log("Sessão encerrada localmente no objeto.");
  }

  validarCredenciais(senhaDigitada) {
    return this._senha === senhaDigitada;
  }

  obterLimiteConfigurado() {
    return this._limiteNotificacao;
  }

  salvarLimite(valor) {
    this._limiteNotificacao = valor;
  }

  // --- Getters e Setters ---
  get login() { return this._login; }
  set login(v) { this._login = v; }

  get senha() { return this._senha; }
  set senha(v) { this._senha = v; }

  get carteirinha() { return this._carteirinha; }
  set carteirinha(v) { this._carteirinha = v; }

  get limiteNotificacao() { return this._limiteNotificacao; }
  set limiteNotificacao(v) { this._limiteNotificacao = v; }
}