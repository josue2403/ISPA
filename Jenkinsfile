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
                            # 1. Limpiar versiones anteriores
                            docker stop hola-mundo-node || true
                            docker rm hola-mundo-node || true
                            
                            # 2. En lugar de montar el archivo solo, montamos la carpeta actual (.)
                            # Esto asegura que el contenedor vea el archivo users.json correctamente.
                            docker run -d --name hola-mundo-node \
                            -p 3000:3000 \
                            -v "$(pwd)/users.json:/usr/src/app/users.json" \
                            hola-mundo-node:latest
                        '''
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
