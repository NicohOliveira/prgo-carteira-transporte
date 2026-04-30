/**
 * Camada: Entity
 * Responsabilidade: Gerenciar o estado do saldo, gratuidade e código QR.
 */
export default class Carteirinha {
    constructor(idCarteirinha, saldo = 0.0, codigoQr = "QR_PADRAO", isento = false) {
        this._idCarteirinha = idCarteirinha;
        this._saldo = saldo;
        this._codigoQr = codigoQr;
        this._isento = isento;
    }

    verSaldo() {
        return this._saldo;
    }

    comprarCredito(valor) {
        if (valor > 0) {
            this._saldo += valor;
        }
        return this._saldo;
    }

    descontarSaldo(tarifa) {
        if (this._isento) {
            return true; // Passa na catraca sem descontar
        }

        if (this._saldo >= tarifa) {
            this._saldo -= tarifa;
            return true; // Saldo suficiente, catraca liberada
        }

        return false; // Saldo insuficiente, catraca bloqueada
    }

    verificarGratuidade() {
        return this._isento;
    }

    obterQrCode() {
        return this._codigoQr;
    }

    // --- Getters e Setters (Isso é o que garante que o saldo apareça na tela!) ---
    get idCarteirinha() { return this._idCarteirinha; }
    get saldo() { return this._saldo; }
    get isento() { return this._isento; }
    get codigoQr() { return this._codigoQr; }
}