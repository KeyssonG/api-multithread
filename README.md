# MultiThread - Sistema de Gestão

Sistema de gestão empresarial desenvolvido com React, TypeScript e boas práticas de desenvolvimento.

## 🚀 Funcionalidades

- **Autenticação**: Sistema de login seguro
- **Cadastro de Empresas**: Formulário completo com validações
- **Dashboard**: Interface administrativa
- **Responsivo**: Design adaptável para diferentes dispositivos

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **React Router** para navegação
- **CSS Modules** para estilização
- **React IMask** para máscaras de input

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── PrivateRoute.tsx
├── constants/           # Configurações centralizadas
│   └── config.ts
├── contexts/            # Contextos React
│   └── AuthContext.tsx
├── hooks/              # Hooks customizados
├── pages/              # Páginas da aplicação
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   └── cadastroEmpresa.tsx
├── services/           # Serviços de API
│   └── authService.ts
├── styles/             # Estilos CSS Modules
├── types/              # Tipos TypeScript
│   └── common.ts
├── utils/              # Utilitários
│   └── validation.ts
└── App.tsx
```

## 🎨 Design System

### Cores
- **Primária**: `#000` (Preto)
- **Secundária**: `#222` (Cinza escuro)
- **Background**: `#dfdfdf` (Cinza claro)
- **Texto**: `#333` (Cinza escuro)

### Componentes
- **Header**: Navegação fixa no topo
- **Footer**: Rodapé fixo com informações
- **Formulários**: Design consistente com validações

## 🔧 Configuração

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 📋 Boas Práticas Implementadas

### 1. **Estrutura Modular**
- Componentes reutilizáveis (Header, Footer)
- Separação clara de responsabilidades
- Arquivos organizados por funcionalidade

### 2. **Tipagem Forte**
- TypeScript em todo o projeto
- Interfaces centralizadas em `/types`
- Tipos específicos para formulários e APIs

### 3. **Configuração Centralizada**
- Constantes em `/constants/config.ts`
- URLs da API centralizadas
- Cores e rotas padronizadas

### 4. **Validações**
- Utilitários de validação em `/utils/validation.ts`
- Validação de CNPJ com algoritmo oficial
- Mensagens de erro consistentes

### 5. **Estilização Consistente**
- CSS Modules para isolamento de estilos
- Cores padronizadas entre header e footer
- Design responsivo

### 6. **Tratamento de Erros**
- Try/catch em operações assíncronas
- Mensagens de erro amigáveis
- Logs para debugging

## 🔒 Segurança

- Validação de formulários no frontend
- Sanitização de dados
- Tratamento seguro de tokens

## 📱 Responsividade

- Design mobile-first
- Breakpoints para diferentes tamanhos de tela
- Componentes adaptáveis

## 🚀 Deploy

O projeto está configurado para deploy com:
- **Docker**: Containerização completa
- **Kubernetes**: Orquestração de containers
- **Jenkins**: CI/CD pipeline

## 👨‍💻 Desenvolvimento

**Desenvolvido por Keysson**

Sistema de Gestão ideal para o seu negócio.
Todos os direitos reservados © 2025
