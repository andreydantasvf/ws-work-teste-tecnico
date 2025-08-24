# Back-end - Sistema de Gerenciamento de Carros

Esta é a API back-end para o sistema de gerenciamento de carros, desenvolvida como parte de um desafio técnico. A aplicação é construída com Node.js, Fastify, TypeScript e Prisma, seguindo as melhores práticas de desenvolvimento de software para garantir um código limpo, escalável e de fácil manutenção.

## Tabela de Conteúdos

- [Filosofia e Estrutura do Projeto](#filosofia-e-estrutura-do-projeto)
  - [Estrutura de Módulos](#estrutura-de-módulos)
  - [Arquitetura em Camadas](#arquitetura-em-camadas)
  - [Estrutura de Pastas](#estrutura-de-pastas)
  - [Validação e Tipagem](#validação-e-tipagem)
- [Como Iniciar o Projeto](#como-iniciar-o-projeto)
  - [Pré-requisitos](#pré-requisitos)
  - [Passo a Passo](#passo-a-passo)
- [Executando os Testes](#executando-os-testes)
  - [Opção 1: Script Automatizado (Recomendado)](#opção-1-script-automatizado-recomendado)
  - [Opção 2: Comandos Manuais via `package.json`](#opção-2-comandos-manuais-via-packagejson)
- [Endpoints da API](#endpoints-da-api)

---

## Filosofia e Estrutura do Projeto

A principal decisão arquitetural foi organizar o código de forma modular e desacoplada, facilitando a manutenção e a adição de novas funcionalidades.

### Estrutura de Módulos

O projeto adota uma estrutura de **Feature-Sliced Design**. Dentro de `src/modules`, cada funcionalidade principal (como `brands`, `models`, `cars`) é um módulo autocontido. Cada módulo possui:

- `*.controller.ts`: Responsável por receber as requisições HTTP, validar os dados de entrada e retornar as respostas. Nenhuma regra de negócio reside aqui.
- `*.service.ts`: Contém a lógica de negócio da funcionalidade. Orquestra as operações e utiliza o repositório para acessar o banco de dados.
- `*.repository.ts`: Camada de abstração do acesso a dados. É o único local que interage diretamente com o Prisma para consultas ao banco de dados.
- `*.routes.ts`: Define as rotas da API para o módulo, associando-as aos métodos do controller.
- `*.schema.ts`: Define os schemas de validação com **Zod** para os dados de entrada (body, params, query) e para as respostas da API, garantindo a integridade dos dados e servindo como base para a documentação OpenAPI (Swagger).
- `*.types.ts`: Define as interfaces e tipos TypeScript para a funcionalidade.

### Arquitetura em Camadas

A comunicação entre os componentes segue um fluxo unidirecional claro (Controller → Service → Repository), o que torna o código previsível e fácil de depurar.

1. **Controller**: Camada de entrada da aplicação.
2. **Service**: O "cérebro" de cada funcionalidade.
3. **Repository**: A "mão" que busca e manipula os dados.

Essa separação de responsabilidades (SoC) é fundamental para a testabilidade e escalabilidade do projeto.

### Estrutura de Pastas

A organização das pastas segue a lógica modular descrita anteriormente, separando claramente as responsabilidades e facilitando a navegação.

```text
.
├── prisma/                  # Contém o schema do banco de dados e as migrações.
│   └── schema.prisma
├── scripts/                 # Scripts úteis para o projeto.
│   └── test-integration.sh  # Script para rodar os testes de integração de forma automatizada.
├── src/                     # Código-fonte da aplicação.
│   ├── core/                # Núcleo da aplicação (configurações não relacionadas a negócio).
│   │   ├── config/          # Configuração de variáveis de ambiente.
│   │   ├── database/        # Configuração da conexão com o banco de dados (Prisma).
│   │   └── webserver/       # Configurações do servidor Fastify (app, error handler).
│   ├── modules/             # Módulos de negócio da aplicação.
│   │   ├── brands/          # Módulo de Marcas.
│   │   ├── cars/            # Módulo de Carros.
│   │   └── models/          # Módulo de Modelos.
│   └── server.ts            # Ponto de entrada (entry point) que inicia o servidor.
├── tests/                   # Suíte de testes automatizados.
│   ├── helpers/             # Código de suporte para os testes (ex: setup do app).
│   └── integration/         # Testes de integração para cada módulo.
├── .dockerignore            # Arquivos a serem ignorados pelo Docker.
├── .env.example             # Arquivo de exemplo para as variáveis de ambiente.
├── docker-compose.test.yml  # Docker Compose para o ambiente de testes.
├── docker-compose.yml       # Docker Compose para o ambiente de desenvolvimento.
├── Dockerfile               # Define a imagem Docker para a aplicação.
├── package.json             # Dependências e scripts do projeto.
├── tsconfig.json            # Configurações do compilador TypeScript.
└── vitest.config.ts         # Configurações do Vitest.
```

### Validação e Tipagem

- **TypeScript**: Utilizado em todo o projeto para garantir a segurança de tipos e melhorar a experiência de desenvolvimento.
- **Zod**: Para validação de schemas em tempo de execução. Ele previne que dados inválidos cheguem às camadas de negócio e ao banco de dados, além de gerar documentação automática para as rotas.

---

## Como Iniciar o Projeto

Siga os passos abaixo para configurar e executar o ambiente de desenvolvimento localmente.

### Pré-requisitos

- **Node.js**: v18 ou superior
- **Docker** e **Docker Compose**
- **NPM** (ou um gerenciador de pacotes de sua preferência)

### Passo a Passo

1. **Navegue até a pasta do projeto**:

   ```bash
   cd backend-nodejs
   ```

2. **Instale as dependências**:

   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**:
   Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`.

   ```bash
   cp .env.example .env
   ```

   O arquivo `.env` já vem pré-configurado para o ambiente Docker local, mas você pode ajustá-lo se necessário.

4. **Inicie os Containers**:
   Suba o container do PostgreSQL e da API com o Docker Compose.

   ```bash
   docker-compose up -d
   ```

5. **Execute as Migrations do Banco de Dados**:
   Com os containers em execução, aplique as migrations para criar as tabelas.

   OBS: Esse passo só precisa ser feito na primeira execução do projeto ou quando se tem alguma alteração no schema.

   ```bash
   docker exec -it node_api npm run prisma:migrate
   ```

Pronto! A API estará em execução e acessível em `http://localhost:3333`.

---

## Executando os Testes

Os testes de integração foram desenvolvidos com **Vitest** e **Supertest** e rodam em um banco de dados de teste separado e isolado para garantir que não afetem os dados de desenvolvimento.

### Opção 1: Script Automatizado (Recomendado)

Para facilitar a execução dos testes, foi criado um script que cuida de todo o ciclo de vida do ambiente de teste.

- **O que o script faz?**
  1.  Sobe o banco de dados de teste com Docker.
  2.  Aplica as migrations no banco de teste.
  3.  Executa a suíte de testes do Vitest.
  4.  Derruba o container do banco de dados de teste ao final.

- **Como executar?**
  Na raiz da pasta `backend-nodejs`, execute o comando:
  ```bash
  sh ./scripts/test-integration.sh
  ```

### Opção 2: Comandos Manuais via `package.json`

Se preferir ter mais controle sobre o processo, você pode executar os testes manualmente.

1.  **Inicie o banco de dados de teste**:

    ```bash
    docker-compose -f docker-compose.test.yml up -d
    ```

2.  **Execute as migrations no banco de teste**:

    ```bash
    npm run test:db:migrate
    ```

3.  **Execute um dos seguintes comandos**:
    - Para rodar todos os testes uma vez:
      ```bash
      npm test
      ```
    - Para rodar os testes em modo "watch", ideal para desenvolvimento:
      ```bash
      npm run test:watch
      ```
    - Para rodar os testes e gerar um relatório de cobertura:
      ```bash
      npm run test:coverage
      ```

4.  **Desligue o banco de dados de teste** quando terminar:
    ```bash
    docker-compose -f docker-compose.test.yml down
    ```

---

## Endpoints da API

Abaixo está um resumo dos principais endpoints disponíveis. Para detalhes sobre os schemas de request e response, consulte a documentação OpenAPI/Swagger gerada pela aplicação. A documentação completa é executado na rota `/docs`.

| Método   | Rota                     | Descrição                                                    |
| :------- | :----------------------- | :----------------------------------------------------------- |
| `POST`   | `/api/brands`            | Cria uma nova marca.                                         |
| `GET`    | `/api/brands`            | Lista todas as marcas.                                       |
| `GET`    | `/api/brands/:id`        | Busca uma marca por ID.                                      |
| `PUT`    | `/api/brands/:id`        | Atualiza uma marca.                                          |
| `DELETE` | `/api/brands/:id`        | Deleta uma marca.                                            |
| `GET`    | `/api/brands/:id/models` | **(Extra)** Lista todos os modelos de uma marca específica.  |
| `POST`   | `/api/models`            | Cria um novo modelo.                                         |
| `GET`    | `/api/models`            | Lista todos os modelos.                                      |
| `GET`    | `/api/models/:id`        | Busca um modelo por ID.                                      |
| `PUT`    | `/api/models/:id`        | Atualiza um modelo.                                          |
| `DELETE` | `/api/models/:id`        | Deleta um modelo.                                            |
| `POST`   | `/api/cars`              | Cria um novo carro.                                          |
| `GET`    | `/api/cars`              | **(Extra)** Lista carros com filtros, ordenação e paginação. |
| `GET`    | `/api/cars/:id`          | Busca um carro por ID.                                       |
| `PUT`    | `/api/cars/:id`          | Atualiza um carro.                                           |
| `DELETE` | `/api/cars/:id`          | Deleta um carro.                                             |
