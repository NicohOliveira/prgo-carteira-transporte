import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUsuario } from '../controls/GerenciadorUsuario';

export default function TelaCadastro() {
  const router = useRouter();
  const { solicitarCadastro } = useUsuario(); // - gerenciador: GerenciadorUsuario

  // Estados locais para os campos (inserirDados)
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // + exibirMensagemSucesso(): void
  const exibirMensagemSucesso = () => {
    Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!', [
      { text: 'OK', onPress: () => router.replace('/') }
    ]);
  };

  // + exibirAlerta(): void
  const exibirAlerta = (mensagem) => {
    Alert.alert('Atenção', mensagem || 'Preencha todos os campos corretamente.');
  };

  // + inserirDados(): void
  const handleCadastro = async () => {
    if (!nome || !cpf || !email || !senha) {
      exibirAlerta('Campos obrigatórios faltando.');
      return;
    }

    const dadosParaCadastro = {
      nome,
      idade: parseInt(idade),
      cpf,
      telefone,
      login: email, // Usando email como login
      senha,
      carteirinha: null,
      limiteNotificacao: 0.0
    };

    const sucesso = await solicitarCadastro(dadosParaCadastro);

    if (sucesso) {
      exibirMensagemSucesso();
    } else {
      exibirAlerta('Erro ao realizar cadastro. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Cadastro</Text>
          <Text style={styles.subtitle}>Crie sua conta para começar</Text>

          {/* Inputs baseados no diagrama de Pessoa/Usuario */}
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput style={styles.input} placeholder="Ex: Neymar Jr" value={nome} onChangeText={setNome} />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Idade</Text>
              <TextInput style={styles.input} placeholder="32" keyboardType="numeric" value={idade} onChangeText={setIdade} />
            </View>
            <View style={{ flex: 2 }}>
              <Text style={styles.label}>CPF</Text>
              <TextInput style={styles.input} placeholder="000.000.000-00" value={cpf} onChangeText={setCpf} />
            </View>
          </View>

          <Text style={styles.label}>Telefone</Text>
          <TextInput style={styles.input} placeholder="(00) 00000-0000" value={telefone} onChangeText={setTelefone} />

          <Text style={styles.label}>E-mail (Login)</Text>
          <TextInput style={styles.input} placeholder="email@exemplo.com" autoCapitalize="none" value={email} onChangeText={setEmail} />

          <Text style={styles.label}>Senha</Text>
          <TextInput style={styles.input} placeholder="********" secureTextEntry value={senha} onChangeText={setSenha} />

          {/* Botão de Ação */}
          <TouchableOpacity style={styles.button} onPress={handleCadastro}>
            <Text style={styles.buttonText}>Finalizar Cadastro</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Já tenho conta? Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#a8d5ba' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  card: { backgroundColor: '#fff', padding: 25, borderRadius: 30, width: '90%', alignItems: 'center', elevation: 5 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#008c45', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  label: { alignSelf: 'flex-start', color: '#008c45', fontWeight: 'bold', marginBottom: 5, fontSize: 14 },
  row: { flexDirection: 'row', width: '100%' },
  input: { width: '100%', height: 45, borderWidth: 1, borderColor: '#008c45', borderRadius: 10, paddingHorizontal: 15, marginBottom: 12 },
  button: { width: '100%', height: 50, backgroundColor: '#008c45', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backButton: { marginTop: 20 },
  backButtonText: { color: '#008c45', fontWeight: '600' }
});