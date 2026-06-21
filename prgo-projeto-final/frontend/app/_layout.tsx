import { Stack } from "expo-router";
import { GerenciadorUsuarioProvider } from "../controls/GerenciadorUsuario";
import { AutenticadorProvider } from "../controls/Autenticador";
import { GerenciadorCarteirinhaProvider } from "../controls/GerenciadorCarteirinha";
import { GerenciadorPagamentoProvider } from "../controls/GerenciadorPagamento";

import { GerenciadorAcessibilidadeProvider } from "../controls/GerenciadorAcessibilidade";

export default function Layout() {
    return (
        <GerenciadorUsuarioProvider>
            <AutenticadorProvider>
                <GerenciadorCarteirinhaProvider>
                    <GerenciadorPagamentoProvider>
                        <GerenciadorAcessibilidadeProvider>

                            <Stack screenOptions={{ headerShown: false }} />

                        </GerenciadorAcessibilidadeProvider>
                    </GerenciadorPagamentoProvider>
                </GerenciadorCarteirinhaProvider>
            </AutenticadorProvider>
        </GerenciadorUsuarioProvider>
    );
}