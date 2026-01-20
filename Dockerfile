FROM node:25
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# Al mover la copia de archivos al final y asegurar que Jenkins limpie el workspace,
# forzamos a Docker a leer el nuevo index.html
COPY . . 

EXPOSE 3000
CMD ["node", "index.js"]
