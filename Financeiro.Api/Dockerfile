FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Financeiro.Api.csproj", "./"]
COPY ["../Financeiro.Application/Financeiro.Application.csproj", "../Financeiro.Application/"]
COPY ["../Financeiro.Domain/Financeiro.Domain.csproj", "../Financeiro.Domain/"]
COPY ["../Financeiro.Infrastructure/Financeiro.Infrastructure.csproj", "../Financeiro.Infrastructure/"]

RUN dotnet restore "Financeiro.Api.csproj"

COPY . .
WORKDIR /src
RUN dotnet publish "Financeiro.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5283
ENTRYPOINT ["dotnet", "Financeiro.Api.dll"]
