import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useUsuario } from '../controls/GerenciadorUsuario';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function TelaPerfil() {
    const router = useRouter();
    const { usuarioLogado, solicitarAtualizacao, solicitarExclusao } = useUsuario();

    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        if (usuarioLogado) {
            setNome(usuarioLogado._nome || usuarioLogado.nome || '');
            setTelefone(usuarioLogado._telefone || usuarioLogado.telefone || '');
            setFotoPerfil(usuarioLogado.fotoPerfil || null);
        }
    }, [usuarioLogado]);

    const escolherFoto = async () => {
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissao.status !== 'granted') {
            Alert.alert('Aviso', 'Precisamos da permissão para aceder à galeria.');
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.2,
            base64: true,
        });

        if (!resultado.canceled) {
            const imagemBase64 = `data:image/jpeg;base64,${resultado.assets[0].base64}`;
            setFotoPerfil(imagemBase64);
        }
    };

    const handleSalvar = async () => {
        setCarregando(true);
        // Como é uma requisição ao servidor, precisamos do 'await'
        const sucesso = await solicitarAtualizacao({ nome, telefone, fotoPerfil });
        setCarregando(false);

        if (sucesso) {
            Alert.alert("Sucesso", "Dados e foto atualizados com sucesso!");
        } else {
            Alert.alert("Erro", "Ocorreu um problema ao salvar os dados.");
        }
    };

    const clicarExcluirConta = () => {
        Alert.alert(
            "Confirmação",
            "Tem certeza que deseja excluir sua conta?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Confirmar",
                    style: "destructive",
                    onPress: async () => {
                        setCarregando(true);
                        const sucesso = await solicitarExclusao();
                        setCarregando(false);

                        if (sucesso) {
                            router.replace('/');
                        } else {
                            Alert.alert("Erro", "Ocorreu um problema na operação.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.btnIconeVoltar}>
                        <Ionicons name="arrow-back" size={28} color="#008c45" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Perfil do Usuário</Text>
                </View>

                <View style={styles.profileSection}>
                    <TouchableOpacity style={styles.imageContainer} onPress={escolherFoto} disabled={carregando}>
                        {fotoPerfil ? (
                            <Image source={{ uri: fotoPerfil }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.profileImagePlaceholder}>
                                <Ionicons name="camera" size={50} color="#fff" />
                            </View>
                        )}
                        <View style={styles.editIconContainer}>
                            <Ionicons name="pencil" size={16} color="#fff" />
                        </View>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Nome:</Text>
                <TextInput style={styles.input} value={nome} onChangeText={setNome} editable={!carregando} />

                <Text style={styles.label}>Telefone:</Text>
                <TextInput
                    style={styles.input}
                    value={telefone}
                    onChangeText={setTelefone}
                    keyboardType="phone-pad"
                    editable={!carregando}
                />

                <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar} disabled={carregando}>
                    <Text style={styles.btnText}>Salvar Dados</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnDelete} onPress={clicarExcluirConta} disabled={carregando}>
                    <Text style={styles.btnDeleteText}>Excluir Conta</Text>
                </TouchableOpacity>

            </ScrollView>

            {carregando && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.textoCarregando}>A processar operação...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { padding: 25, flexGrow: 1, justifyContent: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, marginTop: 20 },
    btnIconeVoltar: { marginRight: 15 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#008c45' },

    profileSection: { alignItems: 'center', marginBottom: 30 },
    imageContainer: { position: 'relative' },
    profileImage: { width: 140, height: 140, borderRadius: 70, borderWidth: 3, borderColor: '#008c45' },
    profileImagePlaceholder: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#008c45' },
    editIconContainer: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#008c45', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },

    label: { fontWeight: 'bold', marginBottom: 5, color: '#008c45' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, marginBottom: 20 },
    btnSalvar: { backgroundColor: '#008c45', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    btnText: { color: '#fff', fontWeight: 'bold' },
    btnDelete: { marginTop: 40, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: 'red', borderRadius: 10 },
    btnDeleteText: { color: 'red', fontWeight: 'bold' },

    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
    textoCarregando: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 15 }
});