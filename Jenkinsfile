pipeline {
    agent any
    
    environment {
        DOCKER_API_VERSION = '1.44' 
    }

    tools {
        // Usamos solo la herramienta de Docker que configuraste en Jenkins
        dockerTool "Dockertool" 
    }

    stages {
        stage('Limpiar Workspace') {
            steps {
                cleanWs() 
            }
        }

        stage('Descargar Código') {
            steps {
                // Descarga el código y el users.json
                git branch: 'main', url: 'https://github.com/josue2403/ISPA.git'
            }
        }

        stage('Construir Imagen Docker') {
            steps {
                script {
                    // Usamos docker.withTool para asegurar que encuentre el ejecutable
                    sh 'docker build --no-cache -t hola-mundo-node:latest .'
                }
            }
        }

        stage('Desplegar Contenedor') {
            steps {
                sh '''
                    # Detener versiones anteriores
                    docker stop hola-mundo-node || true
                    docker rm hola-mundo-node || true
                    
                    # Permisos para el json
                    chmod 666 ${WORKSPACE}/users.json || true

                    # Ejecutar con volumen
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
            echo '✅ ¡LOGRADO! El despliegue automático está funcionando.'
        }
        failure {
            echo '❌ Sigue faltando algo en la configuración de Docker en Jenkins.'
        }
    }
}
