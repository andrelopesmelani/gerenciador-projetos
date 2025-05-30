# Gerenciador de Projetos - Nuxt.js + JSON Server

## 📋 Descrição do Projeto

Este é um sistema de gerenciamento de projetos desenvolvido com Nuxt.js (Vue 3) no frontend e JSON Server como backend mock. A aplicação permite:

- Visualizar lista de projetos
- Adicionar novos projetos
- Buscar projetos por nome
- Visualizar detalhes de cada projeto

## 🚀 Tecnologias Utilizadas

- **Frontend**: 
  - Nuxt.js 3 (Vue 3)
  - TypeScript
  - Pinia (Gerenciamento de estados globais)
  - Sass/SCSS
  - VueUse

- **Backend (Mock)**:
  - JSON Server
  - REST API

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm, yarn ou pnpm
- Git (opcional)

### Instalação

1. Clone o repositório (se aplicável):
   ```bash
   git clone https://github.com/andrelopesmelani/gerenciador-projetos.git
   cd gerenciador-projetos
   ```

2. Inicialização Front end:
    ```bash
    npm install
    npm run dev
    ```

3. Inicialização Json-Server:
    ```bash
    npm run api
    ```

### Estrutura

    ```bash
    /
    ├── assets/          # Arquivos estáticos
    ├── components/      # Componentes Vue
    ├── composables/     # Composables lógicos
    ├── layouts/         # Layouts da aplicação
    ├── pages/           # Rotas da aplicação
    ├── public/          # Arquivos públicos
    ├── server/          # API routes (Nuxt)
    ├── types/           # Tipos TypeScript
    ├── utils/           # Utilitários
    ├── app.vue          # Componente raiz
    ├── db.json          # Dados do JSON Server
    └── nuxt.config.ts   # Configuração do Nuxt
    ```
