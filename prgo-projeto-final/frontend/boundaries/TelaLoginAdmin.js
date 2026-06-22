import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '../constants/api';

export default function TelaLoginAdmin() {
    const router = useRouter();

    const [isLogin, setIsLogin] = useState(true);
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');

    const handleAcao = async () => {
        try {
            if (isLogin) {
                const response = await fetch(`${API_URL}/usuarios/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Bypass-Tunnel-Reminder': 'true'
                    },
                    body: JSON.stringify({ login, senha })
                });

                if (response.ok) {
                    const usuario = await response.json();
                    if (usuario.admin) {
                        Alert.alert("Sucesso", "Bem-vindo ao Painel Admin!");
                        if (usuario.admin) {
                            Alert.alert("Sucesso", "Bem-vindo ao Painel Admin!");
                            router.replace('/painel');
                        }
                    } else {
                        Alert.alert("Acesso Negado", "Este utilizador não tem privilégios de administrador.");
                    }
                } else {
                    Alert.alert("Erro", "Credenciais inválidas.");
                }
            } else {
                const novoAdmin = {
                    nome,
                    cpf,
                    login,
                    senha,
                    admin: true,
                    isento: false
                };

                const response = await fetch(`${API_URL}/usuarios`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Bypass-Tunnel-Reminder': 'true'
                    },
                    body: JSON.stringify(novoAdmin)
                });

                if (response.ok) {
                    Alert.alert("Sucesso", "Administrador cadastrado! Faça login para continuar.");
                    setIsLogin(true);
                } else {
                    Alert.alert("Erro", "Não foi possível cadastrar o administrador.");
                }
            }
        } catch (error) {
            Alert.alert("Erro de Conexão", "Verifique se o backend está a rodar.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.titulo}>{isLogin ? 'Acesso Administrativo' : 'Novo Administrador'}</Text>

                {!isLogin && (
                    <>
                        <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} />
                        <TextInput style={styles.input} placeholder="CPF (Apenas números)" value={cpf} onChangeText={setCpf} keyboardType="numeric" />
                    </>
                )}

                <TextInput style={styles.input} placeholder="Login" value={login} onChangeText={setLogin} autoCapitalize="none" />
                <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />

                <TouchableOpacity style={styles.botaoAcao} onPress={handleAcao}>
                    <Text style={styles.textoBotaoAcao}>{isLogin ? 'Entrar no Sistema' : 'Cadastrar Admin'}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                    <Text style={styles.textoAlternar}>
                        {isLogin ? 'Não tem acesso? Cadastre um Admin' : 'Já tem acesso? Faça Login'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f9' },
    card: { width: '100%', maxWidth: 400, backgroundColor: '#fff', padding: 30, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
    input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, backgroundColor: '#fafafa' },
    botaoAcao: { backgroundColor: '#d32f2f', height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 10 },
    textoBotaoAcao: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    textoAlternar: { marginTop: 20, textAlign: 'center', color: '#1976d2', fontWeight: 'bold' }
});