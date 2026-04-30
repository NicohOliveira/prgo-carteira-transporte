import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TelaRecarga() {
    const router = useRouter();
    const [valor, setValor] = useState(null);
    const [metodo, setMetodo] = useState('PIX');

    const valores = [10, 20, 30, 50, 100, 200];

    const handleAvancar = () => {
        if (!valor) return Alert.alert("Atenção", "Escolha um valor para recarregar.");

        if (metodo === 'PIX') {
            // passa o valor via rota para a tela do PIX
            router.push({ pathname: '/pagamento-pix', params: { valorSelecionado: valor } });
        } else {
            Alert.alert("Aviso", "Apenas PIX está implementado nesta demonstração.");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Recarga de créditos</Text>

                <Text style={styles.subtitle}>Escolha um valor predefinido</Text>
                <View style={styles.grid}>
                    {valores.map((v) => (
                        <TouchableOpacity
                            key={v}
                            style={[styles.btnValor, valor === v && styles.btnValorSelected]}
                            onPress={() => setValor(v)}
                        >
                            <Text style={[styles.txtValor, valor === v && styles.txtValorSelected]}>R$ {v}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.subtitle}>Escolha um método de pagamento</Text>
                {['PIX', 'Cartão de Crédito', 'Boleto Bancário'].map((m) => (
                    <TouchableOpacity
                        key={m}
                        style={[styles.btnMetodo, metodo === m && styles.btnMetodoSelected]}
                        onPress={() => setMetodo(m)}
                    >
                        <Ionicons name={m === 'PIX' ? 'qr-code' : m === 'Boleto Bancário' ? 'barcode' : 'card'} size={24} color={metodo === m ? '#008c45' : '#666'} />
                        <Text style={[styles.txtMetodo, metodo === m && styles.txtMetodoSelected]}>{m}</Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.btnAvancar} onPress={handleAvancar}>
                    <Text style={styles.btnAvancarText}>Avançar para Pagamento</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 50 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#008c45', marginBottom: 20, textAlign: 'center' },
    subtitle: { fontSize: 16, fontWeight: 'bold', color: '#008c45', marginTop: 20, marginBottom: 15 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    btnValor: { width: '30%', paddingVertical: 15, borderWidth: 1, borderColor: '#008c45', borderRadius: 20, alignItems: 'center', marginBottom: 15 },
    btnValorSelected: { backgroundColor: '#e6f4ea' },
    txtValor: { color: '#008c45', fontWeight: 'bold', fontSize: 16 },
    txtValorSelected: { color: '#006b35' },
    btnMetodo: { flexDirection: 'row', alignItems: 'center', padding: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, marginBottom: 10 },
    btnMetodoSelected: { borderColor: '#008c45', backgroundColor: '#e6f4ea' },
    txtMetodo: { marginLeft: 10, fontSize: 16, color: '#666' },
    txtMetodoSelected: { color: '#008c45', fontWeight: 'bold' },
    btnAvancar: { backgroundColor: '#008c45', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30, marginBottom: 40 },
    btnAvancarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});