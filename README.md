# Sistema de Gerenciamento de Carros

Sistema completo de gerenciamento de carros desenvolvido com tecnologias modernas. O projeto é composto por uma API REST robusta em Node.js e uma interface web intuitiva em React.

## 🚀 Visão Geral

Este sistema permite o gerenciamento completo de carros, incluindo:

- **Gestão de Marcas**: Criação, edição, listagem e remoção de marcas de veículos
- **Gestão de Modelos**: Associação de modelos às marcas correspondentes
- **Gestão de Carros**: Cadastro completo de veículos com informações detalhadas
- **Interface Responsiva**: Design adaptável para desktop e mobile
- **Tema Customizável**: Suporte a modo claro e escuro
- **Documentação Completa**: Storybook para componentes e Swagger para API

## 📖 Aplicação No Ar

Acesse a aplicação no ar:

- **[Ws - AutoManager](https://ws-work-frontend.netlify.app/)** - Aplicação completa
- **[API Documentation](https://ws-work-teste-tecnico.onrender.com/docs)** - Swagger UI interativo
- **[Component Library](https://ws-work-frontend.netlify.app/storybook)** - Storybook com todos os componentes
- **[Backend README](./backend-nodejs/README.md)** - Documentação técnica da API
- **[Frontend README](./frontend-reactjs/README.md)** - Documentação técnica da interface

## 🏗️ Arquitetura do Projeto

```
ws-work-teste-tecnico/
├── backend-nodejs/          # API REST - Node.js + TypeScript + Fastify
│   ├── src/
│   │   ├── modules/         # Módulos de negócio (brands, models, cars)
│   │   └── core/            # Configurações e infraestrutura
│   ├── prisma/              # Schema e migrações do banco
│   └── tests/               # Testes de integração
│
├── frontend-reactjs/        # Interface Web - React + TypeScript + Vite
│   ├── src/
│   │   ├── components/      # Componentes React organizados por feature
│   │   ├── hooks/           # Custom hooks para lógica reutilizável
│   │   ├── services/        # Camada de comunicação com a API
│   │   └── stories/         # Documentação Storybook
│   └── .storybook/          # Configuração do Storybook
│
└── docker-compose.yml       # Orquestração de containers
```

## 🛠️ Tecnologias Utilizadas

### Backend

- **Node.js** + **TypeScript** - Ambiente de execução e linguagem
- **Fastify** - Framework web performático
- **Prisma** - ORM moderno para TypeScript
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Validação de esquemas
- **Vitest** - Framework de testes

### Frontend

- **React 19** + **TypeScript** - Biblioteca de UI e tipagem
- **Vite** - Build tool moderna e rápida
- **TailwindCSS** - Framework CSS utilitário
- **shadcn/ui** + **Radix UI** - Componentes acessíveis
- **TanStack Query** - Gerenciamento de estado servidor
- **React Hook Form** - Gerenciamento de formulários
- **Storybook** - Documentação de componentes

### DevOps

- **Docker** + **Docker Compose** - Containerização
- **ESLint** + **Prettier** - Qualidade e formatação de código

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **Docker** e **Docker Compose**
- **Node.js** v22.18 ou superior
- **NPM** ou gerenciador de pacotes equivalente

### Execução Rápida com Docker

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/andreydantasvf/ws-work-teste-tecnico.git
   cd ws-work-teste-tecnico
   ```

2. **Inicie todos os serviços**:

   ```bash
   docker-compose up -d
   ```

3. **Execute as migrações do banco de dados**:

   ```bash
   docker exec -it node_api npm run prisma:migrate
   ```

4. **Acesse as aplicações**:
   - **Frontend**: http://localhost:8080
   - **Backend API**: http://localhost:3333
   - **Swagger Docs**: http://localhost:3333/docs

### Desenvolvimento Local

Para desenvolvimento, consulte os READMEs específicos:

- **[📚 Backend - API Documentation](./backend-nodejs/README.md)**
- **[🎨 Frontend - Interface Documentation](./frontend-reactjs/README.md)**

## 📋 Funcionalidades

### ✅ Implementadas

- [x] API REST completa para Marcas, Modelos e Carros
- [x] Interface web responsiva com React
- [x] Validação de dados client e server-side
- [x] Sistema de temas (claro/escuro)
- [x] Componentes documentados no Storybook
- [x] Testes de integração da API
- [x] Documentação Swagger automática
- [x] Filtros, ordenação e paginação
- [x] Containerização com Docker

## 📊 Screenshots

<img src="./.github/print-dark.png" />

## 🧪 Testando o Sistema

### Testes do Backend

```bash
cd backend-nodejs
sh ./scripts/test-integration.sh
```

### Testando a Interface

```bash
cd frontend-reactjs
npm run storybook  # Abre o Storybook em http://localhost:6006
```

## 📄 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.

---

**Desenvolvido com ❤️ usando as melhores práticas de desenvolvimento moderno**
