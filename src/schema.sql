CREATE DATABASE Dindin;

DROP TABLE IF EXISTS categorias;
CREATE TABLE categorias(
	id SERIAL PRIMARY KEY,
	descricao TEXT);

DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios(
  id SERIAL PRIMARY KEY,
  nome varchar(40) NOT NULL,
  email varchar(30) NOT NULL,
  senha text NOT NULL
  );
  
DROP TABLE IF EXISTS transacoes;
CREATE TABLE transacoes(
	id SERIAL PRIMARY KEY,
	descricao text,
	valor int NOT NULL,
	data_cadastro timestamp DEFAULT NOW(),
  	categoria_id smallint references categorias(id) NOT NULL,
  	usuario smallint references usuarios(id) NOT NULL,
  	tipo varchar(20) NOT NULL
);

INSERT INTO categorias (descricao) VALUES ('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');
