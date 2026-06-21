import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import { useRouter } from 'expo-router';
import { useAutenticador } from '../controls/Autenticador';
import { useUsuario } from '../controls/GerenciadorUsuario';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function TelaLogin() {
  const router = useRouter();
  const { validarAcesso } = useAutenticador();

  const { usuarioLogado, setUsuarioLogado } = useUsuario();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Aviso", "Por favor, preencha o e-mail e a senha.");
      return;
    }
    setCarregando(true);
    const sucesso = await validarAcesso(email, senha);
    setCarregando(false);

    if (sucesso) {
      router.replace('/menu');
    } else {
      Alert.alert("Erro", "Credenciais inválidas ou servidor indisponível.");
    }
  };

  const handleAcessoRapido = async () => {
    if (usuarioLogado) {
      router.push('/carteirinha');
      return;
    }

    try {
      const usuarioSalvo = await AsyncStorage.getItem('@usuario_offline');
      if (usuarioSalvo) {
        const dadosUsuario = JSON.parse(usuarioSalvo);
        setUsuarioLogado(dadosUsuario);
        router.push('/carteirinha');
      } else {
        Alert.alert("Aviso", "Nenhuma conta registada. Por favor, ligue-se à internet e faça login pelo menos uma vez.");
      }
    } catch (erro) {
      Alert.alert("Erro", "Falha ao acessar à memória.");
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

          <TextInput
              style={styles.input}
              placeholder="E-mail"
              autoCapitalize="none"
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

          <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={carregando}
          >
            {carregando ? (
                <ActivityIndicator size="small" color="#fff" />
            ) : (
                <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/cadastro')}>
            <Text style={styles.footerText}>
              Não tem uma conta? <Text style={styles.link}>Cadastrar-se</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.buttonOutline}
              onPress={handleAcessoRapido}
          >
            <Text style={styles.buttonOutlineText}>Acessar Carteirinha QR</Text>
          </TouchableOpacity>
        </View>

        {carregando && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.textoCarregando}>A conectar ao servidor...</Text>
            </View>
        )}
        <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => router.push('/catraca')}
        >
          <Text style={{ color: '#666', fontWeight: 'bold' }}>
            <Ionicons name="scan" size={16} /> Entrar como Catraca (Teste)
          </Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
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
  buttonOutline: { width: '100%', height: 50, borderWidth: 2, borderColor: '#008c45', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  buttonOutlineText: { color: '#008c45', fontSize: 16, fontWeight: 'bold' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 999, elevation: 10 },
  textoCarregando: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 15 }
});