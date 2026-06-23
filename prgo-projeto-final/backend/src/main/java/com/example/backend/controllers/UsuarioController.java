package com.example.backend.controllers;

import com.example.backend.entities.Usuario;
import com.example.backend.entities.Carteirinha;
import com.example.backend.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @PostMapping
    public ResponseEntity<Usuario> cadastrar(@RequestBody Usuario usuario) {
        Carteirinha novaCarteirinha = new Carteirinha();
        novaCarteirinha.setSaldo(0.0);
        novaCarteirinha.setCodigoQr("QR_" + usuario.getCpf());
        novaCarteirinha.setUsuario(usuario);
        usuario.setCarteirinha(novaCarteirinha);

        Usuario novoUsuario = repository.save(usuario);
        return ResponseEntity.ok(novoUsuario);
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        List<Usuario> usuarios = repository.findAll();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Usuario> buscarPorCpf(@PathVariable String cpf) {
        return repository.findByCpf(cpf)
                .map(usuario -> ResponseEntity.ok(usuario))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(usuario -> ResponseEntity.ok(usuario))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario usuarioAtualizado) {
        return repository.findById(id)
                .map(usuario -> {
                    usuario.setNome(usuarioAtualizado.getNome());
                    usuario.setIdade(usuarioAtualizado.getIdade());
                    usuario.setCpf(usuarioAtualizado.getCpf());
                    usuario.setTelefone(usuarioAtualizado.getTelefone());
                    usuario.setLogin(usuarioAtualizado.getLogin());
                    usuario.setSenha(usuarioAtualizado.getSenha());
                    if (usuarioAtualizado.getIsento() != null) {
                        usuario.setIsento(usuarioAtualizado.getIsento());
                    }
                    usuario.setFotoPerfil(usuarioAtualizado.getFotoPerfil());

                    Usuario atualizado = repository.save(usuario);
                    return ResponseEntity.ok(atualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Rota para deletar um usuário (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest dadosLogin) {
        return repository.findByLogin(dadosLogin.getLogin())
                .filter(usuario -> usuario.getSenha().equals(dadosLogin.getSenha()))
                .map(usuario -> ResponseEntity.ok(usuario)) // Credenciais corretas: retorna o usuário e Status 200
                .orElse(ResponseEntity.status(401).build()); // Credenciais erradas ou usuário não existe: Status 401 Unauthorized
    }

    public static class LoginRequest {
        private String login;
        private String senha;
        public String getLogin() { return login; }
        public void setLogin(String login) { this.login = login; }

        public String getSenha() { return senha; }
        public void setSenha(String senha) { this.senha = senha; }
    }

    @PatchMapping("/{id}/recarga")
    public ResponseEntity<?> recarregar(@PathVariable Long id, @RequestBody RecargaRequest request) {
        return repository.findById(id)
                .map(usuario -> {
                    if (usuario.getIsento() != null && usuario.getIsento()) {
                        return ResponseEntity.status(400)
                                .body("Operação bloqueada: Usuários isentos possuem passe livre e não recarregam saldo.");
                    }
                    if (usuario.getCarteirinha() == null) {
                        Carteirinha novaCarteirinha = new Carteirinha();
                        novaCarteirinha.setSaldo(0.0);
                        novaCarteirinha.setCodigoQr("QR_" + usuario.getCpf());
                        novaCarteirinha.setUsuario(usuario);
                        usuario.setCarteirinha(novaCarteirinha);
                    }
                    double saldoAtual = usuario.getCarteirinha().getSaldo();
                    usuario.getCarteirinha().setSaldo(saldoAtual + request.getValor());

                    Usuario atualizado = repository.save(usuario);
                    return ResponseEntity.ok(atualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    public static class RecargaRequest {
        private Double valor;
        public Double getValor() { return valor; }
        public void setValor(Double valor) { this.valor = valor; }
    }

    @PostMapping("/catraca/validar")
    public ResponseEntity<String> validarCatraca(@RequestBody String codigoQrLido) {
        String codigoLimpo = codigoQrLido.replace("\"", "").trim();
        List<Usuario> todosUsuarios = repository.findAll();

        for (Usuario u : todosUsuarios) {
            if (u.getCarteirinha() != null && codigoLimpo.equals(u.getCarteirinha().getCodigoQr())) {
                if (u.getIsento() != null && u.getIsento()) {
                    return ResponseEntity.ok("PASSAGEM LIBERADA (Isento)");
                }
                double saldoAtual = u.getCarteirinha().getSaldo();
                double valorPassagem = 5.00;

                if (saldoAtual >= valorPassagem) {
                    u.getCarteirinha().setSaldo(saldoAtual - valorPassagem);
                    repository.save(u);
                    
                    // NOTIFICAÇÕES: Verifica se o saldo caiu abaixo do limite configurado
                    double novoSaldo = u.getCarteirinha().getSaldo();
                    if (u.getLimiteNotificacao() != null && novoSaldo <= u.getLimiteNotificacao()) {
                        System.out.println("==================================================");
                        System.out.println("ALERTA: O saldo de " + u.getNome() + " caiu para R$ " + novoSaldo);
                        System.out.println("Disparando Push Notification para o aparelho...");
                        System.out.println("==================================================");
                        
                        // NOTIFICAÇÕES: Dispara o push notification para o celular usando o Token salvo
                        enviarNotificacaoPush(u.getExpoPushToken(), "Saldo Baixo", 
                            String.format("Seu saldo atingiu o limite configurado. Saldo atual: R$ %.2f", novoSaldo));

                        // Adiciona tag para o frontend simular o push
                        return ResponseEntity.ok("PASSAGEM LIBERADA (Saldo restante: R$ " + novoSaldo + ") [LIMITE_ATINGIDO]");
                    }
                    
                    return ResponseEntity.ok("PASSAGEM LIBERADA (Saldo restante: R$ " + novoSaldo + ")");
                } else {
                    return ResponseEntity.status(400).body("SALDO INSUFICIENTE");
                }
            }
        }

        return ResponseEntity.status(404).body("CARTEIRINHA NÃO ENCONTRADA");
    }

    // NOTIFICAÇÕES: Rota para o celular enviar e salvar o Push Token logo após o login
    @PatchMapping("/{id}/push-token")
    public ResponseEntity<?> atualizarPushToken(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return repository.findById(id)
                .map(usuario -> {
                    usuario.setExpoPushToken(payload.get("token"));
                    repository.save(usuario);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // NOTIFICAÇÕES: Rota para a tela de configurações salvar o Limite de Saldo desejado
    @PatchMapping("/{id}/limite-notificacao")
    public ResponseEntity<?> atualizarLimiteNotificacao(@PathVariable Long id, @RequestBody Map<String, Double> payload) {
        return repository.findById(id)
                .map(usuario -> {
                    usuario.setLimiteNotificacao(payload.get("limite"));
                    repository.save(usuario);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // NOTIFICAÇÕES: Função interna que faz a requisição HTTP real para a API do Expo enviar o Push
    private void enviarNotificacaoPush(String token, String titulo, String mensagem) {
        if (token == null || token.isEmpty()) return;

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = new HashMap<>();
            body.put("to", token);
            body.put("title", titulo);
            body.put("body", mensagem);

            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
            restTemplate.postForObject("https://exp.host/--/api/v2/push/send", request, String.class);
        } catch (Exception e) {
            System.err.println("Erro ao enviar notificação push: " + e.getMessage());
        }
    }

    @PostMapping("/{idResponsavel}/dependentes")
    public ResponseEntity<?> vincularDependente(@PathVariable Long idResponsavel, @RequestBody VinculoDependenteRequest request) {
        if (request.getCpfDependente() == null || request.getCpfDependente().trim().isEmpty()) {
            return ResponseEntity.status(400).body("O CPF do dependente é obrigatório.");
        }

        return repository.findById(idResponsavel)
                .map(responsavel -> {
                    
                    if (responsavel.getCpf().equals(request.getCpfDependente())) {
                        return ResponseEntity.status(400).body("Erro: Você não pode ser seu próprio dependente.");
                    }

                    return repository.findByCpf(request.getCpfDependente())
                            .map(dependente -> {
                                
                                if (responsavel.getDependentes().contains(dependente)) {
                                    return ResponseEntity.status(400).body("Este dependente já está vinculado à sua conta.");
                                }

                                // Nota: Como é um relacionamento bidirecional, adicionamos nos dois lados para garantir a consistência em memória
                                responsavel.getDependentes().add(dependente);
                                dependente.getResponsaveis().add(responsavel);

                                repository.save(responsavel);

                                return ResponseEntity.ok().body("Dependente vinculado com sucesso!");
                            })
                            .orElse(ResponseEntity.status(404).body("Dependente não cadastrado no sistema. Verifique o CPF."));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public static class VinculoDependenteRequest {
        private String cpfDependente;

        public String getCpfDependente() { return cpfDependente; }
        public void setCpfDependente(String cpfDependente) { this.cpfDependente = cpfDependente; }
    }
}

