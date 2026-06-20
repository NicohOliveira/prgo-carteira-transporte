import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Minhas Alterações: Trazendo as ferramentas reais do backend
import { useUsuario } from '../controls/GerenciadorUsuario';
import { API_URL } from '../constants/api';

export default function TelaPagamentoPix() {
    const router = useRouter();
    const { valorSelecionado } = useLocalSearchParams();

    // Minhas Alterações: Pegando o usuário logado para saber em qual conta depositar
    const { usuarioLogado, setUsuarioLogado } = useUsuario();
    const [carregando, setCarregando] = useState(false);

    const codigoPixMock = "00020126580014br.gov.bcb.pix01363604...";

    const handleSimularPagamento = async () => {
        // Minhas Alterações: Trava de segurança
        if (!usuarioLogado || !usuarioLogado.id) {
            Alert.alert("Erro", "Sessão expirada ou usuário não encontrado.");
            return;
        }

        setCarregando(true);

        try {
            // Chama o Controller. O await espera os 2 segundos que programamos.
            const resposta = await fetch(`${API_URL}/usuarios/${usuarioLogado.id}/recarga`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Bypass-Tunnel-Reminder': 'true'
                },
                body: JSON.stringify({ valor: parseFloat(valorSelecionado) })
            });

            if (resposta.ok) {
                // Minhas Alterações: Atualizando os dados do celular com o novo saldo do Java
                const usuarioAtualizadoBanco = await resposta.json();

                // Mapeia os dados novos para não quebrar a sessão
                setUsuarioLogado(prev => {
                    const clone = Object.assign(Object.create(Object.getPrototypeOf(prev)), prev);
                    if (clone.carteirinha || clone._carteirinha) {
                        const cart = clone.carteirinha || clone._carteirinha;
                        cart.saldo = usuarioAtualizadoBanco.carteirinha.saldo;
                    }
                    return clone;
                });

                setCarregando(false);
                router.replace('/sucesso'); // redireciona para a tela de sucesso
            } else {
                setCarregando(false);
                Alert.alert("Erro", "O banco de dados recusou a recarga.");
            }
        } catch (erro) {
            setCarregando(false);
            Alert.alert("Erro de Conexão", "Não foi possível bater no servidor Java.");
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

            <TouchableOpacity
                style={styles.btnSimular}
                onPress={handleSimularPagamento}
                disabled={carregando}
            >
                {carregando ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSimularText}>Simular Pagamento Pago</Text>}
            </TouchableOpacity>

            {carregando && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.textoCarregando}>Processando no Servidor...</Text>
                </View>
            )}
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
    btnSimularText: { color: '#fff', fontWeight: 'bold' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
    textoCarregando: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 15 }
});