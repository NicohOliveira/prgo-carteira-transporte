import React, { useState } from 'react';
import { Switch, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useUsuario } from '../controls/GerenciadorUsuario';

export default function TelaCadastro() {
  const router = useRouter();
  const { solicitarCadastro } = useUsuario();

  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isento, setIsento] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const exibirMensagemSucesso = () => {
    Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const exibirAlerta = (mensagem) => {
    Alert.alert('Atenção', mensagem);
  };

  const formatarCPF = (texto) => {
    let num = texto.replace(/\D/g, '');
    if (num.length > 11) num = num.slice(0, 11);
    num = num.replace(/(\d{3})(\d)/, '$1.$2');
    num = num.replace(/(\d{3})(\d)/, '$1.$2');
    num = num.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return num;
  };

  const formatarTelefone = (texto) => {
    let num = texto.replace(/\D/g, '');
    if (num.length > 11) num = num.slice(0, 11);
    num = num.replace(/^(\d{2})(\d)/g, '($1) $2');
    num = num.replace(/(\d)(\d{4})$/, '$1-$2');
    return num;
  };

  const validarEmail = (emailText) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailText);
  };

  const handleCadastro = async () => {
    const emailLimpo = email.trim();

    if (!nome || !cpf || !emailLimpo || !senha) {
      exibirAlerta('Existem campos obrigatórios em branco.');
      return;
    }

    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      exibirAlerta('O CPF deve ter exatamente 11 números.');
      return;
    }

    if (!validarEmail(emailLimpo)) {
      exibirAlerta('Insira um e-mail válido contendo "@" e o domínio (ex: .com).');
      return;
    }

    const dadosParaCadastro = {
      nome,
      idade: parseInt(idade) || 20,
      cpf: cpfLimpo,
      telefone,
      login: emailLimpo,
      senha,
      isento
    };

    setCarregando(true);

    const sucesso = await solicitarCadastro(dadosParaCadastro);

    setCarregando(false);

    if (sucesso) {
      exibirMensagemSucesso();
    } else {
      exibirAlerta('O cadastro falhou! Verifique se este E-mail ou CPF já estão cadastrados no sistema.');
    }
  };

  return (
      <View style={styles.container}>
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.title}>Cadastro</Text>
            <Text style={styles.subtitle}>Crie sua conta para começar</Text>

            <Text style={styles.label}>Nome Completo</Text>
            <TextInput style={styles.input} placeholder="Ex: Neymar Jr" value={nome} onChangeText={setNome} />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Idade</Text>
                <TextInput style={styles.input} placeholder="32" keyboardType="numeric" value={idade} onChangeText={setIdade} />
              </View>
              <View style={{ flex: 2 }}>
                <Text style={styles.label}>CPF</Text>
                <TextInput
                    style={styles.input}
                    placeholder="000.000.000-00"
                    keyboardType="numeric"
                    value={cpf}
                    onChangeText={(texto) => setCpf(formatarCPF(texto))}
                />
              </View>
            </View>

            <Text style={styles.label}>Telefone</Text>
            <TextInput
                style={styles.input}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
                value={telefone}
                onChangeText={(texto) => setTelefone(formatarTelefone(texto))}
            />

            <Text style={styles.label}>E-mail (Login)</Text>
            <TextInput style={styles.input} placeholder="email@exemplo.com" autoCapitalize="none" value={email} onChangeText={setEmail} />

            <Text style={styles.label}>Senha</Text>
            <TextInput style={styles.input} placeholder="********" secureTextEntry value={senha} onChangeText={setSenha} />

            <View style={styles.switchContainer}>
              <Text style={styles.labelSwitch}>Possui isenção (Estudante/Idoso)?</Text>
              <Switch
                  value={isento}
                  onValueChange={setIsento}
                  trackColor={{ false: "#ccc", true: "#a8d5ba" }}
                  thumbColor={isento ? "#008c45" : "#f4f3f4"}
              />
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleCadastro}
                disabled={carregando}
            >
              <Text style={styles.buttonText}>Finalizar Cadastro</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>Já tenho conta? Voltar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {carregando && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.textoCarregando}>A gravar na base de dados...</Text>
            </View>
        )}
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
  backButtonText: { color: '#008c45', fontWeight: '600' },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginVertical: 15, paddingHorizontal: 5 },
  labelSwitch: { color: '#008c45', fontWeight: 'bold', fontSize: 14 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 10,
  },
  textoCarregando: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  }
});