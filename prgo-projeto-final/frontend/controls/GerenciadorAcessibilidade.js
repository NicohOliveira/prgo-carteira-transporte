import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AcessibilidadeContext = createContext();

export const GerenciadorAcessibilidadeProvider = ({ children }) => {
    const [modoBaixoEstimulo, setModoBaixoEstimulo] = useState(false);
    const [modoNavegacaoAmpliada, setModoNavegacaoAmpliada] = useState(false);

    useEffect(() => {
        const carregarPreferencias = async () => {
            try {
                const estimulo = await AsyncStorage.getItem('@prefs_baixo_estimulo');
                const ampliada = await AsyncStorage.getItem('@prefs_nav_ampliada');
                if (estimulo !== null) setModoBaixoEstimulo(JSON.parse(estimulo));
                if (ampliada !== null) setModoNavegacaoAmpliada(JSON.parse(ampliada));
            } catch (erro) {
                console.error("Erro ao carregar preferências", erro);
            }
        };
        carregarPreferencias();
    }, []);
    const toggleBaixoEstimulo = async (valor) => {
        setModoBaixoEstimulo(valor);
        await AsyncStorage.setItem('@prefs_baixo_estimulo', JSON.stringify(valor));
    };

    const toggleNavegacaoAmpliada = async (valor) => {
        setModoNavegacaoAmpliada(valor);
        await AsyncStorage.setItem('@prefs_nav_ampliada', JSON.stringify(valor));
    };

    return (
        <AcessibilidadeContext.Provider value={{
            modoBaixoEstimulo,
            toggleBaixoEstimulo,
            modoNavegacaoAmpliada,
            toggleNavegacaoAmpliada
        }}>
            {children}
        </AcessibilidadeContext.Provider>
    );
};

export const useAcessibilidade = () => useContext(AcessibilidadeContext);