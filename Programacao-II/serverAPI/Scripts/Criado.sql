CREATE ROLE "acessaSistema" WITH
	LOGIN
	NOSUPERUSER
	CREATEDB
	NOCREATEROLE
	INHERIT
	NOREPLICATION
	CONNECTION LIMIT -1
	PASSWORD 'xxxxxx';
COMMENT ON ROLE "acessaSistema" IS 'Usuario para acessar a database do sistema';

CREATE DATABASE sistema_gestaopr
    WITH
    OWNER = "acessaSistema"
    ENCODING = 'UTF8'
    LOCALE_PROVIDER = 'libc'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

COMMENT ON DATABASE sistema_gestaopr
    IS 'Database do projeto integrador';