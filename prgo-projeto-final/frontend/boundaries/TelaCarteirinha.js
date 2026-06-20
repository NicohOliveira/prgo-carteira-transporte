import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUsuario } from '../controls/GerenciadorUsuario';
import { useCarteirinha } from '../controls/GerenciadorCarteirinha';

export default function TelaCarteirinha() {
    const router = useRouter();

    const { usuarioLogado, usuarios } = useUsuario();
    const { codigoQr } = useCarteirinha();

    const usuarioExibicao = usuarioLogado || (usuarios.length > 0 ? usuarios[usuarios.length - 1] : null);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color="#008c45" />
                </TouchableOpacity>
                <Text style={styles.title}>Carteirinha QR</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.card}>
                <Ionicons name="person-circle" size={100} color="#ccc" />
                {/* 3. Mostramos o nome e usamos o CPF como número do cartão para ficar realista */}
                <Text style={styles.name}>{usuarioExibicao?._nome || 'Usuário Não Encontrado'}</Text>
                <Text style={styles.cardNumber}>
                    {usuarioExibicao?._cpf ? `${usuarioExibicao._cpf}-Comum` : '0000123456-Comum'}
                </Text>
            </View>

            <View style={styles.qrContainer}>
                {/* O QR Code na vida real seria gerado pela biblioteca react-native-qrcode-svg usando a variável codigoQr */}
                <Ionicons name="qr-code" size={250} color="black" />
                <Text style={styles.qrText}>Aproxime do leitor na catraca</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 50 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#008c45' },
    card: { alignItems: 'center', marginBottom: 40 },
    name: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 10 },
    cardNumber: { fontSize: 16, color: '#666' },
    qrContainer: { alignItems: 'center', justifyContent: 'center', flex: 1 },
    qrText: { marginTop: 20, fontSize: 16, color: '#666' }
});