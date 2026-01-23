pipeline {
    agent any
    
    environment {
        DOCKER_API_VERSION = '1.44' 
    }

    // QUITAMOS la sección "tools" de Nodejs porque usaremos Docker directamente

    stages {
        stage('Limpiar Workspace') {
            steps {
                cleanWs() 
            }
        }

        stage('Descargar Código') {
            steps {
                git branch: 'main', url: 'https://github.com/josue2403/ISPA.git'
            }
        }

        stage('Construir Imagen Docker') {
            steps {
                // Docker se encarga de todo, no necesita el Node de Jenkins
                sh 'docker build --no-cache -t hola-mundo-node:latest .'
            }
        }

        stage('Desplegar Contenedor') {
            steps {
                sh '''
                    docker stop hola-mundo-node || true
                    docker rm hola-mundo-node || true
                    
                    # Si estás en Windows/Docker Desktop, chmod puede fallar, 
                    # lo ponemos con "|| true" para que no detenga el proceso.
                    chmod 666 ${WORKSPACE}/users.json || true

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
            echo '✅ ¡Despliegue automático completado!'
        }
        failure {
            echo '❌ El despliegue falló. Revisa la conexión o Docker.'
        }
    }
}
