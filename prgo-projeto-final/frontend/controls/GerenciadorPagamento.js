import React, { createContext, useState, useContext } from 'react';
import Pagamento from '../entities/Pagamento';
import { useCarteirinha } from './GerenciadorCarteirinha';

export const PagamentoContext = createContext();

export const GerenciadorPagamentoProvider = ({ children }) => {
    const { adicionarSaldo } = useCarteirinha();
    const [historico, setHistorico] = useState([]);

    const processarNovaRecarga = async (valor, metodo) => {
        // 1. criar a entidade Pagamento (Pendente)
        const novoPagamento = new Pagamento(Date.now(), valor, metodo);

        // 2. simular atraso da rede/API externa (2 segundos)
        return new Promise((resolve) => {
            setTimeout(() => {
                // 3. validar o pagamento na entidade
                novoPagamento.validarPagamento();

                // 4. atualizar o histórico local
                setHistorico(prev => [novoPagamento, ...prev]);

                // 5. notificar o gerenciador de carteirinha para subir o saldo
                adicionarSaldo(valor);

                resolve(true);
            }, 2000);
        });
    };

    const obterExtrato = () => historico;

    return (
        <PagamentoContext.Provider value={{ historico, processarNovaRecarga, obterExtrato }}>
            {children}
        </PagamentoContext.Provider>
    );
};

export const usePagamento = () => useContext(PagamentoContext);