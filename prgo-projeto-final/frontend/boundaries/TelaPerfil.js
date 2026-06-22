import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, ActivityIndicator, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useUsuario } from '../controls/GerenciadorUsuario';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useAcessibilidade } from '../controls/GerenciadorAcessibilidade';

export default function TelaPerfil() {
    const router = useRouter();
    const { usuarioLogado, solicitarAtualizacao, solicitarExclusao } = useUsuario();
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const { modoBaixoEstimulo, toggleBaixoEstimulo, modoNavegacaoAmpliada, toggleNavegacaoAmpliada } = useAcessibilidade();

    const cpfUsuario = usuarioLogado?.cpf || usuarioLogado?._cpf || '---.---.----00';
    const isIsento = usuarioLogado?.isento ?? usuarioLogado?._isento ?? false;
    const tipoPerfilFormatado = isIsento ? "Passe Livre (Isento)" : "Tarifa Comum";

    useEffect(() => {
        if (usuarioLogado) {
            setNome(usuarioLogado._nome || usuarioLogado.nome || '');
            setTelefone(usuarioLogado._telefone || usuarioLogado.telefone || '');
            setFotoPerfil(usuarioLogado.fotoPerfil || null);
            // quando tiver preferencias
            // setModoBaixoEstimulo(usuarioLogado.prefs?.baixoEstimulo || false);
        }
    }, [usuarioLogado]);

    const escolherFoto = async () => {
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissao.status !== 'granted') {
            Alert.alert('Aviso', 'Precisamos da permissão para acessar a galeria.');
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
            Alert.alert("Sucesso", "Configurações salvas com sucesso!");
        } else {
            Alert.alert("Erro", "Ocorreu um problema ao salvar os dados.");
        }
    };

    const imprimirPasse = async () => {
        setCarregando(true);
        try {
            const nomeReal = usuarioLogado?.nome || usuarioLogado?._nome || 'Passageiro';
            const valorQrCode = cpfUsuario !== '---.---.----00' ? `QR_${cpfUsuario}` : "QR_ERRO_000";
            const fotoSrc = usuarioLogado?.fotoPerfil || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

            const htmlContent = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; padding: 20px; background-color: #ececec; }
              .carteirinha { background-color: white; width: 320px; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.2); text-align: center; border: 2px solid #008c45; }
              .header { background-color: #008c45; color: white; padding: 15px 0; font-size: 20px; font-weight: bold; letter-spacing: 1px; }
              .foto-container { margin-top: 20px; }
              .foto { width: 120px; height: 120px; border-radius: 60px; border: 4px solid #008c45; object-fit: cover; }
              .dados { padding: 10px 20px; text-align: left; }
              .nome { font-size: 22px; font-weight: bold; color: #333; margin: 10px 0 5px 0; text-align: center; }
              .info { font-size: 14px; color: #555; margin: 5px 0; border-bottom: 1px solid #eee; padding-bottom: 5px; }
              .tarifa-badge { background-color: ${isIsento ? '#008c45' : '#333'}; color: white; padding: 8px; border-radius: 5px; font-weight: bold; font-size: 14px; margin: 15px auto; width: 80%; text-align: center; }
              .qr-container { padding: 20px; background-color: #f9f9f9; border-top: 1px dashed #ccc; }
              .qr-code { width: 180px; height: 180px; }
              .rodape { font-size: 10px; color: #999; padding: 10px; }
            </style>
          </head>
          <body>
            <div class="carteirinha">
              <div class="header">PRGO - TRANSPORTE</div>
              <div class="foto-container"><img src="${fotoSrc}" class="foto" /></div>
              <div class="nome">${nomeReal}</div>
              <div class="dados"><div class="info"><strong>CPF:</strong> ${cpfUsuario}</div></div>
              <div class="tarifa-badge">${tipoPerfilFormatado}</div>
              <div class="qr-container"><img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${valorQrCode}" class="qr-code" /></div>
              <div class="rodape">Documento Oficial PRGO - Válido para leitura em catracas.</div>
            </div>
          </body>
        </html>
      `;
            const { uri } = await Print.printToFileAsync({ html: htmlContent, base64: false });
            await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'A sua Carteirinha PRGO', UTI: 'com.adobe.pdf' });
        } catch (erro) {
            console.error(erro);
            Alert.alert('Erro', 'Não foi possível gerar a carteirinha.');
        } finally {
            setCarregando(false);
        }
    };

    const clicarExcluirConta = () => {
        Alert.alert(
            "Atenção!",
            "Deseja realmente excluir sua conta? Esta ação é irreversível.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir Definitivamente",
                    style: "destructive",
                    onPress: async () => {
                        setCarregando(true);
                        const sucesso = await solicitarExclusao();
                        setCarregando(false);
                        if (sucesso) router.replace('/');
                        else Alert.alert("Erro", "Ocorreu um problema ao excluir a conta.");
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
                    <Text style={styles.title}>Meu Perfil</Text>
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
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Informações da Conta</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>CPF:</Text>
                        <Text style={styles.infoValue}>{cpfUsuario}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Tipo de Tarifa:</Text>
                        <Text style={[styles.infoValue, { color: isIsento ? '#28A745' : '#333', fontWeight: 'bold' }]}>
                            {tipoPerfilFormatado}
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Dados Pessoais</Text>
                <Text style={styles.label}>Nome de Exibição:</Text>
                <TextInput style={styles.input} value={nome} onChangeText={setNome} editable={!carregando} />

                <Text style={styles.label}>Telefone de Contato:</Text>
                <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" editable={!carregando} />

                <Text style={styles.sectionTitle}>Acessibilidade</Text>
                <View style={styles.accessibilityCard}>
                    <View style={styles.switchRow}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={styles.switchTitle}>Baixo Estímulo Visual</Text>
                            <Text style={styles.switchDesc}>Reduz cores vibrantes e oculta elementos desnecessários na tela principal.</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={modoBaixoEstimulo ? "#008c45" : "#f4f3f4"}
                            onValueChange={toggleBaixoEstimulo}
                            value={modoBaixoEstimulo}
                        />
                    </View>

                    <View style={[styles.switchRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={styles.switchTitle}>Navegação Ampliada</Text>
                            <Text style={styles.switchDesc}>Aumenta o tamanho dos textos e botões para facilitar o toque e leitura.</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={modoNavegacaoAmpliada ? "#008c45" : "#f4f3f4"}
                            onValueChange={toggleNavegacaoAmpliada}
                            value={modoNavegacaoAmpliada}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar} disabled={carregando}>
                    <Text style={styles.btnText}>Salvar Alterações</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnImprimir} onPress={imprimirPasse} disabled={carregando}>
                    <Ionicons name="print-outline" size={20} color="#008c45" style={{ marginRight: 10 }} />
                    <Text style={styles.btnImprimirText}>Gerar Passe Impresso (PDF)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnDelete} onPress={clicarExcluirConta} disabled={carregando}>
                    <Text style={styles.btnDeleteText}>Excluir Minha Conta</Text>
                </TouchableOpacity>

            </ScrollView>

            {carregando && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.textoCarregando}>Salvando alterações...</Text>
                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    scrollContent: { padding: 20, paddingBottom: 50, flexGrow: 1 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
    btnIconeVoltar: { marginRight: 15 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#008c45' },

    profileSection: { alignItems: 'center', marginBottom: 25 },
    imageContainer: { position: 'relative' },
    profileImage: { width: 130, height: 130, borderRadius: 65, borderWidth: 3, borderColor: '#008c45' },
    profileImagePlaceholder: { width: 130, height: 130, borderRadius: 65, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#008c45' },
    editIconContainer: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#008c45', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },

    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 5 },

    infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2, marginBottom: 10 },
    infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#666', marginBottom: 10 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    infoLabel: { color: '#555', fontSize: 15 },
    infoValue: { color: '#333', fontSize: 15, fontWeight: '500' },

    label: { fontWeight: 'bold', marginBottom: 5, color: '#555', marginLeft: 5 },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 15, fontSize: 16 },

    accessibilityCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2, marginBottom: 25 },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 15, marginBottom: 15 },
    switchTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 3 },
    switchDesc: { fontSize: 12, color: '#777', lineHeight: 16 },

    btnSalvar: { backgroundColor: '#008c45', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10, shadowColor: "#008c45", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    btnImprimir: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 15, borderWidth: 2, borderColor: '#008c45' },
    btnImprimirText: { color: '#008c45', fontWeight: 'bold', fontSize: 16 },
    btnDelete: { marginTop: 35, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: '#dc3545', borderRadius: 12, backgroundColor: '#fff5f5' },
    btnDeleteText: { color: '#dc3545', fontWeight: 'bold', fontSize: 15 },

    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
    textoCarregando: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 15 },
});