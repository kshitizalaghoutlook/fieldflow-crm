FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY FieldServiceCRM/FieldServiceCRM.csproj ./FieldServiceCRM/
RUN dotnet restore FieldServiceCRM/FieldServiceCRM.csproj

# Copy everything and build
COPY FieldServiceCRM/. ./FieldServiceCRM/
WORKDIR /src/FieldServiceCRM
RUN dotnet publish -c Release -o /app/out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://0.0.0.0:8080

ENTRYPOINT ["dotnet", "FieldServiceCRM.dll"]