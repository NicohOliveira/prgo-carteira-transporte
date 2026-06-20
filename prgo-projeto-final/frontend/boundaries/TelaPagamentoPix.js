import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { usePagamento } from '../controls/GerenciadorPagamento';

export default function TelaPagamentoPix() {
    const router = useRouter();
    const { valorSelecionado } = useLocalSearchParams();
    const { processarNovaRecarga } = usePagamento();
    const [carregando, setCarregando] = useState(false);

    const codigoPixMock = "00020126580014br.gov.bcb.pix01363604...";

    const handleSimularPagamento = async () => {
        setCarregando(true);
        // Chama o Controller. O await espera os 2 segundos que programamos.
        const sucesso = await processarNovaRecarga(parseFloat(valorSelecionado), "PIX");
        setCarregando(false);

        if (sucesso) {
            router.replace('/sucesso'); // redireciona para a tela de sucesso
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Aguardando pagamento</Text>
            <Text style={styles.valor}>R$ {valorSelecionado},00</Text>
            <Text style={styles.expira}>Expira em 10 minutos</Text>

            <View style={styles.qrContainer}>
                <Ionicons name="qr-code" size={200} color="black" />
            </View>

            <Text style={styles.info}>Escaneie o QR Code ou copie o código PIX abaixo:</Text>

            <View style={styles.codigoBox}>
                <Text style={styles.codigoText}>{codigoPixMock}</Text>
            </View>

            <TouchableOpacity style={styles.btnCopiar}>
                <Text style={styles.btnCopiarText}>Copiar código PIX</Text>
            </TouchableOpacity>

            {/* Botão de simulação */}
            <TouchableOpacity
                style={styles.btnSimular}
                onPress={handleSimularPagamento}
                disabled={carregando}
            >
                {carregando ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSimularText}>Simular Pagamento Pago</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 50, alignItems: 'center' },
    title: { fontSize: 20, color: '#333', marginTop: 10 },
    valor: { fontSize: 32, fontWeight: 'bold', color: '#008c45', marginVertical: 10 },
    expira: { fontSize: 14, color: '#f00', marginBottom: 20 },
    qrContainer: { padding: 20, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, marginBottom: 20 },
    info: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 10 },
    codigoBox: { width: '100%', backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10, marginBottom: 15 },
    codigoText: { color: '#333', textAlign: 'center', fontSize: 12 },
    btnCopiar: { width: '100%', padding: 15, borderWidth: 1, borderColor: '#008c45', borderRadius: 10, alignItems: 'center', marginBottom: 20 },
    btnCopiarText: { color: '#008c45', fontWeight: 'bold' },
    btnSimular: { width: '100%', backgroundColor: '#008c45', padding: 15, borderRadius: 10, alignItems: 'center' },
    btnSimularText: { color: '#fff', fontWeight: 'bold' }
});