pipeline {
    agent any
    
    environment {
        DOCKER_API_VERSION = '1.44' 
    }

    tools {
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
                git branch: 'main', url: 'https://github.com/josue2403/ISPA.git'
            }
        }

        stage('Construir Imagen Docker') {
            steps {
                sh 'docker build --no-cache -t hola-mundo-node:latest .'
            }
        }

        stage('Desplegar Contenedor') {
            steps {
                sh '''
                    # 1. Limpiar contenedores previos
                    docker stop hola-mundo-node || true
                    docker rm hola-mundo-node || true
                    
                    # 2. Permisos a la carpeta física
                    chmod -R 777 /home/daniel/PLATAFORMA_AUTONOMO || true

                    # 3. MONTAJE DIRECTO: Usamos tu ruta física real
                    # Esto conecta tu carpeta de la laptop con la del contenedor
                    docker run -d --name hola-mundo-node \
                    -p 3000:3000 \
                    -v "/home/daniel/PLATAFORMA_AUTONOMO/users.json:/usr/src/app/users.json" \
                    hola-mundo-node:latest
                '''
            }
        }
    }

    post {
        success {
            echo '✅ ¡LOGRADO! El contenedor está usando tu archivo físico en /home/daniel/PLATAFORMA_AUTONOMO'
        }
        failure {
            echo '❌ Falló. Revisa que el archivo users.json exista en esa ruta exacta.'
        }
    }
}
