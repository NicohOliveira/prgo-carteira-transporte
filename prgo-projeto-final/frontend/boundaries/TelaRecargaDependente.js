import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_URL } from '../constants/api';

export default function TelaRecargaDependente() {
    const router = useRouter();
    
    // Dados vindos da tela anterior
    const { idDependente, nomeDependente } = useLocalSearchParams();

    const [valor, setValor] = useState(null);
    const [valorDigitado, setValorDigitado] = useState('');
    const [metodo, setMetodo] = useState('PIX');
    const [enviando, setEnviando] = useState(false); 

    const valores = [10, 20, 30, 50, 100, 200];

    const handleAvancar = async () => {
        const valorFinal = valorDigitado ? parseFloat(valorDigitado.replace(',', '.')) : valor;

        if (!valorFinal || isNaN(valorFinal) || valorFinal <= 0) {
            return Alert.alert("Atenção", "Informe um valor válido para recarregar.");
        }

        if (!idDependente) {
            return Alert.alert("Erro", "Nenhum dependente selecionado para receber o crédito.");
        }

        // Inicia a animação de carregamento no botão
        setEnviando(true);

        try {
            const url = `${API_URL}/usuarios/${idDependente}/recarga`;
            
            const resposta = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ valor: valorFinal }),
            });

            setEnviando(false);

            if (resposta.ok) {
                Alert.alert(
                    "Sucesso", 
                    `Recarga de R$ ${valorFinal.toFixed(2).replace('.', ',')} realizada com sucesso para ${nomeDependente || 'o dependente'}!`,
                    [
                        { 
                            text: "OK", 
                            onPress: () => router.dismiss(1) // Volta para a tela da lista de dependentes atualizada
                        }
                    ]
                );
            } else {
                // Captura mensagens de erro de regras de negócio do seu backend (ex: se o dependente for isento)
                const textoErro = await resposta.text();
                Alert.alert("Falha na Recarga", textoErro || "Não foi possível concluir a transferência.");
            }
        } catch (erro) {
            setEnviando(false);
            console.error(erro);
            Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor backend.");
        }
    };

    return (
        <View style={styles.container}>
            {/* Botão de voltar simples para melhorar a navegação */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.btnVoltar}>
                    <Ionicons name="arrow-back" size={24} color="#008c45" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Recarregar Dependente</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Banner identificando quem vai receber o crédito */}
                <View style={styles.bannerDependente}>
                    <Ionicons name="person-circle-outline" size={24} color="#008c45" />
                    <Text style={styles.txtBanner}>Destinatário: <Text style={styles.nomeNegrito}>{nomeDependente || 'Dependente'}</Text></Text>
                </View>

                <Text style={styles.subtitle}>Escolha um valor predefinido</Text>
                <View style={styles.grid}>
                    {valores.map((v) => (
                        <TouchableOpacity
                            key={v}
                            style={[styles.btnValor, valor === v && !valorDigitado && styles.btnValorSelected]}
                            onPress={() => {
                                setValor(v);
                                setValorDigitado('');
                            }}
                        >
                            <Text style={[styles.txtValor, valor === v && !valorDigitado && styles.txtValorSelected]}>R$ {v}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.subtitle}>Ou digite outro valor</Text>
                <TextInput
                    style={styles.inputPersonalizado}
                    placeholder="Ex: 15.50"
                    keyboardType="numeric"
                    value={valorDigitado}
                    onChangeText={(texto) => {
                        setValorDigitado(texto);
                        setValor(null);
                    }}
                />

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

                <TouchableOpacity 
                    style={[styles.btnAvancar, enviando && { backgroundColor: '#ccc' }]} 
                    onPress={handleAvancar}
                    disabled={enviando}
                >
                    {enviando ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.btnAvancarText}>Confirmar e Enviar Crédito</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 40 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    btnVoltar: { padding: 5, marginRight: 10 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#008c45' },
    
    bannerDependente: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9f4', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#a3e2bc', marginBottom: 5 },
    txtBanner: { marginLeft: 8, fontSize: 15, color: '#333' },
    nomeNegrito: { fontWeight: 'bold', color: '#008c45' },

    subtitle: { fontSize: 16, fontWeight: 'bold', color: '#008c45', marginTop: 20, marginBottom: 15 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    btnValor: { width: '30%', paddingVertical: 15, borderWidth: 1, borderColor: '#008c45', borderRadius: 20, alignItems: 'center', marginBottom: 15 },
    btnValorSelected: { backgroundColor: '#e6f4ea' },
    txtValor: { color: '#008c45', fontWeight: 'bold', fontSize: 16 },
    txtValorSelected: { color: '#006b35' },
    inputPersonalizado: { width: '100%', padding: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, fontSize: 16, color: '#333', marginBottom: 10 },
    btnMetodo: { flexDirection: 'row', alignItems: 'center', padding: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, marginBottom: 10 },
    btnMetodoSelected: { borderColor: '#008c45', backgroundColor: '#e6f4ea' },
    txtMetodo: { marginLeft: 10, fontSize: 16, color: '#666' },
    txtMetodoSelected: { color: '#008c45', fontWeight: 'bold' },
    btnAvancar: { backgroundColor: '#008c45', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30, marginBottom: 40 },
    btnAvancarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});