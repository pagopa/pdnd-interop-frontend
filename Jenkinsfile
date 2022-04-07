pipeline {

  agent none

  stages {
    stage('Test and Publish') {
      agent { label 'sbt-template' }
      environment {
        DOCKER_REPO = "${env.DOCKER_REPO}"
        ECR_RW = credentials('ecr-rw')
        VERSION = getVersion()
      }
      steps {
        container('sbt-container') {
          script {
            sh 'docker build --network host -t $DOCKER_REPO/interop-frontend:$VERSION .'
            withCredentials([usernamePassword(credentialsId: 'ecr-rw', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
              sh '''
              aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin $DOCKER_REPO
              '''
            }
            sh 'docker image push $DOCKER_REPO/interop-frontend:$VERSION'
          }
        }
      }
    }
  }
}

String getVersion() {
  return sh(
    returnStdout: true, 
    script: '''
      if [ -n "${TAG_NAME}" ]; then 
        echo ${TAG_NAME}
      else
        echo ${GIT_LOCAL_BRANCH}-latest
      fi
    '''
  ).trim()
}