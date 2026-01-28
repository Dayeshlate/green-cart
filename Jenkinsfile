pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Dayeshlate/green-cart.git'
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'f77912a3-1eb0-45ab-85ed-6f076fdff1fc',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                }
            }
        }

        stage('Build Images') {
            steps {
                sh '''
                docker build -t green-server-image ./server
                docker build -t green-client-image ./client
                '''
            }
        }

        stage('Push Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'f77912a3-1eb0-45ab-85ed-6f076fdff1fc',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    docker tag green-server-image $DOCKER_USER/green-server:latest
                    docker tag green-client-image $DOCKER_USER/green-client:latest

                    docker push $DOCKER_USER/green-server:latest
                    docker push $DOCKER_USER/green-client:latest
                    '''
                }
            }
        }

        stage('Create Network') {
            steps {
                sh 'docker network create green-net || true'
            }
        }

        stage('Run MongoDB') {
            steps {
                sh '''
                docker rm -f green-mongo-container || true
                docker run -d --name green-mongo-container --network green-net \
                  -e MONGO_INITDB_ROOT_USERNAME=root \
                  -e MONGO_INITDB_ROOT_PASSWORD=root \
                  -p 27017:27017 \
                  mongo:7
                '''
            }
        }

        stage('Wait for Mongo') {
            steps {
                sh 'sleep 15'
            }
        }

        stage('Run Node Backend') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'f77912a3-1eb0-45ab-85ed-6f076fdff1fc',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    docker rm -f green-server-container || true
                    docker pull $DOCKER_USER/green-server:latest

                    docker run -d --name green-server-container --network green-net \
                      -e PORT=3000 \
                      -e FRONTEND_URL=http://localhost:5173 \
                      -e MONGODB_URI=mongodb://root:root@green-mongo-container:27017/greencart?authSource=admin \
                      -e JWT_SECRET=Gx9R4mP7QvA2ZsK8WJcE5L0N6FHyT3uB \
                      -p 3000:3000 \
                      $DOCKER_USER/green-server:latest
                    '''
                }
            }
        }

        stage('Run React Frontend') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'f77912a3-1eb0-45ab-85ed-6f076fdff1fc',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    docker rm -f green-client-container || true
                    docker pull $DOCKER_USER/green-client:latest

                    docker run -d --name green-client-container --network green-net \
                      -p 5173:5173 \
                      $DOCKER_USER/green-client:latest
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
        success {
            echo 'Green Cart MERN stack deployed successfully on ports 3000 / 5173 / 27017 🚀'
        }
    }
}
