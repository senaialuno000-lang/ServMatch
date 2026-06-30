CREATE DATABASE IF NOT EXISTS servmatch;
USE servmatch;
 
 
-- Tabela: Usuario
 
CREATE TABLE Usuario (
    idusuario   INT          NOT NULL AUTO_INCREMENT,
    nome        VARCHAR(400)  NOT NULL,
    email       VARCHAR(50)  NOT NULL UNIQUE,
    senha       VARCHAR(255)  NOT NULL,
    celular		VARCHAR(24) NOT NULL,
    perfil      ENUM('Contratante','Candidato') NOT NULL,
    PRIMARY KEY (idusuario),
    UNIQUE KEY uq_usuario_email (email)
);
 
 
 
SELECT * FROM Usuario;
INSERT INTO Usuario VALUES(null,"usu","usu@gmail.com","$2a$10$zX55t4a/.51jAsJ8iUakKe.o3kdNflMc2lxNwLuFixTje5y4HUOJi","234234", 'Contratante');
INSERT INTO Usuario VALUES(null,"usua","usua@gmail.com","$2a$10$zX55t4a/.51jAsJ8iUakKe.o3kdNflMc2lxNwLuFixTje5y4HUOJi","234234", 'Candidato');
insert into Contratante values(1,null,null,null,null,null,null,null,null,1);

insert into Vagas values(null, "vaga 5", "Presencial", "asdas", "Vitória", "sadasd", 500.0, "Trabalho em Vitória de programação", "aberta", 1);
select tituloVaga, localidadeVaga, salario, descricaoVaga  from Vagas;


 
 
-- Tabela: Contratante
 
CREATE TABLE Contratante (
    idcontratante   INT           NOT NULL AUTO_INCREMENT,
    CNPJ            INT UNIQUE,
    CEP             INT(8),
    cidade          VARCHAR(45),
    estado          VARCHAR(45),
    bairro          VARCHAR(45),
    numeroCasa      INT UNIQUE,
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
    CPF                                     VARCHAR(11) UNIQUE,
    CEP                                     VARCHAR(8),
    Estado                                  VARCHAR(30),
    Cidade                                  VARCHAR(40),
    Bairro                                  VARCHAR(45),
    NumeroCasa                              INT UNIQUE,
    imagemContratado                        VARCHAR(45),
    sobreMim                                VARCHAR(500),
    experienciasContratado_idexperiencias   INT,
    formacaoAcademicaContratada_idform      INT,
    usuario_idusuario                       INT NOT NULL,
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
 
 
-- =====================================================================
-- ALTERAÇÃO: Tabela de competências centralizada
-- Substitui a antiga "CompetenciasContratado" (que guardava texto
-- repetido em cada linha) por uma tabela única de competências,
-- compartilhada entre Contratado e Vagas via tabelas associativas N:N.
-- =====================================================================
 
-- Tabela: Competencia (catálogo único de competências)
 
CREATE TABLE Competencia (
    idcompetencia   INT          NOT NULL AUTO_INCREMENT,
    nome            VARCHAR(45)  NOT NULL UNIQUE,
    PRIMARY KEY (idcompetencia)
);
 
 
-- Tabela: ContratadoCompetencia (associativa Contratado <-> Competencia)
 
CREATE TABLE ContratadoCompetencia (
    Contratado_idPrestadorServico INT NOT NULL,
    Competencia_idcompetencia     INT NOT NULL,
    PRIMARY KEY (Contratado_idPrestadorServico, Competencia_idcompetencia),
    CONSTRAINT fk_contcomp_contratado
        FOREIGN KEY (Contratado_idPrestadorServico)
        REFERENCES Contratado (idPrestadorServico)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_contcomp_competencia
        FOREIGN KEY (Competencia_idcompetencia)
        REFERENCES Competencia (idcompetencia)
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
-- ALTERAÇÃO: salario ajustado de DECIMAL(5,2) para DECIMAL(10,2),
-- pois DECIMAL(5,2) só comportava valores até 999.99.
 
CREATE TABLE Vagas (
    idvagasContratante      INT             NOT NULL AUTO_INCREMENT,
    tituloVaga              VARCHAR(45),
    cargoVaga               VARCHAR(45),
    modalidadeVaga          VARCHAR(45),
    localidadeVaga          VARCHAR(45),
    tipoTrabalho            VARCHAR(45),
    salario                 DECIMAL(10,2),
    descricaoVaga           VARCHAR(1000),
    statusVaga              ENUM('aberta','fechada','pausada') DEFAULT 'aberta',
    contratante_idcontratante INT           NOT NULL,
    PRIMARY KEY (idvagasContratante),
    CONSTRAINT fk_vagas_contratante
        FOREIGN KEY (contratante_idcontratante)
        REFERENCES Contratante (idcontratante)
        ON DELETE CASCADE ON UPDATE CASCADE
);
 
 
-- =====================================================================
-- ALTERAÇÃO: Tabela associativa Vagas <-> Competencia
-- Mesma lógica da ContratadoCompetencia: reaproveita o catálogo
-- único da tabela Competencia, evitando duplicar texto.
-- =====================================================================
 
CREATE TABLE VagaCompetencia (
    Vagas_idvagasContratante  INT NOT NULL,
    Competencia_idcompetencia INT NOT NULL,
    PRIMARY KEY (Vagas_idvagasContratante, Competencia_idcompetencia),
    CONSTRAINT fk_vagacomp_vaga
        FOREIGN KEY (Vagas_idvagasContratante)
        REFERENCES Vagas (idvagasContratante)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_vagacomp_competencia
        FOREIGN KEY (Competencia_idcompetencia)
        REFERENCES Competencia (idcompetencia)
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