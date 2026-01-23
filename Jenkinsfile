pipeline {
    agent any
    
    environment {
        // Asegura compatibilidad con Docker
        DOCKER_API_VERSION = '1.44' 
    }

    tools {
        // Asegúrate que estos nombres coincidan con los de "Global Tool Configuration" en tu Jenkins
        nodejs "Node25"
        dockerTool "Dockertool" 
    }

    stages {
        stage('Limpiar Workspace') {
            steps {
                // Borra todo lo anterior para que el users.json de GitHub sea el único
                cleanWs() 
            }
        }

        stage('Descargar Código') {
            steps {
                // Descarga la versión más reciente de tu repositorio
                git branch: 'main', url: 'https://github.com/josue2403/ISPA.git'
            }
        }

        stage('Construir Imagen Docker') {
            steps {
                // Construye la imagen. El --no-cache asegura que tome el users.json nuevo
                sh 'docker build --no-cache -t hola-mundo-node:latest .'
            }
        }

        stage('Desplegar Contenedor') {
            steps {
                sh '''
                    # 1. Detener y eliminar el contenedor viejo si existe
                    docker stop hola-mundo-node || true
                    docker rm hola-mundo-node || true
                    
                    # 2. Dar permisos al archivo descargado de GitHub para que Docker lo lea bien
                    chmod 666 ${WORKSPACE}/users.json

                    # 3. Ejecutar el contenedor
                    # -v mapea el archivo físico de tu laptop (${WORKSPACE}/users.json) 
                    # adentro del contenedor (/usr/src/app/users.json)
                    docker run -d --name hola-mundo-node \
                    -p 3000:3000 \
                    -v "${WORKSPACE}/users.json:/usr/src/app/users.json" \
                    hola-mundo-node:latest
                '''
            }
        }
    }

    post {
        success {
            echo '✅ ¡Despliegue automático completado! Revisa localhost:3000'
        }
        failure {
            echo '❌ El despliegue falló. Revisa los logs de la consola.'
        }
    }
}
