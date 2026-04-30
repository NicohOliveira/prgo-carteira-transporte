import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAutenticador } from '../controls/Autenticador';
import { Ionicons } from '@expo/vector-icons';

export default function TelaMenuPrincipal() {
  const router = useRouter();
  const { finalizarSessao } = useAutenticador();

  // + clicarBotaoLogout()
  const clicarBotaoLogout = () => {
    finalizarSessao(); // Chama o método do Autenticador
    router.replace('/'); 
  };

  // + redirecionar()
  const redirecionar = (rota) => {
    router.push(rota);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Card de Saldo */}
        <View style={styles.saldoCard}>
          <View>
            <Text style={styles.saldoLabel}>Saldo disponível</Text>
            <Text style={styles.saldoValor}>R$ 45,80</Text>
          </View>
          <Ionicons name="bus" size={60} color="white" />
        </View>

        <View style={styles.qrCard}>
          <Text style={styles.qrTitle}>Carteirinha QR</Text>
          <Ionicons name="qr-code" size={180} color="black" />
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.navButton} onPress={() => redirecionar('/historico')}>
            <Ionicons name="time-outline" size={24} color="white" />
            <Text style={styles.navButtonText}>Histórico</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={() => redirecionar('/configuracao')}>
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
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, alignItems: 'center' },
  saldoCard: { backgroundColor: '#008c45', width: '100%', borderRadius: 25, padding: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40 },
  saldoLabel: { color: '#fff', fontSize: 16 },
  saldoValor: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  qrCard: { width: '100%', borderWidth: 1, borderColor: '#008c45', borderRadius: 25, padding: 20, alignItems: 'center', marginTop: 20 },
  qrTitle: { color: '#008c45', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 },
  navButton: { backgroundColor: '#008c45', width: '48%', height: 80, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  navButtonText: { color: 'white', fontWeight: 'bold', marginTop: 5 },
  btnLogout: { marginTop: 30, padding: 10 },
  btnLogoutText: { color: 'red', fontWeight: 'bold' }
});