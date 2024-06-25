CREATE TABLE tusers (
    ncpf VARCHAR(15) PRIMARY KEY,
    uname VARCHAR(60) NOT NULL,
    passwd VARCHAR(255) NOT NULL,
    numtel VARCHAR(15),
    email VARCHAR(40) NOT NULL,
    pativity VARCHAR(50)
);
--Tabelas para guardar os users

CREATE TABLE tevent (
    event_id SERIAL PRIMARY KEY,
    ename VARCHAR(40) NOT NULL,
    edate DATE NOT NULL,
    elocal VARCHAR(40) NOT NULL,
    edesc VARCHAR(60)
);


CREATE TABLE tanimal (
    aid SERIAL PRIMARY KEY,
    araca VARCHAR(30) NOT NULL,
    apeso FLOAT NOT NULL,
    acolor VARCHAR(30),
    health_problem VARCHAR(60) NOT NULL,
    b_number INTEGER UNIQUE,
    prodstate VARCHAR(40) NOT NULL,
    apelido VARCHAR(40),
    data_added DATE NOT NULL
);

CREATE TABLE tmedicine (
    idmed SERIAL PRIMARY KEY,
    name_med VARCHAR(60) NOT NULL,
    dose_kg INTEGER NOT NULL,
    venc_day DATE NOT NULL,
    days_car INTEGER,
    type_car VARCHAR(30),
    col_effect VARCHAR(50) NOT NULL,
    qnt INTEGER NOT NULL
);

CREATE TABLE tmedused (
    aid INTEGER REFERENCES tanimal(aid),
    idmed INTEGER REFERENCES tmedicine(idmed),
    dataMed DATE NOT NULL,
    dosagem FLOAT NOT NULL,
    PRIMARY KEY (aid, idmed)
);

CREATE TABLE tstateSaude (
    idsaude SERIAL PRIMARY KEY,
    estado VARCHAR(30) NOT NULL,
    estado_comment VARCHAR(60),
    aid INTEGER REFERENCES tanimal(aid)
);

CREATE TABLE tcategoryMed (
    catID SERIAL PRIMARY KEY,
    typeMed VARCHAR(40) NOT NULL,
    comment VARCHAR(60),
    idMed INTEGER REFERENCES tmedicine(idmed)
);
