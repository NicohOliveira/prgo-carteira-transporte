import React, { createContext, useState, useContext } from 'react';
import Carteirinha from '../entities/Carteirinha';

export const CarteirinhaContext = createContext();

export const GerenciadorCarteirinhaProvider = ({ children }) => {
    // inicializa a entidade com saldo 0 ou vindo do AsyncStorage no futuro
    const [instanciaCarteirinha, setInstanciaCarteirinha] = useState(new Carteirinha(1, 0.0));

    const verSaldo = () => instanciaCarteirinha.saldo;

    const adicionarSaldo = (valor) => {
        // regra de negócio: criar nova instância para disparar atualização no React
        const novaCarteirinha = new Carteirinha(
            instanciaCarteirinha.idCarteirinha,
            instanciaCarteirinha.saldo,
            instanciaCarteirinha.codigoQr,
            instanciaCarteirinha.isento
        );
        novaCarteirinha.comprarCredito(valor);
        setInstanciaCarteirinha(novaCarteirinha);
    };

    const solicitarDescontoSaldo = (tarifa) => {
        const novaCarteirinha = new Carteirinha(
            instanciaCarteirinha.idCarteirinha,
            instanciaCarteirinha.saldo,
            instanciaCarteirinha.codigoQr,
            instanciaCarteirinha.isento
        );

        const sucesso = novaCarteirinha.descontarSaldo(tarifa);
        if (sucesso) {
            setInstanciaCarteirinha(novaCarteirinha);
            return true;
        }
        return false;
    };

    return (
        <CarteirinhaContext.Provider value={{
            saldo: instanciaCarteirinha.saldo,
            isento: instanciaCarteirinha.isento,
            codigoQr: instanciaCarteirinha.codigoQr,
            verSaldo,
            adicionarSaldo,
            solicitarDescontoSaldo
        }}>
            {children}
        </CarteirinhaContext.Provider>
    );
};

export const useCarteirinha = () => useContext(CarteirinhaContext);