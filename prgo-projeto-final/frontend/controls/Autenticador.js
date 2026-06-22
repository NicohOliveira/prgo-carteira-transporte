import React, { createContext, useState, useContext } from 'react';
import { useUsuario } from './GerenciadorUsuario';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { API_URL } from '../constants/api';
import Usuario from '../entities/Usuario';
import Carteirinha from '../entities/Carteirinha';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AutenticadorContext = createContext();

export const AutenticadorProvider = ({ children }) => {
  const { setUsuarioLogado } = useUsuario();
  const [sessaoAtiva, setSessaoAtiva] = useState(false);
  // NOTIFICAÇÕES: Importa o hook para ter acesso ao token do aparelho
  const { expoPushToken } = usePushNotifications();

  const validarAcesso = async (login, senha) => {
    try {
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

      const dadosUsuario = await resposta.json();

      let carteirinhaDoBanco = null;
      if (dadosUsuario.carteirinha) {
        carteirinhaDoBanco = new Carteirinha(
            dadosUsuario.carteirinha.id,
            dadosUsuario.carteirinha.saldo,
            dadosUsuario.carteirinha.codigoQr,
            dadosUsuario.isento || false
        );
      } else {
        carteirinhaDoBanco = new Carteirinha(Date.now(), 0.0, "QR_" + dadosUsuario.cpf, dadosUsuario.isento || false);
      }
      const usuarioAutenticado = new Usuario(
          dadosUsuario.nome,
          dadosUsuario.idade,
          dadosUsuario.cpf,
          dadosUsuario.telefone,
          dadosUsuario.login,
          dadosUsuario.senha,
          carteirinhaDoBanco,
          dadosUsuario.limiteNotificacao || 0
      );

      usuarioAutenticado.id = dadosUsuario.id;

      usuarioAutenticado.fotoPerfil = dadosUsuario.fotoPerfil;

      usuarioAutenticado.isento = dadosUsuario.isento;
      usuarioAutenticado._isento = dadosUsuario.isento;
      setUsuarioLogado(usuarioAutenticado);
      await AsyncStorage.setItem('@usuario_offline', JSON.stringify(usuarioAutenticado));
      setSessaoAtiva(true);

      // Envia o push token para o backend
      // NOTIFICAÇÕES: Se fez login com sucesso e gerou um token, envia o token pro backend
      if (expoPushToken) {
        fetch(`${API_URL}/usuarios/${usuarioAutenticado.id}/push-token`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Bypass-Tunnel-Reminder': 'true'
          },
          body: JSON.stringify({ token: expoPushToken }),
        }).catch(err => console.log('Erro ao enviar push token: ', err));
      }

      return true;

    } catch (erro) {
      console.error("Erro ao conectar no servidor durante o login:", erro);
      return false;
    }
  };

  const finalizarSessao = () => {
    setUsuarioLogado(null);
    setSessaoAtiva(false);
    AsyncStorage.removeItem('@usuario_offline');
  };

  return (
      <AutenticadorContext.Provider value={{ validarAcesso, finalizarSessao, sessaoAtiva }}>
        {children}
      </AutenticadorContext.Provider>
  );
};

export const useAutenticador = () => useContext(AutenticadorContext);
