# Usar Ubuntu 18.04 como base
FROM ubuntu:bionic

# Instalar dependencias básicas
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Instalar libmongocrypt
RUN curl -sL https://www.mongodb.org/static/pgp/libmongocrypt.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/libmongocrypt.gpg \
    && echo 'deb https://libmongocrypt.s3.amazonaws.com/apt/ubuntu bionic/libmongocrypt/1.14 universe' | tee /etc/apt/sources.list.d/libmongocrypt.list \
    && apt-get update \
    && apt-get install -y libmongocrypt-dev \
    && mkdir -p /app/backend/lib \
    && cp /usr/lib/libmongocrypt.so /app/backend/lib/mongo_crypt_v1.so

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos del proyecto
COPY . .

# Instalar dependencias del backend y frontend
RUN cd backend && npm install \
    && cd ../frontend && npm install

# Exponer puertos (frontend: 3000, backend: ajusta si es diferente)
EXPOSE 3000

# Variables de entorno
ENV SHARED_LIB_PATH=/app/backend/lib/mongo_crypt_v1.so
ENV MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/test?retryWrites=true&w=majority

# Script de inicio para correr backend y frontend
CMD ["sh", "-c", "cd backend && npm start & cd frontend && npm start"]
