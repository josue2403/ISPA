# Dockerfile
FROM node:25

# Crear directorio de la aplicación
WORKDIR /usr/src/app

# Copiar archivos de dependencias primero (para optimizar la caché de Docker)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# COPIAR EL RESTO DE ARCHIVOS (Esto incluye index.js, index.html y la imagen de fondo)
# Usar "." copia todo lo que hay en tu carpeta actual de Zorin OS al contenedor
COPY . . 

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "index.js"]
