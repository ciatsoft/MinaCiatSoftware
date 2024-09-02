CREATE TABLE Trabajador
(
	Id		BIGINT IDENTITY(1,1) PRIMARY KEY NOT NULL,
	Nombre		NVARCHAR(250) NOT NULL,
	Telefono	NVARCHAR(250),
	Email		NVARCHAR(250),
	FechaContratacion	DATETIME NOT NULL,
	Seguro		NVARCHAR(250),
	Turno		NVARCHAR(150),

	[Estatus] [bit] NULL,
	[CreatedBy] [nvarchar](150) NOT NULL,
	[CreatedDt] [datetime] NOT NULL,
	[UpdatedBy] [nvarchar](150) NULL,
	[UpdatedDt] [datetime] NULL
)
GO

CREATE TABLE AreaTrabajo
(
	Id		BIGINT IDENTITY(1,1) PRIMARY KEY NOT NULL,
	Nombre	NVARCHAR(150)NOT NULL,
	Descripcion	NVARCHAR(250),
	[Estatus] [bit] NULL,
	[CreatedBy] [nvarchar](150) NOT NULL,
	[CreatedDt] [datetime] NOT NULL,
	[UpdatedBy] [nvarchar](150) NULL,
	[UpdatedDt] [datetime] NULL
)
GO

CREATE TABLE Salario
(
	Id		BIGINT IDENTITY(1,1) PRIMARY KEY NOT NULL,
	FechaInicio	datetime NOT NULL,
	FechaFinal	DATETIME NOT NULL,
	Monto		DECIMAL(12,2) NOT NULL,
	EsSalarioActual	BIT NOT NULL,
	TrabajadorId		BIGINT,
	[Estatus] [bit] NULL,
	[CreatedBy] [nvarchar](150) NOT NULL,
	[CreatedDt] [datetime] NOT NULL,
	[UpdatedBy] [nvarchar](150) NULL,
	[UpdatedDt] [datetime] NULL
)
GO

ALTER TABLE Salario
	ADD CONSTRAINT FK_Trabajador_Salario
	FOREIGN KEY (TrabajadorId)
	REFERENCES Trabajador (Id)
GO

CREATE TABLE Horarios
(
	Id		BIGINT IDENTITY(1,1) PRIMARY KEY NOT NULL,
	HolaEntrada	datetime NOT NULL,
	HoraSalida	DATETIME NOT NULL,
	EsHorarioActualActual	BIT NOT NULL,
	DiaTrabajo		NVARCHAR(50),
	TrabajadorId		BIGINT,
	[Estatus] [bit] NULL,
	[CreatedBy] [nvarchar](150) NOT NULL,
	[CreatedDt] [datetime] NOT NULL,
	[UpdatedBy] [nvarchar](150) NULL,
	[UpdatedDt] [datetime] NULL
)
GO

ALTER TABLE Horarios
	ADD CONSTRAINT FK_Trabajador_Horarios
	FOREIGN KEY (TrabajadorId)
	REFERENCES Trabajador(Id)
GO

CREATE TABLE Falta
(
	Id		BIGINT IDENTITY(1,1) PRIMARY KEY NOT NULL,
	FechaFalta	datetime NOT NULL,
	Comentarios	NVARCHAR(250),
	EsRetardo	BIT,
	TrabajadorId		BIGINT,
	[Estatus] [bit] NULL,
	[CreatedBy] [nvarchar](150) NOT NULL,
	[CreatedDt] [datetime] NOT NULL,
	[UpdatedBy] [nvarchar](150) NULL,
	[UpdatedDt] [datetime] NULL
)
GO

ALTER TABLE Falta
	ADD CONSTRAINT FK_Trabajador_Falta
	FOREIGN KEY (TrabajadorId)
	REFERENCES Falta(Id)
GO

CREATE TABLE Permiso
(
	Id		BIGINT IDENTITY(1,1) PRIMARY KEY NOT NULL,
	FechaPermiso	datetime NOT NULL,
	Comentarios	NVARCHAR(250),
	TrabajadorId		BIGINT,
	[Estatus] [bit] NULL,
	[CreatedBy] [nvarchar](150) NOT NULL,
	[CreatedDt] [datetime] NOT NULL,
	[UpdatedBy] [nvarchar](150) NULL,
	[UpdatedDt] [datetime] NULL
)
GO

ALTER TABLE Permiso
	ADD CONSTRAINT FK_Trabajador_Permiso
	FOREIGN KEY (TrabajadorId)
	REFERENCES Trabajador(Id)
GO
