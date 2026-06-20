import React, { createContext, useState, useContext } from 'react';
import Usuario from '../entities/Usuario';
import Carteirinha from '../entities/Carteirinha';
import { API_URL } from '../constants/api';

export const UsuarioContext = createContext();

export const GerenciadorUsuarioProvider = ({ children }) => {
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    const solicitarCadastro = async (dados) => {
        const payload = {
            nome: dados.nome,
            idade: dados.idade || 20,
            cpf: dados.cpf,
            telefone: dados.telefone || "",
            login: dados.login,
            senha: dados.senha,
            isento: dados.isento || false
        };

        try {
            const resposta = await fetch(`${API_URL}/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Bypass-Tunnel-Reminder': 'true'
                },
                body: JSON.stringify(payload)
            });

            if (!resposta.ok) {
                console.log("Erro no backend. Status:", resposta.status);
                return false;
            }
            return true;

        } catch (erro) {
            console.error("Erro de rede ao conectar no servidor para cadastro:", erro);
            return false;
        }
    };

    const solicitarAtualizacao = async (novosDados) => {
        if (!usuarioLogado || !usuarioLogado.id) return false;

        const payload = { ...novosDados };

        try {
            const resposta = await fetch(`${API_URL}/usuarios/${usuarioLogado.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Bypass-Tunnel-Reminder': 'true'
                },
                body: JSON.stringify(payload)
            });

            if (!resposta.ok) return false;

            const usuarioServidor = await resposta.json();
            setUsuarioLogado(usuarioServidor);
            return true;
        } catch (erro) {
            console.error("Erro ao conectar no servidor para atualização:", erro);
            return false;
        }
    };

    const solicitarExclusao = async () => {
        if (!usuarioLogado || !usuarioLogado.id) return false;

        try {
            const resposta = await fetch(`${API_URL}/usuarios/${usuarioLogado.id}`, {
                method: 'DELETE',
                headers: { 'Bypass-Tunnel-Reminder': 'true' }
            });

            if (!resposta.ok) return false;
            setUsuarioLogado(null);
            return true;
        } catch (erro) {
            console.error("Erro ao conectar no servidor para exclusão:", erro);
            return false;
        }
    };

    return (
        <UsuarioContext.Provider value={{
            usuarioLogado,
            setUsuarioLogado,
            solicitarCadastro,
            solicitarAtualizacao,
            solicitarExclusao
        }}>
            {children}
        </UsuarioContext.Provider>
    );
};

export const useUsuario = () => useContext(UsuarioContext);