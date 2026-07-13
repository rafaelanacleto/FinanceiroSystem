# FinanceiroSystem
Sistema Financeiro Pessoal — API .NET 10 + React + Keycloak + SQL Server + Redis + RabbitMQ

[Browser / Frontend React]
            |
            | HTTP(S)
            v
      [API Gateway]
            |
    +-------+--------+
    |                |
    v                v
[Financeiro.Api]  [outros serviços futuros]
    |
    +-- SQL Server
    +-- Redis
    +-- RabbitMQ
    +-- Keycloak

---

## Pré-requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [Docker + Docker Compose](https://docs.docker.com/compose/install/)

---

## 1. Subir a stack local

Na raiz do projeto, execute:

```bash
docker compose up -d --build
```

Isso sobe os seguintes serviços:

| Serviço | Endereço | Descrição |
|---|---|---|
| Frontend | http://localhost:3000 | Aplicação React/Vite |
| API .NET | http://localhost:5283/swagger | Backend financeiro |
| RabbitMQ UI | http://localhost:15672 | Gerenciamento do broker |
| Keycloak | http://localhost:8080 | Autenticação / JWT |
| SQL Server | localhost:1433 | Banco principal |
| Redis | localhost:6379 | Cache |

---

## 2. Credenciais locais

- RabbitMQ:
  - usuário: `guest`
  - senha: `guest`
- Keycloak:
  - usuário: `admin`
  - senha: `admin`

---

## 3. Configurar o Keycloak

1. Acesse http://localhost:8080
2. Faça login com `admin` / `admin`
3. Crie um realm chamado `Financeiro`
4. Crie um client chamado `financeiro-api`
   - Client authentication: `ON`
   - Valid redirect URIs: `http://localhost:3000/*`
   - Web origins: `http://localhost:3000`
5. Crie um usuário de teste e defina uma senha

---

## 4. Aplicar as migrations

Se precisar criar/atualizar o banco:

```bash
cd Financeiro.Api
dotnet ef database update
```

---

## 5. Rodar os projetos localmente sem Docker

### API

```bash
cd Financeiro.Api
dotnet run
```

### Frontend

```bash
cd Financeiro.Web
npm install
npm run dev
```

---

## 6. Comandos úteis

```bash
# Subir tudo
docker compose up -d --build

# Verificar containers
docker compose ps

# Parar tudo
docker compose stop

# Remover containers e redes
# docker compose down
```

---

## 7. Estrutura do projeto

```text
FinanceiroSystem/
├── Financeiro.Api/           # API ASP.NET Core
├── Financeiro.Application/   # CQRS e handlers
├── Financeiro.Domain/        # Entidades e regras de domínio
├── Financeiro.Infrastructure/ # EF Core, DbContext e migrations
├── Financeiro.Web/           # Frontend React + Vite
└── docker-compose.yml        # Orquestração local da stack
```

---

## 8. Observação para o futuro

A estrutura do compose já está preparada para receber uma futura API de e-mail e para a comunicação via RabbitMQ entre os serviços. Para isso, basta adicionar mais um serviço no mesmo arquivo e apontar a conexão para o host `rabbitmq` dentro da rede Docker.


## 9. Pŕoximos passos

Podemos criar um gateway na frente do sistema?
Sim, podemos.

Quando faz sentido
Você quer uma única entrada para todos os serviços
Planeja adicionar mais APIs/microserviços no futuro
Deseja centralizar:
TLS/HTTPS
roteamento
log de requisições
rate limiting
autenticação/autorização
versionamento de API
CORS

O que eu recomendaria
Se o objetivo for apenas proxy reverso e unificação de host: Nginx, Traefik ou Caddy
Se quiser gateway específico .NET com roteamento e políticas: Ocelot
Se quiser um gateway de API mais completo: Kong, API Umbrella, Ambassador, etc.
Como encaixar no docker-compose.yml
Adicionar um serviço gateway
Fazer o frontend acessar o gateway em vez de chamar api direto
O gateway direciona as requisições para api
Backend pode continuar validando JWT no Financeiro.Api
Observação prática
Hoje o projeto é essencialmente um backend monolítico + frontend separado. Um gateway não é obrigatório agora, mas é uma boa camada de infraestrutura se você quiser:

melhorar a organização
preparar para múltiplos serviços
padronizar entrada de tráfego
Se quiser, posso também sugerir uma configuração específica de docker-compose.yml com Traefik ou Ocelot.