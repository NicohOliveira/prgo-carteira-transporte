import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAutenticador } from '../controls/Autenticador';

// ... imports anteriores

export default function TelaLogin() {
  const router = useRouter();
  const { validarAcesso } = useAutenticador();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    if (validarAcesso(email, senha)) {
      router.replace('/menu');
    } else {
      Alert.alert("Erro", "Credenciais inválidas.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>PR{"\n"}GO</Text>
        </View>
        
        <Text style={styles.slogan}>Menos tempo, mais felicidade</Text>
        <Text style={styles.title}>Log-In</Text>

        {/* Inputs de Login */}
        <TextInput 
          style={styles.input} 
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/cadastro')}>
          <Text style={styles.footerText}>
            Não tem uma conta? <Text style={styles.link}>Cadastrar-se</Text>
          </Text>
        </TouchableOpacity>

        {/* --- O NOVO BOTÃO ABAIXO --- */}
        <TouchableOpacity 
          style={styles.buttonOutline} 
          onPress={() => Alert.alert("Aviso", "Funcionalidade de acesso rápido em desenvolvimento.")}
        >
          <Text style={styles.buttonOutlineText}>Acessar Carteirinha QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... estilos anteriores ...
  container: { flex: 1, backgroundColor: '#a8d5ba', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', padding: 30, borderRadius: 30, width: '90%', alignItems: 'center' },
  logoContainer: { width: 80, height: 80, backgroundColor: '#008c45', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  logoText: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  slogan: { color: '#008c45', fontWeight: 'bold', marginBottom: 20, fontSize: 12 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#008c45', marginBottom: 20 },
  input: { width: '100%', height: 45, borderWidth: 1, borderColor: '#008c45', borderRadius: 10, paddingHorizontal: 15, marginBottom: 15 },
  button: { width: '100%', height: 50, backgroundColor: '#008c45', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footerText: { marginTop: 20, color: '#333', marginBottom: 20 },
  link: { color: '#008c45', fontWeight: 'bold' },
  
  // Estilo do botão novo
  buttonOutline: { 
    width: '100%', 
    height: 50, 
    borderWidth: 2, 
    borderColor: '#008c45', 
    borderRadius: 25, // Mais arredondado como na imagem
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 20 
  },
  buttonOutlineText: { 
    color: '#008c45', 
    fontSize: 16, 
    fontWeight: 'bold' 
  }
});