import { Stack } from "expo-router";
import { GerenciadorUsuarioProvider } from "../controls/GerenciadorUsuario";
import { AutenticadorProvider } from "../controls/Autenticador";
// Importando os seus novos gerenciadores financeiros
import { GerenciadorCarteirinhaProvider } from "../controls/GerenciadorCarteirinha";
import { GerenciadorPagamentoProvider } from "../controls/GerenciadorPagamento";

export default function Layout() {
    return (
        <GerenciadorUsuarioProvider>
            <AutenticadorProvider>
                
                <GerenciadorCarteirinhaProvider>
                    <GerenciadorPagamentoProvider>
                        <Stack screenOptions={{ headerShown: false }} />
                    </GerenciadorPagamentoProvider>
                </GerenciadorCarteirinhaProvider>
            </AutenticadorProvider>
        </GerenciadorUsuarioProvider>
    );
}