# ─────────────────────────────────────────────
#  Base: Node 18 LTS (Alpine para imagen ligera)
# ─────────────────────────────────────────────
FROM node:18-alpine

# Instalar dependencias del sistema necesarias para Expo
RUN apk add --no-cache \
    bash \
    git \
    curl \
    python3 \
    make \
    g++

# Instalar Expo CLI globalmente
RUN npm install -g expo-cli@latest eas-cli

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias primero (mejor cache de Docker)
COPY package.json ./
COPY package-lock.json* ./

# Instalar dependencias del proyecto
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto de Metro Bundler (Expo)
EXPOSE 8081
# Puerto para el servidor de desarrollo de Expo
EXPOSE 19000
# Puerto para el canal de DevTools
EXPOSE 19001
# Puerto para tunnel mode
EXPOSE 19002

# Variable de entorno para que Expo funcione dentro de Docker
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0

# Comando por defecto: inicia Expo y muestra el QR en consola
CMD ["npx", "expo", "start", "--host", "lan"]
