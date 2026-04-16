# FinanceiroSystem
Sistema Financeiro Pessoal — API .NET 10 + React 19 + Keycloak + SQL Server + Redis

---

## Pré-requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [Docker + Docker Compose](https://docs.docker.com/compose/install/)

---

## 1. Subir a infraestrutura (Docker)

Na raiz do projeto, suba todos os serviços de infra:

```bash
docker compose up -d
```

Isso sobe:

| Serviço       | Endereço                  | Descrição                  |
|---------------|---------------------------|----------------------------|
| PostgreSQL    | `localhost:5432`          | Banco de dados principal   |
| Keycloak      | `http://localhost:8080`   | Autenticação / JWT         |
| Redis         | `localhost:6379`          | Cache distribuído          |
| OTel Collector| `localhost:4317` / `4318` | Recepção e roteamento OTLP |
| Jaeger        | `http://localhost:16686`  | Visualização de traces     |
| Prometheus    | `http://localhost:9090`   | Coleta e consulta métricas |
| Grafana       | `http://localhost:3000`   | Dashboards de observabilidade |

Observação: a API está configurada para exportar logs, métricas e traces via OTLP
para o OpenTelemetry Collector em `http://localhost:4318`.

---

## 2. Configurar o Keycloak

1. Acesse `http://localhost:8080` e faça login com `admin` / `admin`
2. Crie um **Realm** chamado `Financeiro`
3. Crie um **Client** chamado `financeiro-api`
   - Client authentication: **ON**
   - Valid redirect URIs: `http://localhost:5173/*`
   - Web origins: `http://localhost:5173`
4. Crie um usuário de teste e defina uma senha

---

## 3. Aplicar as migrations (banco de dados)

```bash
cd Financeiro.Api
dotnet ef database update
```

---

## 4. Rodar a API (.NET)

```bash
cd Financeiro.Api
dotnet run
```

A API estará disponível em `http://localhost:5283`.  
Swagger em `http://localhost:5283/swagger`.

---

## 5. Rodar o frontend (React)

```bash
cd Financeiro.Web
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

---

## Resumo dos comandos

```bash
# 1. Infraestrutura
docker compose up -d

# 2. Migrations
cd Financeiro.Api && dotnet ef database update && cd ..

# 3. API (terminal separado)
cd Financeiro.Api && dotnet run

# 4. Frontend (terminal separado)
cd Financeiro.Web && npm install && npm run dev
```

---

## Estrutura do projeto

```
FinanceiroSystem/
├── Financeiro.Api/           # Controllers, Program.cs, configurações
├── Financeiro.Application/   # CQRS — Commands, Queries, Handlers
├── Financeiro.Domain/        # Entidades e exceções de domínio
├── Financeiro.Infrastructure/# DbContext e Migrations (EF Core)
├── Financeiro.Web/           # Frontend React + Vite + TailwindCSS
└── docker-compose.yml        # Infraestrutura local
```
