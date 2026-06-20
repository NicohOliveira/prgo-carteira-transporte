import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUsuario } from '../controls/GerenciadorUsuario';

export default function TelaPerfil() {
  const router = useRouter();
  const { usuarioLogado, solicitarAtualizacao, solicitarExclusao } = useUsuario();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    if (usuarioLogado) {
      setNome(usuarioLogado._nome);
      setTelefone(usuarioLogado._telefone);
    }
  }, [usuarioLogado]);

  const handleSalvar = () => {
    const sucesso = solicitarAtualizacao({ nome, telefone });

    if (sucesso) {
      Alert.alert("Sucesso", "Operação realizada!");
    } else {
      Alert.alert("Erro", "Ocorreu um problema na operação.");
    }
  };

  const clicarExcluirConta = () => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja excluir sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          style: "destructive",
          onPress: () => {
            const sucesso = solicitarExclusao();

            if (sucesso) {
              router.replace('/');
            } else {
              Alert.alert("Erro", "Ocorreu um problema na operação.");
            }
          }
        }
      ]
    );
  };

  const exibirDados = () => {
    if (!usuarioLogado) return null;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Perfil do Usuário</Text>

        <Text style={styles.label}>Nome:</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Telefone:</Text>
        <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />

        <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
          <Text style={styles.btnText}>Salvar Dados</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnDelete} onPress={clicarExcluirConta}>
          <Text style={styles.btnDeleteText}>Excluir Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.btnVoltar}>
          <Text style={styles.btnVoltarText}>Voltar para Configurações</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return exibirDados();
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#008c45', marginBottom: 20 },
  label: { fontWeight: 'bold', marginBottom: 5, color: '#008c45' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, marginBottom: 20 },
  btnSalvar: { backgroundColor: '#008c45', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  btnDelete: { marginTop: 40, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: 'red', borderRadius: 10 },
  btnDeleteText: { color: 'red', fontWeight: 'bold' },
  btnVoltar: { marginTop: 20, alignItems: 'center' },
  btnVoltarText: { color: '#008c45' }
});