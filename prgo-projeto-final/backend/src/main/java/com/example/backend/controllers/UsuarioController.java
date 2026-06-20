package com.example.backend.controllers;

import com.example.backend.entities.Usuario;
import com.example.backend.entities.Carteirinha;
import com.example.backend.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
                    usuario.setIsento(usuarioAtualizado.getIsento());

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
    public ResponseEntity<Usuario> recarregar(@PathVariable Long id, @RequestBody RecargaRequest request) {
        return repository.findById(id)
                .map(usuario -> {
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
}

