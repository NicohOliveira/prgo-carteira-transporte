import React, { useEffect} from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { usePagamento } from '../controls/GerenciadorPagamento';
import { useUsuario } from '../controls/GerenciadorUsuario';

export default function TelaHistoricoPagamentos() {
    // Consumindo a variável "historico" exportada pelo seu Control autêntico
    const { historico, buscarHistorico, carregandoHistorico } = usePagamento();
    const { usuarioLogado } = useUsuario();

    useEffect(() => {
        if (usuarioLogado && usuarioLogado.id) {
            buscarHistorico(usuarioLogado.id);
        }
    }, []);
    // Formatando a data ISO (ex: 2026-06-21T...) para um formato legível
    const formatarData = (isoString) => {
        const data = new Date(isoString);
        return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const renderItem = ({ item }) => {
        const isEntrada = item.valor > 0;


        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.metodo}>
                        {isEntrada ? `Recarga via ${item.metodo}` : `Uso na ${item.metodo}`}
                    </Text>
                    <Text style={styles.data}>{formatarData(item.dataHora)}</Text>
                </View>

                <View style={styles.cardFooter}>
                    <Text style={[
                        styles.status,
                        { color: item.status === 'Confirmado' ? '#2ecc71' : item.status === 'Rejeitado' ? '#e74c3c' : '#f39c12' }
                    ]}>
                        {item.status}
                    </Text>
                    <Text style={[
                        styles.valor,
                        { color: isEntrada ? '#2ecc71' : '#e74c3c' } // Verde para entrada, Vermelho para saída
                    ]}>
                        {isEntrada ? '+' : ''} R$ {item.valor.toFixed(2).replace('.', ',')}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Histórico de Recargas</Text>

            <FlatList
                data={historico}
                keyExtractor={(item, index) => (item._idPagamento || item.id || index).toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Nenhum pagamento registrado.</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 40, paddingHorizontal: 20 },
    titulo: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },
    listContainer: { paddingBottom: 20 },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 12, elevation: 2 },
    cardHeader: { flexDirection: 'column', marginBottom: 10 },
    metodo: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    data: { fontSize: 12, color: '#7f8c8d', marginTop: 2 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    status: { fontSize: 14, fontWeight: '600' },
    valor: { fontSize: 18, fontWeight: 'bold', color: '#2ecc71' },
    emptyText: { textAlign: 'center', color: '#7f8c8d', marginTop: 20, fontSize: 16 }
});