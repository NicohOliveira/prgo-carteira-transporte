import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useUsuario } from '../controls/GerenciadorUsuario';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

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
        const sucesso = await solicitarAtualizacao({ nome, telefone, fotoPerfil });
        setCarregando(false);

        if (sucesso) {
            Alert.alert("Sucesso", "Dados e foto atualizados com sucesso!");
        } else {
            Alert.alert("Erro", "Ocorreu um problema ao salvar os dados.");
        }
    };

    const imprimirPasse = async () => {
        setCarregando(true);
        try {
            const cpfUsuario = usuarioLogado?.cpf || usuarioLogado?._cpf || '000.000.000-00';
            const nomeReal = usuarioLogado?.nome || usuarioLogado?._nome || 'Passageiro';
            const isento = usuarioLogado?.isento ?? usuarioLogado?._isento ?? false;
            const valorQrCode = cpfUsuario !== '000.000.000-00' ? `QR_${cpfUsuario}` : "QR_ERRO_000";
            const tipoTarifa = isento ? "PASSE LIVRE (ISENTO)" : "TARIFA COMUM";

            const fotoSrc = usuarioLogado?.fotoPerfil || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

            const htmlContent = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; padding: 20px; background-color: #ececec; }
              .carteirinha { 
                background-color: white; 
                width: 320px; 
                border-radius: 15px; 
                overflow: hidden; 
                box-shadow: 0 4px 8px rgba(0,0,0,0.2); 
                text-align: center;
                border: 2px solid #008c45;
              }
              .header { background-color: #008c45; color: white; padding: 15px 0; font-size: 20px; font-weight: bold; letter-spacing: 1px; }
              .foto-container { margin-top: 20px; }
              .foto { width: 120px; height: 120px; border-radius: 60px; border: 4px solid #008c45; object-fit: cover; }
              .dados { padding: 10px 20px; text-align: left; }
              .nome { font-size: 22px; font-weight: bold; color: #333; margin: 10px 0 5px 0; text-align: center; }
              .info { font-size: 14px; color: #555; margin: 5px 0; border-bottom: 1px solid #eee; padding-bottom: 5px; }
              .tarifa-badge { background-color: ${isento ? '#008c45' : '#333'}; color: white; padding: 8px; border-radius: 5px; font-weight: bold; font-size: 14px; margin: 15px auto; width: 80%; text-align: center; }
              .qr-container { padding: 20px; background-color: #f9f9f9; border-top: 1px dashed #ccc; }
              .qr-code { width: 180px; height: 180px; }
              .rodape { font-size: 10px; color: #999; padding: 10px; }
            </style>
          </head>
          <body>
            <div class="carteirinha">
              <div class="header">PRGO - TRANSPORTE</div>
              
              <div class="foto-container">
                <img src="${fotoSrc}" class="foto" />
              </div>
              
              <div class="nome">${nomeReal}</div>
              
              <div class="dados">
                <div class="info"><strong>CPF:</strong> ${cpfUsuario}</div>
              </div>
              
              <div class="tarifa-badge">${tipoTarifa}</div>
              
              <div class="qr-container">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${valorQrCode}" class="qr-code" />
              </div>
              
              <div class="rodape">Documento Oficial PRGO - Válido para leitura em catracas.</div>
            </div>
          </body>
        </html>
      `;

            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
                base64: false
            });

            await Sharing.shareAsync(uri, {
                mimeType: 'application/pdf',
                dialogTitle: 'A sua Carteirinha PRGO',
                UTI: 'com.adobe.pdf'
            });

        } catch (erro) {
            console.error(erro);
            Alert.alert('Erro', 'Não foi possível gerar a carteirinha.');
        } finally {
            setCarregando(false);
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


                <TouchableOpacity style={styles.btnImprimir} onPress={imprimirPasse} disabled={carregando}>
                    <Ionicons name="print-outline" size={20} color="#008c45" style={{ marginRight: 10 }} />
                    <Text style={styles.btnImprimirText}>Imprimir Passe (PDF)</Text>
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
    textoCarregando: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 15 },
    btnImprimir: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 15, borderWidth: 2, borderColor: '#008c45' },
    btnImprimirText: { color: '#008c45', fontWeight: 'bold', fontSize: 16 }
});