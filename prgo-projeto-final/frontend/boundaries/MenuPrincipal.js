import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAutenticador } from '../controls/Autenticador';
import { Ionicons } from '@expo/vector-icons';
import { useUsuario } from '../controls/GerenciadorUsuario';
import QRCode from 'react-native-qrcode-svg';
import { API_URL } from '@/constants/api';

export default function TelaMenuPrincipal() {
  const router = useRouter();
  const { finalizarSessao } = useAutenticador();
  const { usuarioLogado } = useUsuario();

  const [mostrarInputDependente, setMostrarInputDependente] = useState(false);
  const [cpfDependente, setCpfDependente] = useState('');
  const [enviando, setEnviando] = useState(false);

  const saldo = usuarioLogado?.carteirinha?.saldo || 0;
  const nomeExibicao = usuarioLogado?.nome ? usuarioLogado.nome.split(' ')[0] : 'Usuário';
  const cart = usuarioLogado?.carteirinha || usuarioLogado?._carteirinha;
  const cpfUsuario = usuarioLogado?.cpf || usuarioLogado?._cpf;
  const valorQrCode = cart?.codigoQr || cart?._codigoQr || cart?.codigo_qr || (cpfUsuario ? `QR_${cpfUsuario}` : "QR_ERRO_000");

  const clicarBotaoLogout = () => {
    finalizarSessao();
    router.replace('/');
  };

  const exibirMensagemSucesso = () => {
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    };

  const formatarCPF = (texto) => {
    let num = texto.replace(/\D/g, '');
    if (num.length > 11) num = num.slice(0, 11);
    num = num.replace(/(\d{3})(\d)/, '$1.$2');
    num = num.replace(/(\d{3})(\d)/, '$1.$2');
    num = num.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return num;
  };

  // --- FUNÇÃO PARA VINCULAR DEPENDENTE AO BACKEND ---
  const handleAdicionarDependente = async () => {
    const cpfLimpo = cpfDependente.replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
      Alert.alert('Erro', 'CPF inválido.');
      return;
    }

    if (cpfLimpo === cpfUsuario) {
      Alert.alert('Erro', 'Você não pode adicionar si próprio como dependente.');
      return;
    }

    setEnviando(true);

    try {
      const resposta = await fetch(`${API_URL}/usuarios/${usuarioLogado.id}/dependentes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpfDependente: cpfLimpo }),
      });

      setEnviando(false);

      if (resposta.ok) {
        Alert.alert('Sucesso', 'Dependente vinculado com sucesso!');
        setCpfDependente('');
        setMostrarInputDependente(false);
      } else {
        const erroMensagem = await resposta.text();
        Alert.alert('Erro no Vínculo', erroMensagem || 'Não foi possível adicionar o dependente.');
      }
    } catch (error) {
      setEnviando(false);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor backend.');
    }
  };

  return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.circlePhoto} onPress={() => router.push('/perfil')}>
              {usuarioLogado?.fotoPerfil ? (
                  <Image
                      source={{ uri: usuarioLogado.fotoPerfil }}
                      style={{ width: 60, height: 60, borderRadius: 30 }}
                  />
              ) : (
                  <Ionicons name="person" size={30} color="#ccc" />
              )}
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

          <View style={styles.containerDependente}>
            {!mostrarInputDependente ? (
              <TouchableOpacity 
                style={styles.btnMostrarDependente} 
                onPress={() => setMostrarInputDependente(true)}
              >
                <Ionicons name="people-outline" size={20} color="#008c45" />
                <Text style={styles.btnMostrarDependenteText}>Adicionar Dependente</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.cardFormDependente}>
                <Text style={styles.tituloDependente}>Vincular Dependente</Text>
                <TextInput
                  style={styles.inputDependente}
                  placeholder="Digite o CPF do dependente"
                  keyboardType="numeric"
                  value={cpfDependente}
                  onChangeText={(texto) => setCpfDependente(formatarCPF(texto))}
                />
                <View style={styles.rowBotoesDependente}>
                  <TouchableOpacity 
                    style={[styles.btnAcaoDependente, { backgroundColor: '#ccc' }]} 
                    onPress={() => { setMostrarInputDependente(false); setCpfDependente(''); }}
                  >
                    <Text style={{ color: '#333', fontWeight: 'bold' }}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.btnAcaoDependente, { backgroundColor: '#008c45' }]} 
                    onPress={handleAdicionarDependente}
                    disabled={enviando}
                  >
                    {enviando ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>Confirmar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.qrCard} onPress={() => router.push('/carteirinha')}>
            <Text style={styles.qrTitle}>Carteirinha QR</Text>

            {valorQrCode !== "QR_ERRO_000" ? (
                <QRCode
                    value={valorQrCode}
                    size={150}
                    color="black"
                    backgroundColor="white"
                />
            ) : (
                <Ionicons name="qr-code" size={150} color="#ccc" />
            )}

            <Text style={styles.qrHint}>Toque para ampliar</Text>
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

          <View style={styles.rowSingle}>
            <TouchableOpacity 
              style={styles.transferNavButton} 
              onPress={() => router.push('/dependentes')}
            >
              <Ionicons name="swap-horizontal-outline" size={24} color="white" />
              <Text style={styles.navButtonText}>Transferir</Text>
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
  saldoCard: { backgroundColor: '#008c45', width: '100%', borderRadius: 25, padding: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40 },
  saldoLabel: {color: '#fff', fontSize: 16},
  saldoValor: {color: '#fff', fontSize: 32, fontWeight: 'bold'},
  btnRecarregar: {backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 15},
  btnRecarregarText: {color: '#008c45', fontWeight: 'bold'},

  qrCard: { width: '100%', borderWidth: 1, borderColor: '#008c45', borderRadius: 25, padding: 20, alignItems: 'center', marginTop: 20 },
  qrTitle: {color: '#008c45', fontSize: 20, fontWeight: 'bold', marginBottom: 15},
  qrHint: { color: '#666', marginTop: 15, fontWeight: 'bold' },

  row: {flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20},
  navButton: { backgroundColor: '#008c45', width: '48%', height: 80, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  navButtonText: {color: 'white', fontWeight: 'bold', marginTop: 5},
  
  // --- NOVOS ESTILOS ADICIONADOS PARA O BOTÃO DE TRANSFERIR ---
  rowSingle: { width: '100%', marginTop: 12 },
  transferNavButton: { backgroundColor: '#008c45', width: '100%', height: 80, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  
  btnLogout: {marginTop: 30, padding: 10},
  btnLogoutText: {color: 'red', fontWeight: 'bold'},
  headerTop: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 25, alignSelf: 'flex-start', marginTop: 20 },
  circlePhoto: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#008c45' },
  headerTextContainer: { marginLeft: 15 },
  greetingTitle: { fontSize: 22, fontWeight: 'bold', color: '#008c45' },
  greetingSubtitle: { fontSize: 14, color: '#666' },

  containerDependente: { width: '100%', marginTop: 20, },
  btnMostrarDependente: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#008c45', borderRadius: 15, paddingVertical: 12, width: '100%' },
  btnMostrarDependenteText: { color: '#008c45', fontWeight: 'bold', marginLeft: 8, fontSize: 15 },
  cardFormDependente: { width: '100%', borderWidth: 1, borderColor: '#ccc', backgroundColor: '#f9f9f9', borderRadius: 20, padding: 15 },
  tituloDependente: { color: '#008c45', fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  inputDependente: { width: '100%', height: 45, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, backgroundColor: '#fff', paddingHorizontal: 15, marginBottom: 12 },
  rowBotoesDependente: { flexDirection: 'row', justifyContent: 'space-between' },
  btnAcaoDependente: { width: '48%', height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }
});