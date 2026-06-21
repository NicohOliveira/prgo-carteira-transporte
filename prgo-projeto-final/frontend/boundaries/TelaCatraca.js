import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { API_URL } from '../constants/api';
import { Ionicons } from '@expo/vector-icons';

export default function TelaCatraca() {
    const router = useRouter();
    const [permissao, solicitarPermissao] = useCameraPermissions();
    const [escaneado, setEscaneado] = useState(false);

    const [mensagem, setMensagem] = useState('Aponte para o QR Code do passageiro');
    const [corFundo, setCorFundo] = useState('#333');

    if (!permissao) {
        return <View />;
    }

    if (!permissao.granted) {
        return (
            <View style={styles.containerAviso}>
                <Text style={styles.textoAviso}>A catraca precisa da permissão da câmera.</Text>
                <TouchableOpacity style={styles.btnPermissao} onPress={solicitarPermissao}>
                    <Text style={styles.btnPermissaoTexto}>Conceder Permissão</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const lidarComQrCode = async ({ type, data }) => {
        setEscaneado(true);
        setMensagem('A validar...');
        setCorFundo('#f39c12');

        try {
            const resposta = await fetch(`${API_URL}/usuarios/catraca/validar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                    'Bypass-Tunnel-Reminder': 'true'
                },
                body: data
            });

            const textoDaCatraca = await resposta.text();

            if (resposta.ok) {
                setCorFundo('#008c45');
                setMensagem(textoDaCatraca);
            } else {
                setCorFundo('#d9534f');
                setMensagem(textoDaCatraca);
            }
        } catch (erro) {
            setCorFundo('#d9534f');
            setMensagem('Erro de conexão com o servidor.');
        }

        setTimeout(() => {
            setEscaneado(false);
            setCorFundo('#333');
            setMensagem('Aponte para o QR Code do passageiro');
        }, 3500);
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { backgroundColor: corFundo }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Validador (Motorista)</Text>
            </View>

            <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={escaneado ? undefined : lidarComQrCode}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            >
                <View style={styles.overlay}>
                    <View style={styles.scanArea} />
                </View>
            </CameraView>

            <View style={[styles.footer, { backgroundColor: corFundo }]}>
                <Text style={styles.footerText}>{mensagem}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    containerAviso: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    textoAviso: { fontSize: 18, textAlign: 'center', marginBottom: 20 },
    btnPermissao: { backgroundColor: '#008c45', padding: 15, borderRadius: 10 },
    btnPermissaoTexto: { color: 'white', fontWeight: 'bold' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50 },
    backButton: { marginRight: 15 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
    camera: { flex: 1 },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    scanArea: { width: 250, height: 250, borderWidth: 2, borderColor: '#008c45', backgroundColor: 'transparent', borderRadius: 20 },
    footer: { padding: 30, alignItems: 'center', minHeight: 100, justifyContent: 'center' },
    footerText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }
});