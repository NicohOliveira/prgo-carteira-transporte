import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAutenticador } from '../controls/Autenticador';
import { Ionicons } from '@expo/vector-icons';
import { useUsuario } from '../controls/GerenciadorUsuario';

export default function TelaMenuPrincipal() {
  const router = useRouter();
  const { finalizarSessao } = useAutenticador();
  const { usuarioLogado } = useUsuario();

  const saldo = usuarioLogado?.carteirinha?.saldo || 0;
  const nomeExibicao = usuarioLogado?.nome ? usuarioLogado.nome.split(' ')[0] : 'Usuário';

  const clicarBotaoLogout = () => {
    finalizarSessao();
    router.replace('/');
  };

  return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.circlePhoto} onPress={() => router.push('/perfil')}>
              <Ionicons name="person" size={30} color="#ccc" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greetingTitle}>Olá, {nomeExibicao}</Text>
              <Text style={styles.greetingSubtitle}>Pra onde vamos hoje?</Text>
            </View>
          </View>

          <View style={styles.saldoCard}>
            <View>
              <Text style={styles.saldoLabel}>Saldo disponível</Text>
              <Text style={styles.saldoValor}>R$ {saldo.toFixed(2).replace('.', ',')}</Text>
            </View>

            <TouchableOpacity style={styles.btnRecarregar} onPress={() => router.push('/recarga')}>
              <Text style={styles.btnRecarregarText}>Recarregar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.qrCard} onPress={() => router.push('/carteirinha')}>
            <Text style={styles.qrTitle}>Carteirinha QR</Text>
            <Ionicons name="qr-code" size={180} color="black" />
          </TouchableOpacity>

          <View style={styles.row}>
            <TouchableOpacity style={styles.navButton} onPress={() => router.push('/historico')}>
              <Ionicons name="time-outline" size={24} color="white" />
              <Text style={styles.navButtonText}>Histórico</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton} onPress={() => router.push('/configuracao')}>
              <Ionicons name="settings-outline" size={24} color="white" />
              <Text style={styles.navButtonText}>Configurações</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btnLogout} onPress={clicarBotaoLogout}>
            <Text style={styles.btnLogoutText}>Sair da Conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  content: {padding: 20, alignItems: 'center'},
  saldoCard: {
    backgroundColor: '#008c45',
    width: '100%',
    borderRadius: 25,
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40
  },
  saldoLabel: {color: '#fff', fontSize: 16},
  saldoValor: {color: '#fff', fontSize: 32, fontWeight: 'bold'},
  btnRecarregar: {backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 15},
  btnRecarregarText: {color: '#008c45', fontWeight: 'bold'},

  qrCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#008c45',
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
    marginTop: 20
  },
  qrTitle: {color: '#008c45', fontSize: 20, fontWeight: 'bold', marginBottom: 10},
  row: {flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20},
  navButton: {
    backgroundColor: '#008c45',
    width: '48%',
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  navButtonText: {color: 'white', fontWeight: 'bold', marginTop: 5},
  btnLogout: {marginTop: 30, padding: 10},
  btnLogoutText: {color: 'red', fontWeight: 'bold'},
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 25,
    alignSelf: 'flex-start',
    marginTop: 20,
  },})
