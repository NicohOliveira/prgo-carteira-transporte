/**
 *
 * Responsabilidade: Representar um registro histórico de transação financeira.
 */
export default class Pagamento {
    constructor(idPagamento, valor, metodo) {
        this._idPagamento = idPagamento;
        this._valor = valor;
        this._metodo = metodo; // "PIX", "Cartão de Crédito", "Boleto Bancário"
        this._dataHora = new Date().toISOString();
        this._status = "Pendente"; // Pendente, Confirmado, Rejeitado
    }

    // métodos do diagrama

    processarPagamento() {
        return {
            id: this._idPagamento,
            valor: this._valor,
            metodo: this._metodo,
            dataHora: this._dataHora,
            status: this._status
        };
    }

    validarPagamento() {
        this._status = "Confirmado";
        return this.processarPagamento();
    }

    rejeitarPagamento() {
        this._status = "Rejeitado";
        return this.processarPagamento();
    }

    // getters e setters
    get valor() { return this._valor; }
    get status() { return this._status; }
    get dataHora() { return this._dataHora; }
    get metodo() { return this._metodo; }
}