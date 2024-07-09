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
    edesc VARCHAR(100) NULL
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

--Adicionado uns eventos para testar 
insert into tevent (ename, edate, elocal, hrinit, hrfim, edesc) values ('Limpar o silo', '07/07/2024', 'Canto esquerdo, lado do galpao', '18:00', '19:00',  'Fazer a limpeza e pagar o valor do servico, tirar foto do recibo');
insert into tevent (ename, edate, elocal, hrinit, hrfim, edesc) values ('Coleta de exames', '09/07/2024', 'Animais do segundo galpao', '05:00', '12:00',  'Coletar os exames dos animais que estao no segundo galpao da propiedade, enviar para o laboratorio');
INSERT INTO tevent (ename, edate, elocal, hrinit, hrfim, edesc)
VALUES ('Limpeza dos Bebedouros', '16/07/2024', 'Área dos Animais', '08:00', '10:00', 'Limpar e desinfectar todos os bebedouros dos animais.');
INSERT INTO tevent (ename, edate, elocal, hrinit, hrfim, edesc)
VALUES ('Auditoria Interna', '17/07/2024', 'Escritório Central', '14:00', '17:00', 'Revisar documentos e procedimentos internos para a auditoria.');
INSERT INTO tevent (ename, edate, elocal, hrinit, hrfim, edesc)
VALUES ('Visita do Veterinário', '13/07/2024', 'Área dos Animais', '10:00', '13:00', 'Consulta de rotina e vacinação dos animais.');


insert into tmedicine (name_med, dose_kg, venc_day, days_car, type_car, col_effect, qnt, catid) values ('ANABOLIC', 12, '2024-07-07', '0', 'Consumo carne', 'nenhum', 8, 1);



drop table tcategorymed;
drop table tstatesaude;
drop table tmedused;
drop table tmedicine;
drop table tanimal;
drop table tusers;
drop table tevent;