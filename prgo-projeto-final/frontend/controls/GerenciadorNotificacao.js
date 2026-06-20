import Usuario from '../entities/Usuario';
import PushNotification from "react-native-push-notification";

function dispararAviso(mensagem){
    PushNotification.localNotification({
        title: "Aviso!",
        message: mensagem,
    });
}

function verificarLimite(idUsuario, saldoAtual){
    valor_limite = usuario.obterLimiteConfigurado()

    if (saldoAtual <= valor_limite) {
        dispararAviso("Saldo abaixo do limite!")
    }
}

function atualizarPreferencia() {
    PushNotification.localNotification({
        title: "Limite aceito!",
        message: "Novo limite atualizado com sucesso!",
    });
}