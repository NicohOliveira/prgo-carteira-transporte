import { Stack } from "expo-router";
import { GerenciadorUsuarioProvider } from "../controls/GerenciadorUsuario";
import { AutenticadorProvider } from "../controls/Autenticador";

export default function Layout() {
  return (
    <GerenciadorUsuarioProvider>
      <AutenticadorProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AutenticadorProvider>
    </GerenciadorUsuarioProvider>
  );
}