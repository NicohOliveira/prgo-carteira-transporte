import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TelaSucesso() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name="checkmark" size={100} color="#fff" />
            </View>

            <Text style={styles.title}>Pagamento confirmado!</Text>
            <Text style={styles.subtitle}>Os novos créditos já foram adicionados à sua conta.</Text>

            <TouchableOpacity
                style={styles.btnVoltar}
                onPress={() => router.replace('/menu')}
            >
                <Text style={styles.btnVoltarText}>Voltar ao Menu Principal</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 20 },
    iconContainer: { width: 150, height: 150, backgroundColor: '#008c45', borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#008c45', marginBottom: 10 },
    subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
    btnVoltar: { width: '100%', backgroundColor: '#008c45', padding: 15, borderRadius: 10, alignItems: 'center' },
    btnVoltarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});