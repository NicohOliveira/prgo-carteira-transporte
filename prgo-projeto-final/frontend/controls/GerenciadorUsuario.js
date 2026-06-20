import React, { createContext, useState, useContext } from 'react';
import Usuario from '../entities/Usuario';
import Carteirinha from '../entities/Carteirinha';
import { API_URL } from '../constants/api';

export const UsuarioContext = createContext();

export const GerenciadorUsuarioProvider = ({ children }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    const validarDados = (dados) => {
        return !!(dados.nome && dados.cpf && dados.login && dados.senha);
    };

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

            try {
                const usuarioServidor = await resposta.json();

                const novoUsuario = new Usuario(
                    usuarioServidor.nome, usuarioServidor.idade, usuarioServidor.cpf,
                    usuarioServidor.telefone, usuarioServidor.login, usuarioServidor.senha,
                    new Carteirinha(Date.now(), 0.0, "QR_" + usuarioServidor.cpf, usuarioServidor.isento || false),
                    0.0
                );
                novoUsuario.id = usuarioServidor.id;
                setUsuarios(prev => [...prev, novoUsuario]);
            } catch (erroJson) {
                console.log("Aviso: Cadastro feito, mas o servidor não retornou um JSON válido.", erroJson);
            }

            return true;

        } catch (erro) {
            console.error("Erro de rede ao conectar no servidor para cadastro:", erro);
            return false;
        }
    };

    const solicitarAtualizacao = async (novosDados) => {
        if (!usuarioLogado || !usuarioLogado.id) return false;
        const payload = {
            nome: novosDados.nome ?? usuarioLogado._nome,
            idade: usuarioLogado._idade,
            cpf: usuarioLogado._cpf,
            telefone: novosDados.telefone ?? usuarioLogado._telefone,
            login: usuarioLogado._login,
            senha: usuarioLogado._senha,
            isento: usuarioLogado._carteirinha?._isento || false
        };

        try {
            const resposta = await fetch(`${`${API_URL}/usuarios`}/${usuarioLogado.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!resposta.ok) return false;

            const usuarioServidor = await resposta.json();

            const usuarioAtualizado = new Usuario(
                usuarioServidor.nome,
                usuarioServidor.idade,
                usuarioServidor.cpf,
                usuarioServidor.telefone,
                usuarioServidor.login,
                usuarioServidor.senha,
                usuarioLogado._carteirinha,
                usuarioLogado._limite
            );
            usuarioAtualizado.id = usuarioServidor.id;

            setUsuarios(prev => prev.map(u => u.id === usuarioLogado.id ? usuarioAtualizado : u));
            setUsuarioLogado(usuarioAtualizado);

            return true;
        } catch (erro) {
            console.error("Erro ao conectar no servidor para atualização:", erro);
            return false;
        }
    };

    const solicitarExclusao = async () => {
        if (!usuarioLogado || !usuarioLogado.id) return false;

        try {
            const resposta = await fetch(`${`${API_URL}/usuarios`}/${usuarioLogado.id}`, {
                method: 'DELETE'
            });

            if (!resposta.ok) return false;

            setUsuarios(prev => prev.filter(u => u.id !== usuarioLogado.id));
            setUsuarioLogado(null);
            return true;
        } catch (erro) {
            console.error("Erro ao conectar no servidor para exclusão:", erro);
            return false;
        }
    };

    const sincronizarUsuariosDoBanco = async () => {
        try {
            const resposta = await fetch(`${API_URL}/usuarios`);
            if (resposta.ok) {
                const dadosBanco = await resposta.json();
                const listaEntidades = dadosBanco.map(u => {
                    const inst = new Usuario(
                        u.nome,
                        u.idade,
                        u.cpf,
                        u.telefone,
                        u.login,
                        u.senha,
                        new Carteirinha(Date.now(), 0.0, "QR_" + u.cpf, u.isento),
                        0.0
                    );
                    inst.id = u.id;
                    return inst;
                });
                setUsuarios(listaEntidades);
            }
        } catch (erro) {
            console.error("Erro ao buscar usuários do banco:", erro);
        }
    };

    return (
        <UsuarioContext.Provider value={{
            usuarios,
            usuarioLogado,
            setUsuarioLogado,
            solicitarCadastro,
            solicitarAtualizacao,
            solicitarExclusao,
            sincronizarUsuariosDoBanco
        }}>
            {children}
        </UsuarioContext.Provider>
    );
};

export const useUsuario = () => useContext(UsuarioContext);