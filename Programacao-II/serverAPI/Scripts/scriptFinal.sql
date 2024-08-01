CREATE DATABASE sistema_gestaoprTeste;





\c sistema_gestaoprTeste

CREATE TABLE if not exists tusers(
    ncpf VARCHAR(15) PRIMARY KEY,
    uname VARCHAR(60),
    passwd VARCHAR(255),
    numtel VARCHAR(15) NULL,
    email VARCHAR(40),
    pativity VARCHAR(50) NULL
);

CREATE TABLE if not exists tevent(
    event_id SERIAL PRIMARY KEY,
    ename VARCHAR(40),
    edate DATE,
    elocal VARCHAR(40),
    hrinit varchar(10),
    hrfim varchar(10),
    edesc VARCHAR(150) NULL
);

CREATE TABLE if not exists tcategoryMed(
    catID SERIAL PRIMARY KEY,
    typeMed VARCHAR(40),
    comment VARCHAR(100) NULL
);

CREATE TABLE if not exists tstateSaude(
    idsaude SERIAL PRIMARY KEY,
    estado VARCHAR(30),
    estado_comment VARCHAR(100) NULL
);


CREATE TABLE if not exists tanimal(
    aid SERIAL PRIMARY KEY,
    araca VARCHAR(30),
    apeso FLOAT,
    acolor VARCHAR(30),
    health_problem VARCHAR(60),
    b_number INTEGER UNIQUE NULL,
    prodstate VARCHAR(40) NULL,
    apelido VARCHAR(40) NULL,
    data_added DATE DEFAULT CURRENT_DATE,
    idState INTEGER NOT NULL REFERENCES tstateSaude(idsaude)
);

CREATE TABLE if not exists tmedicine(
    idmed SERIAL PRIMARY KEY,
    name_med VARCHAR(60),
    dose_kg VARCHAR(40),
    venc_day DATE,
    days_car INTEGER NULL,
    type_car VARCHAR(30) NULL,
    col_effect VARCHAR(50),
    qnt INTEGER,
    catID INTEGER REFERENCES tcategoryMed(catID)
);

CREATE TABLE if not exists tmedused(
    aid INTEGER REFERENCES tanimal(aid),
    idmed INTEGER REFERENCES tmedicine(idmed),
    dataMed DATE,
    dosagem FLOAT,
    PRIMARY KEY (aid, idmed, dataMed)
);

--Adicionar um usuário para login

INSERT INTO tusers (ncpf, uname, passwd, numtel, email, pativity) VALUES ('111.111.111-23', 'Testa Tudo', 'blabla231000', '4388883', 'teste@pmail.com', 'Produção Leitera');

--Dados relacionado aos estados que serao possivel assinalar aos animais
insert into tstateSaude (estado, estado_comment) values ('Saudavel', 'Destinado aos animais que nao possuem problemas de saude');
insert into tstateSaude (estado, estado_comment) values ('Em tratamento', 'Destinado aos animais que estao em processo de tratamento');
insert into tstateSaude (estado, estado_comment) values ('Doente', 'Destinado aos animais que possuem um problema e nao estao em tratamento');
insert into tstateSaude (estado, estado_comment) values ('Desclassificado', 'Destinado aos animais que sofreram desclassificacaoe nao estao mais aptos para producao');

--Dados relacionados a categoria de medicamentos
insert into tcategoryMed (typeMed, comment) values ('Suinos', 'Categoria de medicamento destinada a suinos');
insert into tcategoryMed (typeMed, comment) values ('Equinos', 'Categoria de medicamento destinada a Equinos');
insert into tcategoryMed (typeMed, comment) values ('Bovinos', 'Categoria de medicamento destinada a Bovinos');
insert into tcategoryMed (typeMed, comment) values ('Aves', 'Categoria de medicamento destinada a Aves');
insert into tcategoryMed (typeMed, comment) values ('Qualquer', 'Categoria de medicamento destinada qualquer um');


--Dados da tabela animal 
-- Inserindo 10 registros de animais
INSERT INTO tanimal (araca, apeso, acolor, health_problem, b_number, prodstate, apelido, idState)
VALUES 
('Holstein', 700.5, 'Preto e Branco', 'Nenhum', 1001, 'Produção de leite', 'Bessie', 1),
('Jersey', 450.2, 'Marrom', 'Nenhum', 1002, 'Produção de leite', 'Brownie', 1),
('Angus', 850.7, 'Preto', 'Doença respiratória', 1003, 'Engorda', 'Blackie', 2),
('Hereford', 800.3, 'Vermelho', 'Nenhum', 1004, 'Produção de carne', 'Red', 1),
('Brahman', 900.1, 'Cinza', 'Infecção de pele', 1005, 'Reprodução', 'Gray', 3),
('Friesian', 750.4, 'Preto e Branco', 'Nenhum', 1006, 'Produção de leite', 'Moo', 1),
('Guernsey', 500.9, 'Vermelho e Branco', 'Nenhum', 1007, 'Produção de leite', 'Spot', 1),
('Limousin', 950.6, 'Dourado', 'Nenhum', 1008, 'Produção de carne', 'Goldie', 1),
('Charolais', 1000.3, 'Branco', 'Nenhum', 1009, 'Produção de carne', 'Snow', 1),
('Simmental', 980.5, 'Vermelho e Branco', 'Nenhum', 1010, 'Produção de carne', 'Rosie', 1);


--Adicionado registros na tabela tmedused
INSERT INTO tmedused (aid, idmed, dataMed, dosagem)
VALUES 
    (1, 1, '2024-01-15', 50),
    (2, 1, '2024-01-16', 50),
    (3, 1, '2024-01-17', 50),
    (4, 1, '2024-01-18', 50),
    (5, 1, '2024-01-19', 50),
    (6, 1, '2024-01-20', 50),
    (7, 1, '2024-01-21', 50),
    (8, 1, '2024-01-22', 50),
    (9, 1, '2024-01-23', 50),
    (10, 1, '2024-01-24', 50);


--Adicionado uns eventos para testar 
insert into tevent (ename, edate, elocal, hrinit, hrfim, edesc) values ('Limpar o silo', '07/07/2024', 'Canto esquerdo, lado do galpao', '18:00', '19:00',  'Fazer a limpeza e pagar o valor do servico, tirar foto do recibo');
insert into tevent (ename, edate, elocal, hrinit, hrfim, edesc) values ('Coleta de exames', '09/07/2024', 'Animais do segundo galpao', '05:00', '12:00',  'Coletar os exames dos animais que estao no segundo galpao da propiedade, enviar para o laboratorio');
INSERT INTO tevent (ename, edate, elocal, hrinit, hrfim, edesc)
VALUES ('Limpeza dos Bebedouros', '16/07/2024', 'Área dos Animais', '08:00', '10:00', 'Limpar e desinfectar todos os bebedouros dos animais.');
INSERT INTO tevent (ename, edate, elocal, hrinit, hrfim, edesc)
VALUES ('Auditoria Interna', '17/07/2024', 'Escritório Central', '14:00', '17:00', 'Revisar documentos e procedimentos internos para a auditoria.');
INSERT INTO tevent (ename, edate, elocal, hrinit, hrfim, edesc)
VALUES ('Visita do Veterinário', '13/07/2024', 'Área dos Animais', '10:00', '13:00', 'Consulta de rotina e vacinação dos animais.');

--Adicionar uns valores de teste (São todos simulados não devem ser levados a sério!);
insert into tmedicine (name_med, dose_kg, venc_day, days_car, type_car, col_effect, qnt, catid) values ('ANABOLIC', '3ml/40kg', '2024-07-07', '6', 'Consumo carne', 'nenhum', 8, 1);
INSERT INTO tmedicine (name_med, dose_kg, venc_day, days_car, type_car, col_effect, qnt, catid) VALUES ('ANTI-INFLAMÁTÓRIO', '5ml/50kg', '2025/08/08', '0', 'NENHUM', 'Possivel rigidez', 3, 5);
INSERT INTO tmedicine (name_med, dose_kg, venc_day, days_car, type_car, col_effect, qnt, catid) VALUES ('ANTI-TÓXICO', '8ml/kg', '2024/08/09', '0', 'NENHUM', 'Possivel surgimento de inchacos', 1, 5);