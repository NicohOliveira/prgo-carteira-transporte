import React, { createContext, useState, useContext } from 'react';
import { useUsuario } from './GerenciadorUsuario';

export const AutenticadorContext = createContext();

export const AutenticadorProvider = ({ children }) => {
  const { usuarios, setUsuarioLogado } = useUsuario();
  const [sessaoAtiva, setSessaoAtiva] = useState(false);

  const validarAcesso = (login, senha) => {
    const usuarioEncontrado = usuarios.find(u => u._login === login && u._senha === senha);
    if (usuarioEncontrado) {
      setUsuarioLogado(usuarioEncontrado);
      setSessaoAtiva(true);
      return true;
    }
    return false;
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