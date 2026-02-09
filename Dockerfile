# Use SDK to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# 1. Copy only the csproj first to take advantage of Docker caching
COPY ["FieldServiceCRM/FieldServiceCRM.csproj", "FieldServiceCRM/"]
RUN dotnet restore "FieldServiceCRM/FieldServiceCRM.csproj"

# 2. Copy the rest of the source code
COPY FieldServiceCRM/. ./FieldServiceCRM/

# 3. Publish the release build
WORKDIR "/src/FieldServiceCRM"
RUN dotnet publish -c Release -o /app/out

# 4. Use the lightweight Runtime image for the final container
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy the published files from the build stage
COPY --from=build /app/out .

# Railway needs to know which port to listen on
EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:8080

ENTRYPOINT ["dotnet", "FieldServiceCRM.dll"]