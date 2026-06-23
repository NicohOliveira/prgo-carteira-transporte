import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUsuario } from '../controls/GerenciadorUsuario';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../constants/api';

export default function TelaListaDependentes() {
  const router = useRouter();
  const { usuarioLogado } = useUsuario();
  
  const [dependentes, setDependentes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarDependentes = async () => {
    try {
      const url = `${API_URL}/usuarios/${usuarioLogado.id}`;
      const resposta = await fetch(url);
      
      if (resposta.ok) {
        const dadosUsuario = await resposta.json();
        setDependentes(dadosUsuario.dependentes || []);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar a lista de dependentes.');
      }
    } catch (erro) {
      console.error(erro);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (usuarioLogado?.id) {
      carregarDependentes();
    }
  }, [usuarioLogado]);

  const formatarCPF = (texto) => {
    let num = texto.replace(/\D/g, '');
    if (num.length > 11) num = num.slice(0, 11);
    num = num.replace(/(\d{3})(\d)/, '$1.$2');
    num = num.replace(/(\d{3})(\d)/, '$1.$2');
    num = num.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return num;
  };

  // transfere para a tela de recarga do dependente
  const handleTransferir = (dependente) => {
    router.push({
      pathname: '/recarga-dependente', 
      params: { 
        idDependente: dependente.id,
        nomeDependente: dependente.nome
      }
    });
  };

  // Renderiza cada card de dependente
  const renderItem = ({ item }) => {
    // Busca o saldo dentro da carteirinha do dependente
    const saldoDependente = item.carteirinha?.saldo || 0;

    return (
      <View style={styles.dependenteCard}>
        <View style={styles.infoContainer}>
          <Text style={styles.nomeText} numberOfLines={1}>{item.nome}</Text>
          <Text style={styles.cpfText}>CPF: {formatarCPF(item.cpf)}</Text>
          
          <View style={styles.saldoRow}>
            <Text style={styles.saldoLabel}>Saldo atual: </Text>
            <Text style={styles.saldoValor}>R$ {saldoDependente.toFixed(2).replace('.', ',')}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.btnTransferir} 
          onPress={() => handleTransferir(item)}
        >
          <Ionicons name="swap-horizontal-outline" size={20} color="#fff" />
          <Text style={styles.btnTransferirText}>Transferir</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#008c45" />
        </TouchableOpacity>
        <Text style={styles.tituloTela}>Meus Dependentes</Text>
      </View>

      {carregando ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#008c45" />
          <Text style={styles.textoCarregando}>Buscando dependentes...</Text>
        </View>
      ) : dependentes.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="people-outline" size={60} color="#ccc" />
          <Text style={styles.textoVazio}>Você ainda não possui nenhum dependente cadastrado.</Text>
        </View>
      ) : (
        <FlatList
          data={dependentes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  btnVoltar: { padding: 5, marginRight: 10 },
  tituloTela: { fontSize: 20, fontWeight: 'bold', color: '#008c45' },
  listContent: { padding: 20 },
  
  dependenteCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#008c45',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoContainer: { flex: 1, marginRight: 10 },
  nomeText: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  cpfText: { fontSize: 13, color: '#666', marginBottom: 8 },
  
  saldoRow: { flexDirection: 'row', alignItems: 'center' },
  saldoLabel: { fontSize: 13, color: '#666' },
  saldoValor: { fontSize: 14, fontWeight: 'bold', color: '#008c45' },
  
  btnTransferir: {
    backgroundColor: '#008c45',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 110
  },
  btnTransferirText: { color: '#fff', fontWeight: 'bold', fontSize: 13, marginLeft: 5 },
  textoCarregando: { marginTop: 10, color: '#666', fontWeight: '500' },
  textoVazio: { marginTop: 15, color: '#888', textAlign: 'center', fontSize: 15, lineHeight: 22 }
});