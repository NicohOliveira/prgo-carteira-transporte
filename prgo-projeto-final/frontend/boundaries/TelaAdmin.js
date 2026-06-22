import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch, ScrollView } from 'react-native';
import { API_URL } from '../constants/api';

export default function TelaAdmin() {
    const [cpfBusca, setCpfBusca] = useState('');
    const [usuario, setUsuario] = useState(null);
    const [valorRecarga, setValorRecarga] = useState('');
    const [telefone, setTelefone] = useState('');
    const [fotoPerfil, setFotoPerfil] = useState('');
    const [isento, setIsento] = useState(false);

    const buscarUsuario = async () => {
        if (!cpfBusca) {
            Alert.alert("Aviso", "Digite um CPF para buscar.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/usuarios/cpf/${cpfBusca}`, {
                headers: { 'Bypass-Tunnel-Reminder': 'true' }
            });
            if (response.ok) {
                const dados = await response.json();
                setUsuario(dados);
                setTelefone(dados.telefone || '');
                setFotoPerfil(dados.fotoPerfil || '');
                setIsento(dados.isento || false);
            } else {
                Alert.alert("Não Encontrado", "Nenhum utilizador encontrado com este CPF.");
                setUsuario(null);
            }
        } catch (error) {
            Alert.alert("Erro", "Falha ao conectar com o servidor.");
        }
    };

    const salvarAlteracoes = async () => {
        if (!usuario) return;

        const usuarioAtualizado = {
            ...usuario,
            telefone: telefone,
            fotoPerfil: fotoPerfil,
            isento: isento
        };

        try {
            const response = await fetch(`${API_URL}/usuarios/${usuario.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Bypass-Tunnel-Reminder': 'true'
                },
                body: JSON.stringify(usuarioAtualizado)
            });

            if (response.ok) {
                Alert.alert("Sucesso", "Dados do utilizador atualizados!");
                const atualizado = await response.json();
                setUsuario(atualizado);
            } else {
                Alert.alert("Erro", "Não foi possível atualizar os dados.");
            }
        } catch (error) {
            Alert.alert("Erro", "Falha ao salvar as alterações.");
        }
    };

    const realizarRecarga = async () => {
        if (!valorRecarga || isNaN(valorRecarga) || Number(valorRecarga) <= 0) {
            Alert.alert("Erro", "Digite um valor válido para recarga.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/usuarios/${usuario.id}/recarga`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Bypass-Tunnel-Reminder': 'true'
                },
                body: JSON.stringify({ valor: parseFloat(valorRecarga.replace(',', '.')) })
            });

            if (response.ok) {
                const atualizado = await response.json();
                setUsuario(atualizado);
                setValorRecarga('');
                Alert.alert("Sucesso", "Recarga realizada com sucesso!");
            } else {
                const erroText = await response.text();
                Alert.alert("Erro", erroText || "Não foi possível realizar a recarga.");
            }
        } catch (error) {
            Alert.alert("Erro", "Falha na conexão ao tentar recarregar.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>

                <View style={styles.card}>
                    <Text style={styles.titulo}>Painel de Atendimento</Text>
                    <View style={styles.buscaRow}>
                        <TextInput
                            style={styles.inputBusca}
                            placeholder="Buscar utente por CPF"
                            value={cpfBusca}
                            onChangeText={setCpfBusca}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity style={styles.botaoBuscar} onPress={buscarUsuario}>
                            <Text style={styles.textoBotaoBuscar}>Buscar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {usuario && (
                    <View style={styles.card}>
                        <Text style={styles.subtitulo}>Ficha do Utente: {usuario.nome}</Text>
                        <Text style={styles.infoTexto}>CPF: {usuario.cpf}</Text>
                        <Text style={styles.infoTexto}>Idade: {usuario.idade}</Text>

                        <Text style={[styles.infoTexto, { fontWeight: 'bold', color: '#008c45', fontSize: 18, marginTop: 10 }]}>
                            Saldo Atual: R$ {usuario.carteirinha?.saldo?.toFixed(2).replace('.', ',') || '0,00'}
                        </Text>

                        <View style={styles.divisor} />

                        <Text style={styles.label}>Adicionar Saldo (R$)</Text>
                        <View style={styles.buscaRow}>
                            <TextInput
                                style={styles.inputBusca}
                                placeholder="Ex: 50,00"
                                value={valorRecarga}
                                onChangeText={setValorRecarga}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity style={[styles.botaoBuscar, { backgroundColor: '#008c45' }]} onPress={realizarRecarga}>
                                <Text style={styles.textoBotaoBuscar}>Recarregar</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divisor} />

                        <Text style={styles.label}>Telefone de Contato</Text>
                        <TextInput
                            style={styles.inputEdicao}
                            value={telefone}
                            onChangeText={setTelefone}
                            placeholder="(00) 00000-0000"
                        />

                        <Text style={styles.label}>URL da Foto de Perfil</Text>
                        <TextInput
                            style={styles.inputEdicao}
                            value={fotoPerfil}
                            onChangeText={setFotoPerfil}
                            placeholder="https://link-da-foto.com/foto.jpg"
                        />

                        <View style={styles.switchRow}>
                            <Text style={styles.labelSwitch}>Passe Livre (Isenção):</Text>
                            <Switch
                                value={isento}
                                onValueChange={setIsento}
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={isento ? "#1976d2" : "#f4f3f4"}
                            />
                        </View>

                        <TouchableOpacity style={styles.botaoSalvar} onPress={salvarAlteracoes}>
                            <Text style={styles.textoBotaoSalvar}>Salvar Alterações</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, backgroundColor: '#f4f4f9', paddingVertical: 40 },
    container: { flex: 1, alignItems: 'center', width: '100%', paddingHorizontal: 20 },
    card: { width: '100%', maxWidth: 600, backgroundColor: '#fff', padding: 25, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 4, marginBottom: 20 },
    titulo: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    subtitulo: { fontSize: 18, fontWeight: 'bold', color: '#1976d2', marginBottom: 10 },
    buscaRow: { flexDirection: 'row', gap: 10 },
    inputBusca: { flex: 1, height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, backgroundColor: '#fafafa' },
    botaoBuscar: { backgroundColor: '#333', height: 50, paddingHorizontal: 20, justifyContent: 'center', borderRadius: 8 },
    textoBotaoBuscar: { color: '#fff', fontWeight: 'bold' },
    infoTexto: { fontSize: 16, color: '#555', marginBottom: 5 },
    divisor: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
    label: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 5 },
    inputEdicao: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, backgroundColor: '#fafafa' },
    switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
    labelSwitch: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    botaoSalvar: { backgroundColor: '#4caf50', height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
    textoBotaoSalvar: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});