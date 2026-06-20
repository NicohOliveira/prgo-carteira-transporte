import * as SQLite from 'expo-sqlite';

// Abre ou cria o banco de dados local no celular
const db = SQLite.openDatabaseSync('prgo.db');

export const inicializarBanco = () => {
    try {
        // Criação das tabelas baseadas nas suas Entidades
        // INTEGER 0 ou 1 substitui os booleanos (true/false) no SQLite
        db.execSync(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        idade INTEGER,
        cpf TEXT UNIQUE NOT NULL,
        telefone TEXT,
        login TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        isento INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS carteirinhas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cpf_usuario TEXT UNIQUE NOT NULL,
        saldo REAL DEFAULT 0.0,
        codigoQr TEXT,
        FOREIGN KEY (cpf_usuario) REFERENCES usuarios (cpf)
      );
    `);
        console.log("Log: Banco de dados e tabelas criados/verificados com sucesso!");
    } catch (error) {
        console.error("Erro ao inicializar o banco:", error);
    }
};

export default db;