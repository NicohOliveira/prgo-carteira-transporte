import React, { createContext, useState, useContext } from 'react';
import { useUsuario } from './GerenciadorUsuario';
import { API_URL } from '../constants/api';
import Usuario from '../entities/Usuario';
import Carteirinha from '../entities/Carteirinha';

export const AutenticadorContext = createContext();

export const AutenticadorProvider = ({ children }) => {
  const { setUsuarioLogado } = useUsuario();
  const [sessaoAtiva, setSessaoAtiva] = useState(false);

  const validarAcesso = async (login, senha) => {
    try {
      // envia credencial
      const resposta = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true'
        },
        body: JSON.stringify({ login, senha }),
      });

      if (!resposta.ok) {
        return false;
      }

      // credenciais validas
      const dadosUsuario = await resposta.json();

      const usuarioAutenticado = new Usuario(
          dadosUsuario.nome,
          dadosUsuario.idade,
          dadosUsuario.cpf,
          dadosUsuario.telefone,
          dadosUsuario.login,
          dadosUsuario.senha,
          new Carteirinha(Date.now(), 0.0, "QR_" + dadosUsuario.cpf, dadosUsuario.isento || false),
          0.0
      );

      usuarioAutenticado.id = dadosUsuario.id;
      setUsuarioLogado(usuarioAutenticado);
      setSessaoAtiva(true);
      return true;

    } catch (erro) {
      console.error("Erro ao conectar no servidor durante o login:", erro);
      return false;
    }
  };

  const finalizarSessao = () => {
    setUsuarioLogado(null);
    setSessaoAtiva(false);
  };

  return (
      <AutenticadorContext.Provider value={{ validarAcesso, finalizarSessao, sessaoAtiva }}>
        {children}
      </AutenticadorContext.Provider>
  );
};

export const useAutenticador = () => useContext(AutenticadorContext);