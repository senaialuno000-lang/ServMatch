
CREATE DATABASE IF NOT EXISTS db_servicos;
USE db_servicos;


-- Tabela: Usuario

CREATE TABLE Usuario (
    idusuario   INT          NOT NULL AUTO_INCREMENT,
    email       VARCHAR(50)  NOT NULL,
    senha       VARCHAR(24)  NOT NULL,
    PRIMARY KEY (idusuario),
    UNIQUE KEY uq_usuario_email (email)
);


-- Tabela: Contratante

CREATE TABLE Contratante (
    idcontratante   INT           NOT NULL AUTO_INCREMENT,
    nome            VARCHAR(400)  NOT NULL,
    telefone        VARCHAR(18),
    CNPJ            INT,
    CEP             INT(8),
    cidade          VARCHAR(45),
    estado          VARCHAR(45),
    bairro          VARCHAR(45),
    numeroCasa      INT,
    imagem          VARCHAR(500),
    sobreMin        VARCHAR(1000),
    usuario_idusuario INT         NOT NULL,
    PRIMARY KEY (idcontratante),
    CONSTRAINT fk_contratante_usuario
        FOREIGN KEY (usuario_idusuario)
        REFERENCES Usuario (idusuario)
        ON DELETE RESTRICT ON UPDATE CASCADE
);


-- Tabela: Contratado

CREATE TABLE Contratado (
    idPrestadorServico                      INT          NOT NULL AUTO_INCREMENT,
    Nome                                    VARCHAR(45)  NOT NULL,
    Telefone                                VARCHAR(18),
    CPF                                     VARCHAR(11),
    CEP                                     VARCHAR(8),
    Estado                                  VARCHAR(30),
    Cidade                                  VARCHAR(40),
    Bairro                                  VARCHAR(45),
    NumeroCasa                              INT,
    imagemContratado                        VARCHAR(45),
    sobreMim                                VARCHAR(500),
    experienciasContratado_idexperiencias   INT,
    formacaoAcademicaContratada_idform      INT,
    usuario_idusuario                       INT          NOT NULL,
    PRIMARY KEY (idPrestadorServico),
    CONSTRAINT fk_contratado_usuario
        FOREIGN KEY (usuario_idusuario)
        REFERENCES Usuario (idusuario)
        ON DELETE RESTRICT ON UPDATE CASCADE
);


-- Tabela: ExperienciasContratado

CREATE TABLE ExperienciasContratado (
    idexperienciasContratado                INT           NOT NULL AUTO_INCREMENT,
    descricaoExperiencia                    VARCHAR(500),
    tituloExperiencias                      VARCHAR(45),
    perfilContratado_idPerfilContratado      INT,
    perfilContratado_Contratado_idPrestado  INT,
    DataIncio                               DATE,
    DataTermino                             DATE,
    PRIMARY KEY (idexperienciasContratado),
    CONSTRAINT fk_exp_contratado
        FOREIGN KEY (perfilContratado_Contratado_idPrestado)
        REFERENCES Contratado (idPrestadorServico)
        ON DELETE CASCADE ON UPDATE CASCADE
);


-- Tabela: CompetenciasContratado

CREATE TABLE CompetenciasContratado (
    idCompetencias                          INT          NOT NULL AUTO_INCREMENT,
    Competencias                            VARCHAR(45),
    PerfilContratado_idPerfilContratado     INT,
    PerfilContratado_Contratado_idPrestado  INT,
    Contratado_idPrestadorServico           INT,
    PRIMARY KEY (idCompetencias),
    CONSTRAINT fk_comp_contratado
        FOREIGN KEY (Contratado_idPrestadorServico)
        REFERENCES Contratado (idPrestadorServico)
        ON DELETE CASCADE ON UPDATE CASCADE
);


-- Tabela: FormacaoAcademicaContratado

CREATE TABLE FormacaoAcademicaContratado (
    idformacaoAcademicaContratada           INT           NOT NULL AUTO_INCREMENT,
    formacaoAcademica                       VARCHAR(500),
    tituloFormacao                          VARCHAR(45),
    perfilContratado_idPerfilContratado     INT,
    perfilContratado_Contratado_idPrestado  INT,
    PRIMARY KEY (idformacaoAcademicaContratada),
    CONSTRAINT fk_form_contratado
        FOREIGN KEY (perfilContratado_Contratado_idPrestado)
        REFERENCES Contratado (idPrestadorServico)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Adicionar FKs de Contratado para Experiencias e Formacao
-- (após as tabelas dependentes serem criadas)

ALTER TABLE Contratado
    ADD CONSTRAINT fk_contratado_experiencias
        FOREIGN KEY (experienciasContratado_idexperiencias)
        REFERENCES ExperienciasContratado (idexperienciasContratado)
        ON DELETE SET NULL ON UPDATE CASCADE,
    ADD CONSTRAINT fk_contratado_formacao
        FOREIGN KEY (formacaoAcademicaContratada_idform)
        REFERENCES FormacaoAcademicaContratado (idformacaoAcademicaContratada)
        ON DELETE SET NULL ON UPDATE CASCADE;


-- Tabela: Vagas

CREATE TABLE Vagas (
    idvagasContratante      INT             NOT NULL AUTO_INCREMENT,
    tituloVaga              VARCHAR(45),
    modalidadeVaga          VARCHAR(45),
    cargoVaga               VARCHAR(45),
    localidadeVaga          VARCHAR(45),
    tipoTrabalho            VARCHAR(45),
    salario                 DECIMAL(5,2),
    descricaoVaga           VARCHAR(1000),
    statusVaga              ENUM('aberta','fechada','pausada') DEFAULT 'aberta',
    contratante_idcontratante INT           NOT NULL,
    PRIMARY KEY (idvagasContratante),
    CONSTRAINT fk_vagas_contratante
        FOREIGN KEY (contratante_idcontratante)
        REFERENCES Contratante (idcontratante)
        ON DELETE CASCADE ON UPDATE CASCADE
);


-- Tabela: Candidatura  (tabela associativa Contratado <-> Vagas)

CREATE TABLE Candidatura (
    Contratado_idPrestadorServico       INT  NOT NULL,
    vagasContratante_idvagasContratante INT  NOT NULL,
    PRIMARY KEY (Contratado_idPrestadorServico, vagasContratante_idvagasContratante),
    CONSTRAINT fk_candidatura_contratado
        FOREIGN KEY (Contratado_idPrestadorServico)
        REFERENCES Contratado (idPrestadorServico)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_candidatura_vagas
        FOREIGN KEY (vagasContratante_idvagasContratante)
        REFERENCES Vagas (idvagasContratante)
        ON DELETE CASCADE ON UPDATE CASCADE
);
