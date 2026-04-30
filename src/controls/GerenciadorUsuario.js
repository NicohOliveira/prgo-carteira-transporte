import React, { createContext, useState, useContext } from 'react';
import Usuario from '../entities/Usuario';

export const UsuarioContext = createContext();

export const GerenciadorUsuarioProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const validarDados = (dados) => {
    return !!(dados.nome && dados.cpf && dados.login && dados.senha);
  };

  const solicitarCadastro = (dados) => {
    if (!validarDados(dados)) return false;

    const novoUsuario = new Usuario(
      dados.nome,
      dados.idade,
      dados.cpf,
      dados.telefone,
      dados.login,
      dados.senha,
      null,
      0.0
    );

    setUsuarios(prev => [...prev, novoUsuario]);
    return true;
  };

  const solicitarAtualizacao = (novosDados) => {
    if (!usuarioLogado) return false;

    setUsuarios(prev =>
      prev.map(u =>
        String(u._cpf) === String(usuarioLogado._cpf)
          ? new Usuario(
              novosDados.nome ?? u._nome,
              u._idade,
              u._cpf,
              novosDados.telefone ?? u._telefone,
              u._login,
              u._senha,
              u._carteirinha,
              u._limite
            )
          : u
      )
    );

    setUsuarioLogado(prev =>
      new Usuario(
        novosDados.nome ?? prev._nome,
        prev._idade,
        prev._cpf,
        novosDados.telefone ?? prev._telefone,
        prev._login,
        prev._senha,
        prev._carteirinha,
        prev._limite
      )
    );

    return true;
  };

  const solicitarExclusao = () => {
    if (!usuarioLogado) return false;

    setUsuarios(prev =>
      prev.filter(u => String(u._cpf) !== String(usuarioLogado._cpf))
    );

    setUsuarioLogado(null);
    return true;
  };

  return (
    <UsuarioContext.Provider value={{
      usuarios,
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