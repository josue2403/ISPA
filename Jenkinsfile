pipeline {
    agent any
    
    environment {
        // Asegura compatibilidad con el motor de Docker
        DOCKER_API_VERSION = '1.44' 
    }

    tools {
        // Nombre de la herramienta Docker configurada en Jenkins
        dockerTool "Dockertool" 
    }

    stages {
        stage('Limpiar Workspace') {
            steps {
                // Borra archivos de builds previos para que el users.json de GitHub sea el nuevo
                cleanWs() 
            }
        }

        stage('Descargar Código') {
            steps {
                // Baja el código actualizado de tu repo
                git branch: 'main', url: 'https://github.com/josue2403/ISPA.git'
            }
        }

        stage('Construir Imagen Docker') {
            steps {
                // Construye la imagen ignorando el cache para incluir cambios en el JSON
                sh 'docker build --no-cache -t hola-mundo-node:latest .'
            }
        }

        stage('Desplegar Contenedor') {
            steps {
                sh '''
                    # 1. Detener y limpiar contenedores previos
                    docker stop hola-mundo-node || true
                    docker rm hola-mundo-node || true
                    
                    # 2. Asegurar permisos de lectura para el archivo users.json
                    chmod 666 ${WORKSPACE}/users.json || true

                    # 3. Ejecutar el contenedor usando la ruta absoluta del workspace
                    # Esto evita el error de "not a directory" que salió antes
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
            echo '✅ ¡DESPLIEGUE EXITOSO! El cambio en GitHub ya está en tu laptop.'
        }
        failure {
            echo '❌ Error en el pipeline. Revisa los logs arriba.'
        }
    }
}
