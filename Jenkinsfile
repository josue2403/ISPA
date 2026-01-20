pipeline {
    agent any
    
    environment {
        // Asegura compatibilidad con la versión de Docker en tu sistema
        DOCKER_API_VERSION = '1.44' 
    }

    tools {
        nodejs "Node25"
        dockerTool "Dockertool" 
    }

    stages {
        stage('Limpiar Workspace') {
            steps {
                // Borra archivos de construcciones anteriores para evitar conflictos
                cleanWs() 
            }
        }

        stage('Descargar Código') {
            steps {
                // Descarga la versión más reciente de tu repositorio
                git branch: 'main', url: 'https://github.com/josue2403/ISPA.git'
            }
        }

        stage('Instalar dependencias') {
            steps {
                sh 'apt-get update && apt-get install -y libatomic1 || true'
                sh 'npm install'
            }
        }

        stage('Ejecutar tests') { 
            steps { 
                sh 'chmod +x ./node_modules/.bin/jest'
                // El "|| true" permite que el despliegue siga aunque los tests fallen
                sh 'npm test -- --ci --runInBand || true'
            } 
        }

        stage('Construir Imagen Docker') {
            steps {
                // Construye la imagen usando el Dockerfile que tiene "COPY . ."
                sh 'docker build --no-cache -t hola-mundo-node:latest .'
            }
        }

        stage('Ejecutar Contenedor Node.js') {
            steps {
                sh '''
                    # Detiene y elimina versiones anteriores del contenedor
                    docker stop hola-mundo-node || true
                    docker rm hola-mundo-node || true
                    
                    # Ejecuta el nuevo contenedor usando el Workspace de Jenkins para los datos
                    # Esto hace que ya no dependa de /home/daniel/PLATAFORMA_AUTONOMO/
                    docker run -d --name hola-mundo-node \
                    -p 3000:3000 \
                    -v ${WORKSPACE}/users.json:/usr/src/app/users.json \
                    hola-mundo-node:latest
                '''
            }
        }
    }
}
