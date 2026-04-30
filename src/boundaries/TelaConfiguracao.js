import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUsuario } from '../controls/GerenciadorUsuario';
import { Ionicons } from '@expo/vector-icons';

export default function TelaConfiguracao() {
  const router = useRouter();
  const { usuarioLogado, solicitarAtualizacao } = useUsuario();
  const [limite, setLimite] = useState(usuarioLogado?.limiteNotificacao?.toString() || '0');

  // + exibirMensagemSucesso()
  const exibirMensagemSucesso = () => Alert.alert("Sucesso", "Limite atualizado!");

  // + informarNovoLimite(valor: Float)
  const informarNovoLimite = () => {
    const sucesso = solicitarAtualizacao({ limiteNotificacao: parseFloat(limite) });
    if (sucesso) exibirMensagemSucesso();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#008c45" />
      </TouchableOpacity>

      <Text style={styles.title}>Configurações</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Limite para aviso de saldo (R$):</Text>
        <TextInput 
          style={styles.input}
          keyboardType="numeric"
          value={limite}
          onChangeText={setLimite}
        />
        <TouchableOpacity style={styles.btnVerde} onPress={informarNovoLimite}>
          <Text style={styles.btnText}>Salvar Limite</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btnPerfil} onPress={() => router.push('/perfil')}>
        <Ionicons name="person-circle-outline" size={24} color="#008c45" />
        <Text style={styles.btnPerfilText}>Acessar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#fff' },
  backBtn: { marginTop: 40, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#008c45', marginBottom: 30 },
  section: { marginBottom: 40 },
  label: { fontSize: 16, color: '#333', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#008c45', borderRadius: 10, padding: 12, marginBottom: 15 },
  btnVerde: { backgroundColor: '#008c45', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  btnPerfil: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderWidth: 1, borderColor: '#008c45', borderRadius: 10 },
  btnPerfilText: { color: '#008c45', fontWeight: 'bold', marginLeft: 10 }
});