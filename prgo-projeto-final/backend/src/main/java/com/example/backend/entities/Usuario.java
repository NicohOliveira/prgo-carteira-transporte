package com.example.backend.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private Integer idade;

    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @Column(length = 20)
    private String telefone;

    @Column(nullable = false, unique = true)
    private String login;

    @Column(nullable = false)
    private String senha;

    @Column(columnDefinition = "boolean default false")
    private Boolean isento = false;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private Carteirinha carteirinha;

    @Column(columnDefinition = "TEXT")
    private String fotoPerfil;

    @Column(columnDefinition = "boolean default false")
    private Boolean admin = false;

    @Column(columnDefinition = "TEXT")
    // NOTIFICAÇÕES: Token único do aparelho Expo para enviar mensagens push
    private String expoPushToken;

    @Column(columnDefinition = "DOUBLE PRECISION")
    // NOTIFICAÇÕES: Limite de saldo configurado pelo usuário para disparar o aviso
    private Double limiteNotificacao;

    @ManyToMany
    @JoinTable(
        name = "usuario_responsavel_dependente", 
        joinColumns = @JoinColumn(name = "dependente_id"), 
        inverseJoinColumns = @JoinColumn(name = "responsavel_id") 
    )
    @JsonIgnore
    private List<Usuario> responsaveis = new ArrayList<>();

    @ManyToMany(mappedBy = "responsaveis") 
    private List<Usuario> dependentes = new ArrayList<>();

    public Usuario() {
    }

    public Usuario(String nome, Integer idade, String cpf, String telefone, String login, String senha, Boolean isento) {
        this.nome = nome;
        this.idade = idade;
        this.cpf = cpf;
        this.telefone = telefone;
        this.login = login;
        this.senha = senha;
        this.isento = isento;
    }

    // --- GETTERS E SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Integer getIdade() { return idade; }
    public void setIdade(Integer idade) { this.idade = idade; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public Boolean getIsento() { return isento; }
    public void setIsento(Boolean isento) { this.isento = isento; }


    public Carteirinha getCarteirinha() { return carteirinha; }
    public void setCarteirinha(Carteirinha carteirinha) { this.carteirinha = carteirinha; }
    public String getFotoPerfil() { return fotoPerfil; }
    public void setFotoPerfil(String fotoPerfil) { this.fotoPerfil = fotoPerfil; }

    public Boolean getAdmin() { return admin; }
    public void setAdmin(Boolean admin) { this.admin = admin; }

    public String getExpoPushToken() { return expoPushToken; }
    public void setExpoPushToken(String expoPushToken) { this.expoPushToken = expoPushToken; }

    public Double getLimiteNotificacao() { return limiteNotificacao; }
    public void setLimiteNotificacao(Double limiteNotificacao) { this.limiteNotificacao = limiteNotificacao; }

    public List<Usuario> getResponsaveis() { return responsaveis; }
    public void setResponsaveis(List<Usuario> responsaveis) { this.responsaveis = responsaveis; }

    public List<Usuario> getDependentes() { return dependentes; }
    public void setDependentes(List<Usuario> dependentes) { this.dependentes = dependentes; }

}
