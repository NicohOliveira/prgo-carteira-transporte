import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRouter } from 'expo-router';
import { useUsuario } from '../controls/GerenciadorUsuario';
import { Ionicons } from '@expo/vector-icons';
import { useAcessibilidade } from '../controls/GerenciadorAcessibilidade';

export default function TelaCarteirinha() {
    const { modoNavegacaoAmpliada } = useAcessibilidade();
    const router = useRouter();
    const { usuarioLogado } = useUsuario();
    const cart = usuarioLogado?.carteirinha || usuarioLogado?._carteirinha;
    const cpfUsuario = usuarioLogado?.cpf || usuarioLogado?._cpf;
    const nomeReal = usuarioLogado?.nome || usuarioLogado?._nome || 'Passageiro';
    const isento = usuarioLogado?.isento ?? usuarioLogado?._isento ?? false;

    const valorQrCode = cart?.codigoQr || cart?._codigoQr || cart?.codigo_qr || (cpfUsuario ? `QR_${cpfUsuario}` : "QR_ERRO_000");

    const nomeExibicao = nomeReal !== 'Passageiro' ? nomeReal.split(' ')[0] : 'Passageiro';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#008c45" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Carteirinha Digital</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.greeting}>Olá, {nomeExibicao}</Text>
                <Text style={styles.instruction}>
                    Aproxime este código do leitor da catraca para liberar a sua passagem.
                </Text>

                <View style={styles.qrCard}>
                    <QRCode
                        value={valorQrCode}
                        size={modoNavegacaoAmpliada ? 300 : 200}
                        color="black"
                        backgroundColor="white"
                    />

                    <Text style={styles.qrTextCode}>{valorQrCode}</Text>
                </View>

                {isento ? (
                    <View style={styles.badgeIsento}>
                        <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 5 }} />
                        <Text style={styles.badgeText}>Passe Livre (Isento)</Text>
                    </View>
                ) : (
                    <View style={styles.badgeComum}>
                        <Ionicons name="bus" size={20} color="#fff" style={{ marginRight: 5 }} />
                        <Text style={styles.badgeText}>Tarifa Comum</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    backButton: { marginRight: 15 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    content: { flex: 1, alignItems: 'center', padding: 20, marginTop: 20 },
    greeting: { fontSize: 24, fontWeight: 'bold', color: '#008c45', marginBottom: 10 },
    instruction: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30, paddingHorizontal: 20 },
    qrCard: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5,
        marginBottom: 30
    },
    qrTextCode: { marginTop: 20, fontSize: 14, color: '#999', letterSpacing: 2, fontWeight: 'bold' },
    badgeIsento: { flexDirection: 'row', backgroundColor: '#008c45', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, alignItems: 'center' },
    badgeComum: { flexDirection: 'row', backgroundColor: '#333', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, alignItems: 'center' },
    badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});